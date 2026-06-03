import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalService } from "@/services/local";
import { usePlaylistService } from "@/services/playlist";
import { useTracklistService } from "@/services/tracklist";
import { AnyItem, TlTrack, Track } from "@/types";
import { INTERNAL_EVENTS } from "@/store/constants";
import { MODEL } from "@/constants/refs";

export function useAddToQueue() {
  const dispatch = useDispatch();

  const { addTrack } = useTracklistService();
  const { getDirectory: getLibraryDirectory } = useLocalService();
  const { getDirectory: getPlaylistDirectory } = usePlaylistService();

  const [loading, setLoading] = useState<boolean>(false);

  const handleAddToQueue = async (item: AnyItem) => {
    const tracksUris: string[] = [];
    setLoading(true);

    switch (item.__model__) {
      case MODEL.ARTIST:
      case MODEL.ALBUM:
      case MODEL.CATEGORY: {
        const tracks = await getLibraryDirectory(`${item.uri}:tracks`);
        if (tracks?.length) {
          tracksUris.push(...tracks.map((track: Track) => track.uri));
        }
        dispatch({
          type: INTERNAL_EVENTS.TRACKLIST_ADD_TO_QUEUE,
          payload: tracks,
        });
        break;
      }
      case MODEL.PLAYLIST: {
        const tltracks = await getPlaylistDirectory(`${item.uri}:tracks`);
        const tracks: Track[] = [];
        if (tltracks?.length) {
          tracks.push(...tltracks.map((tltrack: TlTrack) => tltrack.track));
          tracksUris.push(...tracks.map((track: Track) => track.uri));
        }
        dispatch({
          type: INTERNAL_EVENTS.TRACKLIST_ADD_TO_QUEUE,
          payload: tracks,
        });
        break;
      }
      case MODEL.TLTRACK:
        tracksUris.push(item.track.uri);
        dispatch({
          type: INTERNAL_EVENTS.TRACKLIST_ADD_TO_QUEUE,
          payload: item.track,
        });
        break;

      case MODEL.FILE:
      case MODEL.TRACK:
      case MODEL.TUNER:
        tracksUris.push(item.uri);
        dispatch({
          type: INTERNAL_EVENTS.TRACKLIST_ADD_TO_QUEUE,
          payload: item,
        });
        break;
      default:
        break;
    }
    try {
      await addTrack(tracksUris);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddToQueue, loading };
}
