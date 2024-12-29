import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/Navbar';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home'; 
import Cancel from './pages/Cancel';
import Store from './pages/Store';
import Success from './pages/Success';
import CartProvider from './CartContext';
import Page404 from './NotFound';
import Detail from "./pages/detail";  // 正しくインポートされているか確認

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavbarComponent />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Store />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path='/detail/:slug' element={<Detail />} />  {/* パラメータslugを受け取る */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
