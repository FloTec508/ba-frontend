import { EVENTS } from "@/constants/events";
import { INTERNAL_EVENTS } from "../constants";

interface State {
  event: string | null;
  progress: {};
}

const initialState: State = {
  event: null,
  progress: {},
};

export const scanReducer = (state = initialState, action: any): State => {
  const { type, payload } = action;

  switch (type) {
    case EVENTS.SCAN_UPDATED:
      return {
        ...state, 
        event: INTERNAL_EVENTS.SCAN_UPDATED,
        progress: payload.progress,
      };
    case EVENTS.SCAN_ARTIST_UPDATED:
      return {
        ...state, 
        event: INTERNAL_EVENTS.SCAN_ARTIST_UPDATED,
        progress: payload.progress,
      };      
    default:
      return state;
  }
};