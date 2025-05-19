import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from "@auth0/auth0-react";
import auth from '../auth_config.json';
import dashBoard from './pages/dashboardPage/dashboard.jsx';


createRoot(document.getElementById('root')).render(

    <Auth0Provider
        domain="dev-cl6n70h2qmq3y0b2.us.auth0.com"
        clientId="5hStf3vvyBSxtalxk6BhGg4nTvZ3p6Na"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
    >
        <App />
    </Auth0Provider>,

)


