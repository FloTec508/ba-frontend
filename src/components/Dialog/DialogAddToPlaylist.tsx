import { CheckCircleIcon, CircleIcon, PlaylistIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePlaylistService } from "@/services/playlist";
import { useLocalService } from "@/services/local";
import { Item, Track } from "@/types";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { REF } from "@/constants/refs";

import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import CoverList from "@/components/ListItem/coverList";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ItemPadding from "@/components/Wrapper/ItemPadding";
import useVirtual from "react-cool-virtual";
import NoItems from "../ListItem/NoItems";

const DialogAddToPlaylist = ({ item }: { item: Item }) => {
  const dispatch = useDispatch();
  const query = REF.PLAYLIST;

  const { onAdd, getDirectory } = usePlaylistService();
  const { getDirectory: getDirectoryLocal } = useLocalService();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<{ name: string; uri: string }[]>([]);

  const loadMoreCount = 9;

  const [items, setItems] = useState<any[]>([]);
  const [startOffset, setStartOffset] = useState<number>(0);

  const onClickSelectPlaylist = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.uri === item.uri) ? prev.filter((i) => i.uri !== item.uri) : [...prev, { name: item.name, uri: item.uri }],
    );
  };

  const onClickAddHandler = async (item: Item) => {
    if (!selectedItems.length) return;
    setIsButtonLoading(true);

    const trackUris: string[] = [];

    switch (item.type) {
      case REF.CATEGORY:
      case REF.ARTIST:
      case REF.ALBUM:
      case REF.GENRE: {
        const tracks = await getDirectoryLocal(`${item.uri}:tracks`);
        if (tracks.length) {
          trackUris.push(...tracks.map((track: Track) => track.uri));
        }
        break;
      }
      default:
        trackUris.push(item.uri);
        break;
    }

    selectedItems.forEach(async (item) => {
      await onAdd([item.uri], trackUris);
      dispatch({
        type: INTERNAL_EVENTS.PLAYLIST_TRACK_ADDED,
        payload: { ...item, tracks: trackUris },
      });
    });

    setIsButtonLoading(false);
    dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
  };

  const {
    outerRef,
    innerRef,
    items: virtualRows,
    scrollTo,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: items?.length,
    itemSize: 70,
    loadMoreCount: loadMoreCount,
    loadMore: async ({ startIndex }) => {
      const currentOffset = startIndex;

      if (currentOffset > startOffset) {
        setStartOffset(currentOffset);
        const response = await getDirectory(query, loadMoreCount, currentOffset);
        setItems((prev: any) => [...prev, ...response]);
      }
    },
  });

  const fetch = async () => {
    setIsLoading(true);
    const response = await getDirectory(query, loadMoreCount, 0);
    setItems(response);
    setStartOffset(0);
    scrollTo(0);
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal
      title="Add to Playlist"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Add Selected"
      buttonOnClick={() => onClickAddHandler(item)}
      buttonLoading={isButtonLoading}
      buttonDisabled={!selectedItems.length}
      padding
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <div ref={outerRef} className="h-[50vh] overflow-auto">
          <div ref={innerRef}>
            {items.length === 0 ? (
              <NoItems title="No playlists" icon={<PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
            ) : (
              virtualRows.map(({ index }) => {
                const item = items[index];
                if (!item) return null;
                const isSelected = selectedItems.some((i) => i.uri === item.uri);
                return (
                  <ItemWrapper key={index}>
                    <button className="w-full cursor-pointer" onClick={() => onClickSelectPlaylist(item)}>
                      <ItemPadding>
                        <CoverList item={item} />
                        {isSelected ? <CheckCircleIcon weight="fill" size={ICON_SM} /> : <CircleIcon size={25} className="opacity-50" />}
                      </ItemPadding>
                    </button>
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
