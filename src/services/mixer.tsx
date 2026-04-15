import { useSocketRequest } from "@/store/useSocketRequest";

export const useMixerService = () => {
  const { request } = useSocketRequest();

  return {
    getMixerMute: () => request("mixer.get_mute"),
    getPlaybackDevices: () => request("mixer.get_playback_mixers"),
    setMixerMute: (mute: boolean) => request("mixer.set_mute", { mute }),
    toggleMixerMute: () => request("mixer.toggle_mute"),
    getMixerVolume: () => request("mixer.get_volume"),
    setMixerVolume: (volume: number) => request("mixer.set_volume", { volume: volume }),
    getAlsaDevices: (cmd: string) => request("mixer.alsa_devices", { cmd }),
    getAlsaVolumeDevices: (card?: string) => request("mixer.alsa_mixer_volume", { card }),
  };
};
