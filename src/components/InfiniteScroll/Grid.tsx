import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderSimpleIcon } from "@phosphor-icons/react";
import { Item } from "@/types";
import { REF } from "@/constants/refs";
import { ACTIONS } from "@/constants/actions";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { EVENTS } from "@/constants/events";

import Spinner from "@/components/Spinner";
import NoItems from "@/components/ListItem/NoItems";
import useVirtual from "react-cool-virtual";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ListItem from "@/components/ListItem";

interface Grid {
  uri: string;
  getDirectory: (uri?: string, limit?: number, offset?: number) => Promise<[]>;
  onClickCallback?: (item: any) => void;
  onClickActionCallback?: (action: ACTIONS, item: Item) => void;
  emptyComponent?: React.ReactNode;
}

const calculateCols = () => {
  if (window.innerWidth < 576) return 2;
  else if (window.innerWidth < 940) return 4;
  else if (window.innerWidth < 1024) return 5;
  else if (window.innerWidth < 1440) return 6;
  else if (window.innerWidth < 1600) return 7;
  else return 8;
};

const Grid = ({ uri, getDirectory, onClickCallback, onClickActionCallback, emptyComponent }: Grid) => {
  const dispatch = useDispatch();

  const loadMoreCount = 6;
  const action = useSelector((state: any) => state.event);
  const { last_shared_event } = useSelector((state: any) => state.storage);

  const [items, setItems] = useState<any[]>([]);
  const [startOffset, setStartOffset] = useState<number>(0);
  const [columns, setColumns] = useState(calculateCols());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    outerRef,
    innerRef,
    items: virtualRows,
    scrollTo,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: Math.ceil(items?.length / columns),
    itemSize: 255,
    useIsScrolling: true,
    loadMoreCount: loadMoreCount,
    loadMore: async ({ startIndex }) => {
      const currentOffset = startIndex * columns;

      if (currentOffset > startOffset) {
        setStartOffset(currentOffset);
        const response = await getDirectory(uri, loadMoreCount * columns, currentOffset);
        setItems((prev: any) => [...prev, ...response]);
      }
    },
  });

  const fetch = async () => {
    setIsLoading(true);

    const response = (await getDirectory(uri, loadMoreCount * columns, 0)) || [];
    if (!response.length && [REF.ARTIST, REF.ALBUM, REF.GENRE, REF.TRACK].includes(uri as REF)) {
      dispatch({ type: DIALOG_EVENTS.DIALOG_ADD_LIBRARY });
    }

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

  useEffect(() => {
    const handler = () => {
      setColumns(calculateCols());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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
      <div ref={innerRef} className="px-3">
        {virtualRows.map(({ index }) => {
          const start = index * columns;
          const rowItems = items.slice(start, start + columns) || [];
          return (
            <div key={index} className="flex items-start">
              {rowItems.map((item: any, index: number) => (
                <ListItem
                  item={item}
                  key={index}
                  style={{ width: `${100 / columns}%` }}
                  className="p-3 lg:p-4 pb-6"
                  onClickCallback={onClickCallback}
                  onClickActionCallback={onClickActionCallback}
                  cover
                />
              ))}
            </div>
          );
        })}
      </div>
    </LayoutHeightWrapper>
  );
};

export default Grid;
