import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router';
import { ToastContainer } from 'react-toastify';
import './styles/index.css';
import {Provider} from 'react-redux'; 
import {store} from './app/store';

import Home from './pages/home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import Activate from './pages/auth/Activate';
import PageNotFound from './pages/auth/PageNotFound';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/acount-activation" element={<Activate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        <Route path="*" element={<PageNotFound />} />
        {/*Da dobawq ako nqkoj put e gre[en da wodi do glawnata stranica*/}
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
