import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'
import './i18n';
import { MenuProvider } from './context/MenuContext.tsx';
import { LanguageProvider } from './context/LanguageContext/LanguageContext.tsx';
import { ResturantConfigProvider } from './context/ResturantConfid.tsx';
import { BranchImagesProvider } from './context/BranchImages.tsx';
import { OrderTypeProvider } from './context/OrderTypeContext/OrderTypeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <OrderTypeProvider>
      <MenuProvider>
        <ResturantConfigProvider>
          <BranchImagesProvider>
            <App />
          </BranchImagesProvider>
        </ResturantConfigProvider>
      </MenuProvider>
    </OrderTypeProvider>
  </LanguageProvider>
)
