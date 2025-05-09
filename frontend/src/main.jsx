import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router';
import { ToastContainer } from 'react-toastify';
import './styles/index.css';

import Home from './pages/home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        {/*Da dobawq ako nqkoj put e gre[en da wodi do glawnata stranica*/}
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  </StrictMode>
);
