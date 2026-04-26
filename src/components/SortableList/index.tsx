import ItemWrapper from "../Wrapper/ItemWrapper";
import ListItem from "../Item/ListItem";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { TlTrack } from "@/types";

const reorder = (list: TlTrack[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function SortableList({
  tracks,
  onMoveCallback,
}: {
  tracks: TlTrack[];
  onMoveCallback?: (start: number, end: number, to_position: number) => void;
}) {
  const { current_track } = useSelector((state: any) => state.player);

  const [items, setItems] = useState(tracks);
  const [selectedTlid, setSelectedTlid] = useState<number | null>(current_track?.tlid);

  useEffect(() => {
    setItems(tracks);
  }, [tracks]);

  useEffect(() => {
    setSelectedTlid(current_track?.tlid);
  }, [current_track?.tlid]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    onMoveCallback?.(result.source.index, result.source.index + 1, result.destination.index);

    const newItems: any = reorder(items, result.source.index, result.destination.index);
    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <Draggable key={`item-${item.tlid}-${index}`} draggableId={`item-${item.tlid}-${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`overflow-hidden md:overflow-visible ${snapshot.isDragging ? "bg-popover rounded-md" : ""}`}
                  >
                    <ItemWrapper>
                      <DotsSixVerticalIcon weight={ICON_WEIGHT} size={ICON_SM} className="-mr-3 ml-1" />
                      <ListItem item={{ ...item.track, ...item }} selected={item.tlid === selectedTlid} />
                    </ItemWrapper>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
