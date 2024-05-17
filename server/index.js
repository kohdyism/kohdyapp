const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').createServer(app);
const PORT = 4000;
const fs = require("fs/promises");
const socketIO = require('socket.io')(http, {
    cors: { origin: "http://localhost:3000" }
});

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        throw new Error('Failed to read data file');
    }
}

async function writeData(data) {
    try {
        const stringData = JSON.stringify(data, null, 2);
        await fs.writeFile(DATA_FILE, stringData);
    } catch (error) {
        console.error('Error writing data file:', error);
        throw new Error('Failed to write data file');
    }
}

async function updateProduct(data, updateType) {
    const dbData = await readData();
    const productIndex = dbData.products.findIndex(p => p.name === data.name);
    if (productIndex === -1 && updateType !== 'add') {
        throw new Error('Product not found');
    }

    switch (updateType) {
        case 'update':
            const product = dbData.products[productIndex];
            product.last_bidder = data.last_bidder;
            product.price = data.amount;
            if (!product.bid_history) {
                product.bid_history = [];
            }
            product.bid_history.push({
                bidder: data.last_bidder,
                amount: data.amount,
                timestamp: new Date().toISOString()
            });
            break;
        case 'add':
            dbData.products.push(data);
            break;
        case 'delete':
            dbData.products.splice(productIndex, 1);
            break;
        default:
            throw new Error('Invalid update type');
    }

    await writeData(dbData);
}

async function updateUser(data, updateType) {
    const dbData = await readData();
    const userIndex = dbData.users.findIndex(u => u.name === data.last_bidder);
    if (userIndex === -1 && updateType !== 'add') {
        throw new Error('User not found');
    }

    switch (updateType) {
        case 'update':
            const user = dbData.users[userIndex];
            if (!user.bid_history) {
                user.bid_history = [];
            }
            user.bid_history.push({
                product: data.name,
                amount: data.amount,
                timestamp: new Date().toISOString()
            });
            break;
        case 'add':
            dbData.users.push(data);
            break;
        case 'delete':
            dbData.users.splice(userIndex, 1);
            break;
        default:
            throw new Error('Invalid update type');
    }

    await writeData(dbData);
}

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });

    socket.on("deleteProduct", async (productData, callback) => {
        try {
            await updateProduct(productData, 'delete');
            socket.broadcast.emit('deleteProductResponse', productData);
            callback({ success: true });
        } catch (error) {
            console.error(error);
            callback({ success: false });
        }
    });

    socket.on("checkUser", async ({ phone }) => {
        try {
            const data = await readData();
            const user = data.users.find(user => user.phone === phone);
            socket.emit("userCheckResponse", { exists: !!user, user });
        } catch (error) {
            socket.emit("userCheckResponse", { exists: false, error: "Failed to check user." });
        }
    });

    socket.on('addUser', async (userData, callback) => {
        try {
            await updateUser(userData, 'add');
            callback({ success: true });
        } catch (error) {
            callback({ success: false, error: "Failed to add user." });
        }
    });

    socket.on("deleteUser", async (userData, callback) => {
        try {
            await updateUser(userData, 'delete');
            socket.broadcast.emit('deleteUserResponse', userData);
            callback({ success: true });
        } catch (error) {
            console.error(error);
            callback({ success: false });
        }
    });

    socket.on('addProduct', async (productData, callback) => {
        try {
            await updateProduct(productData, 'add');
            socket.broadcast.emit("addProductResponse", productData);
            callback({ success: true });
        } catch (error) {
            callback({ success: false });
        }
    });

    socket.on("bidProduct", async (productData, callback) => {
        try {
            await updateProduct(productData, 'update');
            await updateUser(productData, 'update');
            socket.broadcast.emit("bidProductResponse", productData);
            socket.emit("bidProductResponse", productData);
            callback({ success: true });
        } catch (error) {
            console.error(error);
            callback({ success: false });
        }
    });
});

app.get("/api", async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Add an endpoint to get a specific user's bid history
app.get("/api/user/:name", async (req, res) => {
    try {
        const data = await readData();
        const user = data.users.find(user => user.name === req.params.name);
        if (user) {
            console.log(user);
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load user data' });
    }
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
