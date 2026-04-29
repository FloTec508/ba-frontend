import { TracklistState } from "@/types";
import { EVENTS } from "@/constants/events";
import { INTERNAL_EVENTS } from "../constants";

const initialState: TracklistState = {
  tl_tracks: [],
};

export const tracklistReducer = (state = initialState, action: any): TracklistState => {
  const { type, payload } = action;
  switch (type) {
    case EVENTS.TRACKLIST_TRACK_REMOVED:
      return {
        ...state,
        tl_tracks: state.tl_tracks.filter((item) => item.tlid !== payload.tl_track.tlid),
      };
    case EVENTS.TRACKLIST_TRACK_ADDED:
      return {
        ...state,
        tl_tracks: [...state.tl_tracks, ...payload.tl_tracks],
      };
    case EVENTS.TRACKLIST_CLEARED:
      return {
        ...state,
        tl_tracks: [],
      };
     case INTERNAL_EVENTS.TRACKLIST_LIST:
      return {
        ...state,
        tl_tracks: payload,
      };  
    default:
      return state;
  }
};