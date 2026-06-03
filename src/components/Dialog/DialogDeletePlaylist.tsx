import { usePlaylistActions } from "@/hooks/usePlaylistActions";
import { useDispatch } from "react-redux";
import { Playlist } from "@/types";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "@/components/Modal";

const DialogDeletePlaylist = ({ item }: { item: Playlist }) => {
  const dispatch = useDispatch();

  const { playlistDelete, loading } = usePlaylistActions();

  return (
    <Modal
      title="Delete Playlist"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Delete"
      buttonLoading={loading}
      buttonOnClick={() => playlistDelete(item)}
    >
      <span className="text-secondary">
        Are you sure you want to delete playlist <i>{item.name}</i>?
      </span>
    </Modal>
  );
};

export default DialogDeletePlaylist;
