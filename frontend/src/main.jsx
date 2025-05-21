import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router';
import { ToastContainer } from 'react-toastify';
import './styles/index.css';
import {Provider} from 'react-redux'; 
import {store} from './app/store';

import Home from './pages/home';
import Ideas from './pages/ideas/ideas'
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import Activate from './pages/auth/Activate';
import PageNotFound from './pages/auth/PageNotFound';
import ResetPasswordConfirm from './pages/auth/ResetPasswordConfirm';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/activate/:uid/:token" element={<Activate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
      
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
