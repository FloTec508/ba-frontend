import Modal from "@/components/Modal";
import ButtonIcon from "@/components/Button/ButtonIcon";

import { useState } from "react";
import { usePlaylistActions } from "@/hooks/usePlaylistActions";
import { useSelector } from "react-redux";
import { ListPlusIcon } from "@phosphor-icons/react";
import { Input } from "@/components/Form/Input";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

const ButtonPlaylistCreate = ({ fromQueue = false }: { fromQueue?: boolean }) => {
  const { playlistCreate, loading } = usePlaylistActions();
  const { tl_tracks } = useSelector((state: any) => state.tracklist);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>("My Mix");

  const onClickCreateHandler = async () => {
    const _tl_tracks = fromQueue ? tl_tracks : [];
    await playlistCreate(playlistName, _tl_tracks);
    setShowCreateModal(false);
  };

  const disabled = fromQueue && tl_tracks.length <= 0;

  return (
    <>
      <ButtonIcon onClick={() => setShowCreateModal(true)} disabled={disabled}>
        <ListPlusIcon weight={ICON_WEIGHT} size={ICON_SM} />
      </ButtonIcon>

      <Modal
        title="New Playlist"
        onClose={() => setShowCreateModal(false)}
        isOpen={showCreateModal}
        buttonText="Create"
        buttonLoading={loading}
        buttonOnClick={onClickCreateHandler}
        buttonDisabled={playlistName === ""}
      >
        <div className="py-2">
          <Input
            type="text"
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            onClickClear={() => setPlaylistName("")}
          />
        </div>
      </Modal>
    </>
  );
};

export default ButtonPlaylistCreate;
