import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Auth0Provider} from "@auth0/auth0-react";
import {BrowserRouter} from "react-router-dom";
import {ConfigProvider} from "antd";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export const queryClient = new QueryClient()

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
                    "colorBorder": "rgba(255,255,255,0)",
                    "borderRadius": 0,
                },
                "Tabs": {
                    "inkBarColor": "rgb(13,148, 136)",
                    "itemHoverColor": "rgb(13,148, 136)",
                    "itemActiveColor": "rgb(13,148, 136)",
                    "itemSelectedColor": "rgb(13,148, 136)",
                },
                "Input": {
                    "hoverBorderColor": "rgb(13,148, 136)",
                    "activeBorderColor": "rgb(13,148, 136)",
                },
                "Menu": {
                    "itemActiveBg": "rgb(13,148, 136)",
                    "itemHoverBg": "rgb(204 251 241)",
                    "itemSelectedBg": "rgb(13,148, 136)",
                    "itemSelectedColor": "rgb(255,255,255)",
                    "subMenuItemBg": "rgba(179,26,26,0.02)",
                    "colorBgElevated": "rgb(234,27,27)",
                    "itemBg": "rgba(255,255,255,0)"
                }
            }
        }}>
        <BrowserRouter>
            <Auth0Provider
                domain={import.meta.env.VITE_AUTH0_DOMAIN}
                clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin + "/post-signup",
                    audience: 'https://smokerecession.com'
                }}
                useRefreshTokens={true}
            >
                <QueryClientProvider client={queryClient}>
                    <App/>
                </QueryClientProvider>
            </Auth0Provider>
        </BrowserRouter>
    </ConfigProvider>
)


