import { EVENTS } from "@/constants/events";
import { INTERNAL_EVENTS } from "../constants";

interface EventState {
  event: string | null;
  payload: any;
}

const initialDialogState: EventState = {
  event: null,
  payload: null,
};

export const eventReducer = (state = initialDialogState, action: any): EventState => {
  const { type } = action;

  switch (type) {
    case EVENTS.PLAYLIST_UPDATED:
    case INTERNAL_EVENTS.PLAYLIST_CREATED:
    case INTERNAL_EVENTS.PLAYLIST_REMOVED:
    case INTERNAL_EVENTS.PLAYLIST_UPDATED:
      return {
        event: type,
        payload: null,
      };
    default:
      return state;
  }
};