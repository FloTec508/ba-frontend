import { useDispatch } from "react-redux";
import { AnyItem, Playlist, TlTrack, TlTrackExt, Track } from "@/types";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { useState } from "react";
import { usePlaylistService } from "@/services/playlist";
import { MODEL } from "@/constants/refs";
import { useLocalService } from "@/services/local";

export function usePlaylistActions() {
  const dispatch = useDispatch();

  const { getDirectory, move, onAdd } = usePlaylistService();
  const { getDirectory: getLibraryDirectory } = useLocalService();
  const { getDirectory: getPlaylistDirectory } = usePlaylistService();

  const [loading, setLoading] = useState<boolean>(false);

  const playlistFetch = async (id?: string) => {
    setLoading(true);
    try {
      return await getDirectory(`playlist${id ? `:${id}` : ""}`);
    } catch (err) {
      console.error("Failed to fetch playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const playlistFetchTracks = async (id: string) => {
    setLoading(true);
    try {
      return await getDirectory(`playlist:${id}:tracks`);
    } catch (err) {
      console.error("Failed to fetch playlist tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  const playlistAddDialog = (item: AnyItem) => {
    dispatch({ type: DIALOG_EVENTS.DIALOG_PLAYLISTS, payload: item });
  };

  const playlistMove = async (id: string, start: number, end: number, to_position: number) => {
    setLoading(true);
    try {
      return await move(`playlist:${id}`, start, end, to_position);
    } catch (err) {
      console.error("Failed to fetch playlist tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  const playlistRename = (item: AnyItem) => {
    dispatch({
      type: DIALOG_EVENTS.DIALOG_PLAYLIST_RENAME,
      payload: item,
    });
  };

  const playlistDelete = (item: AnyItem) => {
    dispatch({
      type: DIALOG_EVENTS.DIALOG_PLAYLIST_DELETE,
      payload: item,
    });
  };

  const playlistAdd = async (item: AnyItem, playlists: Playlist[]) => {
    if (!playlists.length) return;

    const trackUris: string[] = [];
    setLoading(true);
    switch (item.__model__) {
      case MODEL.ARTIST:
      case MODEL.ALBUM: {
        const tracks = await getLibraryDirectory(`${item.uri}:tracks`);
        if (tracks?.length) {
          trackUris.push(...tracks.map((track: Track) => track.uri));
        }
        break;
      }
      case MODEL.PLAYLIST: {
        const tltracks = await getPlaylistDirectory(`${item.uri}:tracks`);
        const tracks: Track[] = [];
        if (tltracks?.length) {
          tracks.push(...tltracks.map((tltrack: TlTrack) => tltrack.track));
          trackUris.push(...tracks.map((track: Track) => track.uri));
        }
        break;
      }
      case MODEL.TLTRACK:
        trackUris.push((item as TlTrackExt).uri);
        break;

      case MODEL.FILE:
      case MODEL.TRACK:
        trackUris.push(item.uri);
        break;
      default:
        break;
    }

    playlists.forEach(async (playlist: Playlist) => {
      try {
        await onAdd([playlist.uri], trackUris);
        dispatch({
          type: INTERNAL_EVENTS.PLAYLIST_TRACK_ADDED,
          payload: { ...item, tracks: trackUris },
        });
        dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      } catch (err) {
        console.error("Failed to fetch playlist tracks:", err);
      } finally {
        setLoading(false);
      }
    });
  };

  return { playlistFetch, playlistFetchTracks, playlistAdd, playlistAddDialog, playlistMove, playlistRename, playlistDelete, loading };
}
