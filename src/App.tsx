
import './App.css'
import AppRoutes from './AppRoutes/AppRoutes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
// import { AppFooter } from './Components/AppFooter/AppFooter';
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppdesckTopHeader from './Components/AppdesktopHeader/AppdesckTopHeader';
// import OrderTypeModal from './Components/OrderTypeModal/OrderTypeModal';

const PRESERVED_KEYS = ["branchid", "lang", "service_type"];

function PreserveSearchParams() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearchRef = useRef(new URLSearchParams(window.location.search));

  useEffect(() => {
    const current = new URLSearchParams(location.search);
    let changed = false;

    for (const key of PRESERVED_KEYS) {
      const value = initialSearchRef.current.get(key);
      if (value && !current.has(key)) {
        current.set(key, value);
        changed = true;
      }
    }

    if (changed) {
      navigate({ pathname: location.pathname, search: current.toString() }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return null;
}

function App() {
const queryClient = new QueryClient();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set direction based on language
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [i18n.language]);
  return (
    <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <PreserveSearchParams />
<div className='w-100' style={{minHeight:"100vh"}}>
      {/* <OrderTypeModal /> */}
      <AppdesckTopHeader />
     <AppRoutes />
</div>
     {/* <AppFooter/> */}
          </BrowserRouter>

    </QueryClientProvider>

  )
}

export default App
