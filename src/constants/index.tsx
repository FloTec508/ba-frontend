const dev = import.meta.env.DEV;
const dev_host = import.meta.env.VITE_DEV_HOST;
const host = dev ? dev_host : window.location.hostname;

export const WEBSOCKET_URL = `ws://${host}/ws`;
export const SERVER_URL = `http://${host}`;
export const CAMILLA_DSP_URL = `http://${host}:8081`;
export const STROKE_WIDTH = 1.5;

export const ICON_WEIGHT = "light";
export const ICON_FILL = "fill";
export const ICON_LG = 40;
export const ICON_SM = 25;
export const ICON_XS = 20;

export const WLAN_DEVICE = "wlan0";
export const ETH_DEVICE = "eth0";

export const LOCAL_IP = "127.0.0.1";
