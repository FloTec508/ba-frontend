import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { FolderSimpleIcon } from "@phosphor-icons/react";
import { AnyItem } from "@/types";

import useVirtual from "react-cool-virtual";
import NoItems from "@/components/Item/NoItems";
import Spinner from "@/components/Spinner";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "../Item/ListItem";

interface List {
  uri: string;
  getDirectory: (uri?: string, limit?: number, offset?: number) => Promise<[]>;
  onClickCallback?: (item: AnyItem) => void;
  onEvent?: (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => void;
  emptyComponent?: React.ReactNode;
}

const List = ({ uri, getDirectory, onClickCallback, onEvent, emptyComponent }: List) => {
  const loadMoreCount = 15;
  const action = useSelector((state: any) => state.event);

  const [items, setItems] = useState<AnyItem[]>([]);
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
        setItems((prev: AnyItem[]) => [...prev, ...response]);
      }
    },
  });

  useEffect(() => {
    if (action.event && onEvent) {
      onEvent(action.event, action.payload, setItems);
    }
  }, [action]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const response = await getDirectory(uri, loadMoreCount, 0);
      setItems(response);
      setStartOffset(0);
      scrollTo(0);
      setIsLoading(false);
    };
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
              {/* Not a button else draggable wont work */}
              <ListItem
                // no={index === null ? undefined : index + 1}
                item={item}
                onClick={() => onClickCallback?.(item)}
              />
            </ItemWrapper>
          );
        })}
      </div>
    </LayoutHeightWrapper>
  );
};

export default List;
