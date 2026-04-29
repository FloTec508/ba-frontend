import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylistService } from "@/services/playlist";
import { splitUri } from "@/util";
import { ViewMode, AnyItem, Playlist } from "@/types";
import { PlaylistIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { EVENTS } from "@/constants/events";
import { REF } from "@/constants/refs";

import Page from "@/components/Page";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import ButtonPlaylistCreate from "@/components/Button/ButtonPlaylistCreate";
import NoItems from "@/components/Item/NoItems";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";

const Playlists = () => {
  const navigate = useNavigate();

  const { getDirectory } = usePlaylistService();

  const [layout, setLayout] = useState<ViewMode>("list");

  const onClickItem = async (item: AnyItem) => {
    const { path } = splitUri((item as Playlist).uri);
    navigate(`/playlist/${path}`);
  };

  const handleEvent = (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => {
    switch (event) {
      case EVENTS.PLAYLIST_REMOVED:
        setItems((prev) => prev.filter((item) => (item as Playlist).uri !== payload.playlist.uri));
        break;
      case EVENTS.PLAYLIST_RENAMED:
        setItems((prev) => prev.map((item) => ((item as Playlist).uri === payload.playlist.uri ? { ...item, ...payload.playlist } : item)));
        break;
      case EVENTS.PLAYLIST_CREATED:
        setItems((prev) => [payload.playlist, ...prev]);
        break;
    }
  };

  return (
    <Page
      wfull={layout === "grid"}
      title={"Playlists"}
      rightComponent={
        <div className="flex items-center">
          <div className="mr-2">
            <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
          </div>
          <div className="mr-4">
            <ButtonPlaylistCreate />
          </div>
        </div>
      }
      backButtonOnClick={() => navigate("/")}
      backButton
    >
      {layout === "list" && (
        <List
          uri={REF.PLAYLIST}
          getDirectory={getDirectory}
          onClickCallback={onClickItem}
          onEvent={handleEvent}
          emptyComponent={<NoItems title="No Playlists" desc="Nothing here yet." icon={<PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
        />
      )}
      {layout === "grid" && (
        <Grid
          uri={REF.PLAYLIST}
          getDirectory={getDirectory}
          onClickCallback={onClickItem}
          onEvent={handleEvent}
          emptyComponent={<NoItems title="No Playlists" desc="Nothing here yet." icon={<PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
        />
      )}
    </Page>
  );
};

export default Playlists;
