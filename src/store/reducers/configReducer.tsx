import { EVENTS } from "@/constants/events";
import { Config } from "@/types";

interface State {
  config: Config;
}

const initialState: State = {
  config: {
    system: {
      hostname: "",
      timezone: "",
    },
    spotify: {
      bitrate: 0,
      bit_depth: "",
      volume_default: 0,
      volume_normalization: false,
    },
    storage: {
      username: null,
      password: null,
      smb_clients: {},
    },
    network: {
      apmode_password: "",
    },
    display: {
      output_display: null,
      visualizer_layout: 0,
    },
    linein: {
      input_device: "",
      sample_rate: 0,
      bit_depth: "",
      gain: 0,
    },
    tuner: {
      input_device: "",
      sample_rate: 0,
      bit_depth: "",
      gain: 0,
    },
    dsp: {
      default_capture_device: "",
      default_gain: 0,
      resample_rate: 0,
    },
    multiroom: {
      capture_device: "",
      playback_device: "",
      server: false,
      codec: "",
      chunk: 0,
      buffer: 0,
    },
    mixer: {
      output_device: "",
      hw_device: "",
      dtoverlay: "",
      volume_default: 0,
      volume_device: "",
    },
    playback: {
      background_albumart: false,
    },
    web: {},
    radio: {},
    source: {},
    shairportsync: {},
    bluetooth: {},
    local: {
      library_path: [],
    },
    search: {},
    playlist: {},
    infrared: {},
    command: {},
  },
};

export const configReducer = (state = initialState, action: any): State => {
  const { type, payload } = action;

  switch (type) {
    case EVENTS.CONFIG_UPDATED:
      return {
        config: { ...state.config, ...payload.config },
      };
    default:
      return state;
  }
};
