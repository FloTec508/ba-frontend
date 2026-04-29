import { TlTrack } from "@/types";
import { useSocketRequest } from "@/store/useSocketRequest";

export const usePlaylistService = () => {
  const { request } = useSocketRequest();

  return {
    getDirectory: (uri?: string, limit?: number, offset?:number) => request("playlist.directory", {uri, limit, offset}),
    createPlaylist: (name?: string, tl_tracks?: TlTrack[]) => request("playlist.create", { name, tl_tracks }),
    editPlaylist: (uri: string, name: string) => request("playlist.edit", { uri, name }),
    deletePlaylist: (uri: string) => request("playlist.delete", { uri }),
    movePlaylistTrack: (uri: string, start: number, end: number, to_position: number) =>
      request("playlist.move_track", {
        uri,
        start,
        end,
        to_position,
      }),
    removePlaylistTrack: (uri: string, tlid: number) =>
      request("playlist.remove_track", { uri, tlid }),
    addPlaylistTrack: (uris: string[], track_uris: string[]) =>
      request("playlist.add_track", { uris, track_uris }),
  };
};
