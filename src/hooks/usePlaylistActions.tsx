import { useDispatch } from "react-redux";
import { AnyItem, Playlist, TlTrack, Track } from "@/types";
import { DIALOG_EVENTS } from "@/store/constants";
import { useState } from "react";
import { usePlaylistService } from "@/services/playlist";
import { MODEL } from "@/constants/refs";
import { useLocalService } from "@/services/local";

export function usePlaylistActions() {
  const dispatch = useDispatch();

  const { getDirectory: getLibraryDirectory } = useLocalService();
  const {
    getDirectory: getPlaylistDirectory,
    removePlaylistTrack,
    deletePlaylist,
    editPlaylist,
    addPlaylistTrack,
    createPlaylist,
  } = usePlaylistService();

  const [loading, setLoading] = useState<boolean>(false);

  const playlistFetch = async (id?: string) => {
    setLoading(true);
    try {
      return await getPlaylistDirectory(`playlist${id ? `:${id}` : ""}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playlistFetchTracks = async (id: string) => {
    setLoading(true);
    try {
      return await getPlaylistDirectory(`playlist:${id}:tracks`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playlistAddDialog = (item: AnyItem) => {
    dispatch({ type: DIALOG_EVENTS.DIALOG_PLAYLISTS, payload: item });
  };

  const playlistRemoveTrack = async (item: TlTrack) => {
    if (!item.uri) return;
    setLoading(true);
    try {
      await removePlaylistTrack(item.uri, item.tlid);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playlistCreate = async (name: string, tl_tracks: TlTrack[]) => {
    setLoading(true);
    try {
      await createPlaylist(name, tl_tracks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playlistRenameDialog = (item: Playlist) => {
    dispatch({
      type: DIALOG_EVENTS.DIALOG_PLAYLIST_RENAME,
      payload: item,
    });
  };

  const playlistRename = async (name: string, item: Playlist) => {
    setLoading(true);
    try {
      editPlaylist(item.uri, name);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      setLoading(false);
    }
  };

  const playlistDeleteDialog = (item: Playlist) => {
    dispatch({
      type: DIALOG_EVENTS.DIALOG_PLAYLIST_DELETE,
      payload: item,
    });
  };

  const playlistDelete = async (item: Playlist) => {
    setLoading(true);
    try {
      await deletePlaylist(item?.uri);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      setLoading(false);
    }
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
        trackUris.push(item.track.uri);
        break;

      case MODEL.FILE:
      case MODEL.TRACK:
      case MODEL.TUNER:
        trackUris.push(item.uri);
        break;
      default:
        break;
    }

    playlists.forEach(async (playlist: Playlist) => {
      try {
        await addPlaylistTrack([playlist.uri], trackUris);
        dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  };

  return {
    playlistCreate,
    playlistFetch,
    playlistFetchTracks,
    playlistAdd,
    playlistAddDialog,
    playlistRemoveTrack,
    playlistRename,
    playlistRenameDialog,
    playlistDelete,
    playlistDeleteDialog,
    loading,
  };
}
