import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import socketIO from 'socket.io-client';

import AdminAddProduct from './components/adminaddproduct';
import AdminProducts from './components/adminproducts';
import BidProduct from './components/bidproduct';
import Products from './components/products';
import Login from './components/login';
import AdminLogin from './components/adminlogin';
import AdminUsers from './components/adminusers';
import Register from './components/register';
import Nav from './components/nav';
import AdminNav from './components/adminnav';
import LoginNav from './components/loginnav';
import UserHistory from './components/userhistory';

import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const socket = socketIO.connect('http://localhost:4000');

const Navigation = () => {
  const location = useLocation(); // Correctly used inside a functional component
  if (location.pathname === '/' || location.pathname === '/admin' || location.pathname === '/register') {
    return <LoginNav socket={socket} />;
  }
  return location.pathname.startsWith('/admin') ? <AdminNav socket={socket} /> : <Nav socket={socket} />;
}




function App() {
  return (
    <AuthProvider>
      <Router >
        <div>
          {/* This will now ensure that Navigation has access to the router context */}
          <Navigation />
          <Routes>
            <Route path="/" element={<Login socket={socket} />} />
            <Route path="/register" element={<Register socket={socket} />} />
            <Route path="/products" element={<ProtectedRoute><Products socket={socket} /></ProtectedRoute>} />
            <Route path="/bidhistory" element={<ProtectedRoute><UserHistory socket={socket} /></ProtectedRoute>} />
            <Route path="/products/bid/:name/:price" element={<ProtectedRoute><BidProduct socket={socket} /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminLogin socket={socket} />} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><AdminProducts socket={socket} /></ProtectedRoute>} />
            <Route path="/admin/products/add" element={<ProtectedRoute adminOnly={true}><AdminAddProduct socket={socket} /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsers socket={socket} /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
