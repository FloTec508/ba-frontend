import { useSocketRequest } from "@/store/useSocketRequest";

export const useSnapcastService = () => {
  const { request } = useSocketRequest();

  return {
    getServers: (rescan?: boolean) => request("multiroom.servers", { rescan }),
    getStatus: () => request("multiroom.get_status"),
    setVolume: (client_id: string, volume: number, mute?: boolean) => request("multiroom.set_volume", { client_id, volume, mute }),
    connect: (ip: string) => request("multiroom.connect", { ip }),
    disconnect: () => request("multiroom.disconnect"),
  };
};
