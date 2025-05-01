import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router';
import './styles/index.css';

import Home from './pages/home';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*Da dobawq ako nqkoj put e gre[en da wodi do glawnata stranica*/}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
