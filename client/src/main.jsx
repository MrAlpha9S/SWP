import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from "@auth0/auth0-react";
import auth from '../auth_config.json';
import dashBoard from './pages/dashboardPage/dashboard.jsx';
import {BrowserRouter} from "react-router-dom";


createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
            redirect_uri: window.location.origin + "/dashboard",
        }}
    >
        <App />
    </Auth0Provider>
    </BrowserRouter>

)


