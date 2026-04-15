import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Item } from "@/types";
import { Input } from "@/components/Form/Input";
import { usePlaylistService } from "@/services/playlist";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";

import Modal from "@/components/Modal";

const DialogRenamePlaylist = ({ item }: { item: Item }) => {
  const dispatch = useDispatch();

  const { editItem } = usePlaylistService();

  const [playlistName, setPlaylistName] = useState<string>(item?.name ?? "");
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const onClickEditPlaylist = async () => {
    setButtonLoading(true);
    if (await editItem(item?.uri as string, playlistName)) {
      dispatch({
        type: INTERNAL_EVENTS.PLAYLIST_UPDATED,
        payload: item,
      });
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    setPlaylistName(item?.name);
  }, [item?.name]);

  return (
    <Modal
      title="Rename Playlist"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Rename"
      buttonLoading={buttonLoading}
      buttonOnClick={onClickEditPlaylist}
      buttonDisabled={playlistName === ""}
    >
      <Input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        onClickClear={() => setPlaylistName("")}
        className="my-1"
      />
    </Modal>
  );
};

export default DialogRenamePlaylist;
