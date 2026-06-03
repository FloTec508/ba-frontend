import { useSocketRequest } from "@/store/useSocketRequest";

export const useTunerService = () => {
  const { request } = useSocketRequest();

  return {
    getDirectory: (uri?: string, limit?: number, offset?: number) => request("tuner.directory", { uri, limit, offset }),
    getChannel: () => request("tuner.get_channel"),
    setChannel: (channel: number) => request("tuner.set_channel", { channel }),
    seekUp: (auto?: boolean) => request("tuner.seek_up", { auto }),
    seekDown: (auto?: boolean) => request("tuner.seek_down", { auto }),
  };
};
