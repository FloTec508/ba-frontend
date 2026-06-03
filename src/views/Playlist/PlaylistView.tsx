import Page from "@/components/Page";
import Spinner from "@/components/Spinner";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import SortableList from "@/components/SortableList";
import NoItems from "@/components/Item/NoItems";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlaylistActions } from "@/hooks/usePlaylistActions";
import { usePlaylistService } from "@/services/playlist";
import { MusicNoteIcon } from "@phosphor-icons/react";
import { Playlist, TlTrack } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { EVENTS } from "@/constants/events";

const PlaylistView = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { movePlaylistTrack } = usePlaylistService();
  const { playlistFetchTracks, playlistFetch, loading } = usePlaylistActions();

  const [playlist, setPlaylist] = useState<Playlist>();
  const [playlistTracks, setPlaylistTracks] = useState<TlTrack[]>();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setPlaylist(await playlistFetch(id));
      setPlaylistTracks(await playlistFetchTracks(id));
    })();
  }, [id]);

  const handleEvent = (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<TlTrack[]>>) => {
    switch (event) {
      case EVENTS.PLAYLIST_TRACK_REMOVED:
        setItems((prev) => prev.filter((item) => item.tlid !== payload.tl_track.tlid));
        break;
    }
  };

  return (
    <Page title={playlist?.name} backButtonOnClick={() => navigate("/playlist")} backButton>
      {loading ? (
        <LayoutHeightWrapper>
          <Spinner />
        </LayoutHeightWrapper>
      ) : playlistTracks?.length ? (
        <SortableList
          tracks={playlistTracks}
          onEvent={handleEvent}
          onMoveCallback={(start: number, end: number, to_position: number) => id && movePlaylistTrack(`playlist:${id}`, start, end, to_position)}
        />
      ) : (
        <LayoutHeightWrapper>
          <NoItems title="Empty Playlist" desc={"No tracks here"} icon={<MusicNoteIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
        </LayoutHeightWrapper>
      )}
    </Page>
  );
};

export default PlaylistView;
