import { useState } from "react";
import { useDispatch } from "react-redux";
import { Item } from "@/types";
import { usePlaylistService } from "@/services/playlist";
import { INTERNAL_EVENTS, DIALOG_EVENTS } from "@/store/constants";

import Modal from "@/components/Modal";

const DialogDeletePlaylist = ({ item }: { item: Item }) => {
  const dispatch = useDispatch();

  const { deleteItem } = usePlaylistService();

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const onClickDeletePlaylist = async () => {
    setButtonLoading(true);
    if (await deleteItem(item?.uri as string)) {
      dispatch({
        type: INTERNAL_EVENTS.PLAYLIST_REMOVED,
        payload: item,
      });
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
    }
    setButtonLoading(false);
  };

  return (
    <Modal
      title="Delete Playlist"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Delete"
      buttonLoading={buttonLoading}
      buttonOnClick={onClickDeletePlaylist}
    >
      <span className="text-secondary">
        Are you sure you want to delete playlist <i>{item.name}</i>?
      </span>
    </Modal>
  );
};

export default DialogDeletePlaylist;
