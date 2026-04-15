import { BluetoothDevice, BluetoothState } from "@/types";
import { INTERNAL_EVENTS } from "../constants";
import { EVENTS } from "@/constants/events";

const initialState: BluetoothState = {
  adapter_state: { powered: false, discoverable: false, pairable: false, connected: false },
  device_connected: undefined,
  devices: [],
};

export const bluetoothReducer = (state = initialState, action: any): BluetoothState => {
  const { type, payload } = action;

  switch (type) {
    case INTERNAL_EVENTS.BLUETOOTH_SCAN_COMPLETED:
    case INTERNAL_EVENTS.BLUETOOTH_LIST:
      return {
        ...state,
        devices: payload?.sort((a: BluetoothDevice, b: BluetoothDevice) => a.name.localeCompare(b.name)),
      };
    case EVENTS.BLUETOOTH_DISCOVERABLE:
      return { ...state, adapter_state: { ...state.adapter_state, discoverable: payload.state } };
    case EVENTS.BLUETOOTH_POWERED:
      return { ...state, adapter_state: { ...state.adapter_state, powered: payload.state } };
    case EVENTS.BLUETOOTH_PAIRABLE:
      return { ...state, adapter_state: { ...state.adapter_state, pairable: payload.state } };
    case INTERNAL_EVENTS.BLUETOOTH_STATE_UPDATED:
      return { ...state, adapter_state: { ...payload } };
    case EVENTS.BLUETOOTH_CONNECTED:
    case EVENTS.BLUETOOTH_DISCONNECTED:
    case EVENTS.BLUETOOTH_UPDATED:
      const filter_devices = state.devices.filter((device) => device.address !== payload.device.address);
      return {
        ...state,
        devices: [...filter_devices, { ...payload.device }].sort((a: BluetoothDevice, b: BluetoothDevice) => a.name.localeCompare(b.name)),
      };
    case EVENTS.BLUETOOTH_REMOVED:
      const filter_removed_devices = state.devices.filter((device) => device.address !== payload.device.address);
      return {
        ...state,
        devices: [...filter_removed_devices].sort((a: BluetoothDevice, b: BluetoothDevice) => a.name.localeCompare(b.name)),
      };
    default:
      return state;
  }
};
