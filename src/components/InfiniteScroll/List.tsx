import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { FolderSimpleIcon } from "@phosphor-icons/react";
import { Item } from "@/types";
import { ACTIONS } from "@/constants/actions";
import { INTERNAL_EVENTS } from "@/store/constants";
import { EVENTS } from "@/constants/events";

import useVirtual from "react-cool-virtual";
import NoItems from "@/components/ListItem/NoItems";
import Spinner from "@/components/Spinner";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ListItem from "@/components/ListItem";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";

interface List {
  uri: string;
  getDirectory: (uri?: string, limit?: number, offset?: number) => Promise<[]>;
  onClickCallback?: (item: Item) => void;
  onClickActionCallback?: (action: ACTIONS, item: Item) => void;
  emptyComponent?: React.ReactNode;
}

const List = ({ uri, getDirectory, onClickCallback, onClickActionCallback, emptyComponent }: List) => {
  const loadMoreCount = 15;
  const action = useSelector((state: any) => state.event);
  const { last_shared_event } = useSelector((state: any) => state.storage);

  const [items, setItems] = useState<Item[]>([]);
  const [startOffset, setStartOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        const response = await getDirectory(uri, loadMoreCount, currentOffset);
        setItems((prev: any) => [...prev, ...response]);
      }
    },
  });

  const fetch = async () => {
    setIsLoading(true);
    const response = await getDirectory(uri, loadMoreCount, 0);
    setItems(response);
    setStartOffset(0);
    scrollTo(0);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!last_shared_event) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.uri !== last_shared_event.uri) return item;
        return { ...item, shared: last_shared_event.event === EVENTS.STORAGE_SHARED };
      }),
    );
  }, [last_shared_event]);

  useEffect(() => {
    const PLAYLIST_EVENTS = [EVENTS.PLAYLIST_UPDATED, INTERNAL_EVENTS.PLAYLIST_CREATED, INTERNAL_EVENTS.PLAYLIST_REMOVED, INTERNAL_EVENTS.PLAYLIST_UPDATED];
    if (PLAYLIST_EVENTS.includes(action.event)) {
      fetch();
    }
  }, [action]);

  useEffect(() => {
    fetch();
  }, [uri]);

  return isLoading ? (
    <LayoutHeightWrapper>
      <Spinner />
    </LayoutHeightWrapper>
  ) : !items?.length ? (
    <LayoutHeightWrapper>
      {emptyComponent ? (
        emptyComponent
      ) : (
        <NoItems title="Empty List" desc="Nothing to show here" icon={<FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
      )}
    </LayoutHeightWrapper>
  ) : (
    <LayoutHeightWrapper ref={outerRef}>
      <div ref={innerRef}>
        {virtualRows.map(({ index }) => {
          const item = items[index] || [];
          return (
            <ItemWrapper key={index}>
              <ListItem item={item} onClickCallback={onClickCallback} onClickActionCallback={onClickActionCallback}  />
            </ItemWrapper>
          );
        })}
      </div>
    </LayoutHeightWrapper>
  );
};

export default List;
