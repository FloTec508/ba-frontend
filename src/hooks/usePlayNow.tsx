import { useState } from "react";
import { MODEL } from "@/constants/refs";
import { useLocalService } from "@/services/local";
import { usePlaybackService } from "@/services/playback";
import { usePlaylistService } from "@/services/playlist";
import { useTracklistService } from "@/services/tracklist";
import { AnyItem, TlTrack, Track } from "@/types";

export function usePlayNow() {
  const { add, clear } = useTracklistService();
  const { getDirectory } = useLocalService();
  const { getPlaylistItem } = usePlaylistService();
  const { play, next } = usePlaybackService();

   const [loading, setLoading] = useState<boolean>(false);

  const handlePlayNow = async (item: AnyItem) => {
    setLoading(true);
    const tracksUris: string[] = [];
    switch (item.__model__) {
      case MODEL.CATEGORY:
      case MODEL.ARTIST:
      case MODEL.ALBUM:
      case MODEL.GENRE: {
        const tracks = await getDirectory(`${item.uri}:tracks`);
        if (tracks.length) {
          tracksUris.push(...tracks.map((track: Track) => track.uri));
        }
        await play(tracksUris[0]);
        break;
      }
      case MODEL.PLAYLIST: {
        const playlist = await getPlaylistItem(item.uri);
        if (playlist.tracks.length) {
          tracksUris.push(
            ...playlist.tracks.map((track: TlTrack) => track.track.uri)
          );
        }
        await clear();
        await add(tracksUris);
        await next();
        await play();
        break;
      }
      default:
        tracksUris.push(item.uri);
        await play(tracksUris[0]);
        break;
    }
    setLoading(false);
  };

  return { handlePlayNow, loading };
}
