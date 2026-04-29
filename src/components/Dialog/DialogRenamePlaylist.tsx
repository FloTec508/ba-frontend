import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePlaylistActions } from "@/hooks/usePlaylistActions";
import { Input } from "@/components/Form/Input";
import { Playlist } from "@/types";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "@/components/Modal";

const DialogRenamePlaylist = ({ item }: { item: Playlist }) => {
  const dispatch = useDispatch();

  const { playlistRename, loading } = usePlaylistActions();
  const [playlistName, setPlaylistName] = useState<string>(item?.name ?? "");

  useEffect(() => {
    setPlaylistName(item?.name);
  }, [item?.name]);

  return (
    <Modal
      title="Rename Playlist"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Rename"
      buttonLoading={loading}
      buttonOnClick={() => playlistRename(playlistName, item)}
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
