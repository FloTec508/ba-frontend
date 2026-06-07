import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfigService } from "@/services/config";
import { useSourceService } from "@/services/source";
import { usePlaybackService } from "@/services/playback";
import { useTracklistService } from "@/services/tracklist";
import { useMixerService } from "@/services/mixer";
import { useSystemService } from "@/services/system";
import { useNetworkService } from "@/services/network";
import { EVENTS } from "@/constants/events";
import { Menu } from "../components/Menu";

import Player from "@/components/Player";
import Spinner from "@/components/Spinner";
import OverlaySearch from "@/components/Overlay/OverlaySearch";
import OverlayNowPlaying from "@/components/Overlay/OverlayNowPlaying";
import OverlayStandby from "@/components/Overlay/OverlayStandby";
import OverlayOffline from "@/components/Overlay/OverlayOffline";
import Dialog from "@/components/Dialog";
import OverlayVolume from "@/components/Overlay/OverlayVolume";
import EncoderNavigationProvider from "@/contexts/EncoderNavigationProvider";
import { INTERNAL_EVENTS } from "@/store/constants";

export default function Layout({ children }: { children: any }) {
  const dispatch = useDispatch();
  const connected = useSelector((state: any) => state.socket.connected);

  const { getRepeat, getSingle, getRandom } = useTracklistService();
  const { getState, getCurrentTlTrack } = usePlaybackService();
  const { getMixerVolume, getMixerMute } = useMixerService();
  const { getSystemTime, getPowerState } = useSystemService();
  const { getDevices } = useNetworkService();
  const { getSource } = useSourceService();
  const { getConfig } = useConfigService();

  useEffect(() => {
    const initialize = async () => {
      try {
        const [
          _config,
          _getNetworkDevices,
          _getPowerState,
          _getState,
          _getAudioSource,
          _tl_track,
          _value,
          _getRepeat,
          _getSingle,
          _getShuffle,
          _volume,
          _mute,
        ] = await Promise.all([
          getConfig(),
          getDevices(),
          getPowerState(),
          getState(),
          getSource(),
          getCurrentTlTrack(),
          getSystemTime(),
          getRepeat(),
          getSingle(),
          getRandom(),
          getMixerVolume(),
          getMixerMute(),
        ]);

        dispatch({
          type: INTERNAL_EVENTS.CONFIG_STATE,
          payload: { config: _config },
        });

        dispatch({
          type: EVENTS.NETWORK_DEVICES,
          payload: { state: _getNetworkDevices },
        });

        dispatch({
          type: EVENTS.SYSTEM_POWER_STATE,
          payload: { state: _getPowerState },
        });

        dispatch({
          type: EVENTS.PLAYBACK_STATE_CHANGED,
          payload: { state: _getState },
        });

        dispatch({
          type: INTERNAL_EVENTS.SOURCE_STATE,
          payload: { source: _getAudioSource },
        });

        dispatch({
          type: EVENTS.TRACK_META_UPDATED,
          payload: { tl_track: _tl_track },
        });

        dispatch({
          type: EVENTS.SYSTEM_TIME_UPDATED,
          payload: { datetime: _value },
        });

        dispatch({
          type: EVENTS.VOLUME_CHANGED,
          payload: { volume: _volume },
        });
        dispatch({
          type: INTERNAL_EVENTS.MIXER_STATE,
          payload: { mute: _mute },
        });
      } catch (err) {
        console.error("Error initiazing:", err);
      }
    };

    if (!connected) return;
    initialize();
  }, [connected]);

  return connected ? (
    <EncoderNavigationProvider>
      <div className="flex flex-col h-full">
        <Menu />
        <div className="flex-1 overflow-hidden ">{children}</div>
        <Player />
        <Dialog />
        <OverlaySearch />
        <OverlayNowPlaying />
        <OverlayStandby />
        <OverlayOffline />
        <OverlayVolume />
      </div>
    </EncoderNavigationProvider>
    
  ) : (
    <Spinner />
  );
}
