import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import useVirtual from "react-cool-virtual";
import NoItems from "../Item/NoItems";
import ListItemSelectable from "../Item/ListItemSelectable";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePlaylistService } from "@/services/playlist";
import { usePlaylistActions } from "@/hooks/usePlaylistActions";
import { PlaylistIcon } from "@phosphor-icons/react";
import { AnyItem, Playlist } from "@/types";
import { DIALOG_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { REF } from "@/constants/refs";

const DialogAddToPlaylist = ({ item }: { item: AnyItem }) => {
  const dispatch = useDispatch();
  const query = REF.PLAYLIST;
  const loadMoreCount = 9;

  const { getDirectory } = usePlaylistService();
  const { playlistFetch, playlistAdd, loading } = usePlaylistActions();

  const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [startOffset, setStartOffset] = useState<number>(0);

  const onClickSelectPlaylist = (item: Playlist) => {
    setSelectedPlaylists((prev) => (prev.some((i) => i.uri === item.uri) ? prev.filter((i) => i.uri !== item.uri) : [...prev, item]));
  };

  const {
    outerRef,
    innerRef,
    items: virtualRows,
    scrollTo,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: playlists?.length,
    itemSize: 70,
    loadMoreCount: loadMoreCount,
    loadMore: async ({ startIndex }) => {
      const currentOffset = startIndex;

      if (currentOffset > startOffset) {
        setStartOffset(currentOffset);
        const response = await getDirectory(query, loadMoreCount, currentOffset);
        setPlaylists((prev: any) => [...prev, ...response]);
      }
    },
  });

  useEffect(() => {
    (async () => {
      setPlaylists(await playlistFetch());
      setStartOffset(0);
      scrollTo(0);
    })();
  }, []);

  return (
    <Modal
      title="Add to Playlist"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Add Selected"
      buttonOnClick={() => playlistAdd(item, selectedPlaylists)}
      buttonLoading={loading}
      buttonDisabled={!selectedPlaylists.length}
      padding
    >
      {loading ? (
        <Spinner />
      ) : (
        <div ref={outerRef} className="h-[50vh] overflow-auto">
          <div ref={innerRef}>
            {playlists.length === 0 ? (
              <NoItems title="No playlists" icon={<PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
            ) : (
              virtualRows.map(({ index }) => {
                const item = playlists[index];
                if (!item) return null;
                const isSelected = selectedPlaylists.some((i) => i.uri === item.uri);
                return (
                  <ItemWrapper key={index}>
                    <ListItemSelectable item={item} selected={isSelected} onClick={() => onClickSelectPlaylist(item)} />
                  </ItemWrapper>
                );
              })
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DialogAddToPlaylist;
