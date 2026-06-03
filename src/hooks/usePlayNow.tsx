import { useState } from "react";
import { useLocalService } from "@/services/local";
import { usePlaybackService } from "@/services/playback";
import { usePlaylistService } from "@/services/playlist";
import { useTracklistService } from "@/services/tracklist";
import { AnyItem, TlTrack, Track } from "@/types";
import { MODEL } from "@/constants/refs";

export function usePlayNow() {
  const { addTrack, clear } = useTracklistService();
  const { getDirectory: getLibraryDirectory } = useLocalService();
  const { getDirectory: getPlaylistDirectory } = usePlaylistService();
  const { play } = usePlaybackService();

  const [loading, setLoading] = useState<boolean>(false);

  const handlePlayNow = async (item: AnyItem) => {
    setLoading(true);
    const tracksUris: string[] = [];

    switch (item.__model__) {
      case MODEL.ARTIST:
      case MODEL.ALBUM:
      case MODEL.CATEGORY: {
        const tracks = await getLibraryDirectory(`${item.uri}:tracks`);
        if (tracks.length) {
          tracksUris.push(...tracks.map((track: Track) => track.uri));
        }
        await play(tracksUris[0]);
        break;
      }
      case MODEL.FILE:
      case MODEL.TRACK:
      case MODEL.TUNER:
        await play(item.uri);
        break;

      case MODEL.TLTRACK:
        await play(item.track.uri, item.tlid);
        break;

      case MODEL.PLAYLIST: {
        const tltracks = await getPlaylistDirectory(`${item.uri}:tracks`);
        const tracks: Track[] = [];
        if (tltracks?.length) {
          tracks.push(...tltracks.map((tltrack: TlTrack) => tltrack.track));
          tracksUris.push(...tracks.map((track: Track) => track.uri));
        } else {
          break;
        }
        await clear();
        await addTrack(tracksUris, true);
        break;
      }
      default:
        break;
    }
    setLoading(false);
  };

  return { handlePlayNow, loading };
}
