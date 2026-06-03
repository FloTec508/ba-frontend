import { useSocketRequest } from "@/store/useSocketRequest";

export const useTracklistService = () => {
  const { request } = useSocketRequest();

  return {
    getRepeat: () => request("tracklist.get_repeat"),
    setRepeat: (value: boolean) => request("tracklist.set_repeat", { value }),
    getSingle: () => request("tracklist.get_single"),
    setSingle: (value: boolean) => request("tracklist.set_single", { value }),
    getRandom: () => request("tracklist.get_random"),
    setRandom: (value: boolean) => request("tracklist.set_random", { value }),
    getTracklist: () => request("tracklist.get_tltracks"),
    moveTrack: (start: number, end: number, to_position: number) =>
      request("tracklist.move_track", {
        start,
        end,
        to_position,
      }),
    removeTrack: (tlid: any) => request("tracklist.remove_track", { tlid }),
    addTrack: (uris: string[], play?:boolean) => request("tracklist.add_track", { uris, play }),
    clear: () => request("tracklist.clear"),
  };
};
