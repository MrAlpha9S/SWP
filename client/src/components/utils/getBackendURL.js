export function getBackendUrl() {
    if (import.meta.env.MODE === 'production') {
        return import.meta.env.VITE_PRODUCTION_BACKEND_URL;
    } else {
        return import.meta.env.VITE_DEV_BACKEND_URL;
    }
}