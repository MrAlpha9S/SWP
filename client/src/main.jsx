import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Auth0Provider} from "@auth0/auth0-react";
import {BrowserRouter} from "react-router-dom";
import {ConfigProvider} from "antd";


createRoot(document.getElementById('root')).render(
    <ConfigProvider
        theme={{
            "components": {
                "Collapse": {
                    "headerBg": "rgb(19,78,74)",
                    "colorTextHeading": "rgba(255,255,255,0.88)",
                    "contentBg": "rgb(255,255,255)",
                },
                "Steps": {
                    "colorPrimary": "rgb(19,78,74)"
                },
                "Checkbox": {
                    "colorPrimary": "rgb(19,78,74)",
                    "colorPrimaryHover": "rgb(19,78,74)",
                },
                "Radio": {
                    "colorPrimary": "rgb(19,78,74)",
                    "colorPrimaryHover": "rgb(19,78,74)",
                }
            }
        }}>
        <BrowserRouter>
            <Auth0Provider
                domain={import.meta.env.VITE_AUTH0_DOMAIN}
                clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin + "/postSignup",
                    audience: 'https://smokerecession.com'
                }}
            >
                <App/>
            </Auth0Provider>
        </BrowserRouter>
    </ConfigProvider>
)


