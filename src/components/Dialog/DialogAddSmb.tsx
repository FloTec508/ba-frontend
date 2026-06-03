import { useState } from "react";
import { useDispatch } from "react-redux";
import { useStorageActions } from "@/hooks/useStorageActions";
import { Input } from "../Form/Input";
import { Storage } from "@/types";
import { HardDriveIcon } from "@phosphor-icons/react";
import { DIALOG_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Modal from "@/components/Modal";
import ItemWrapper from "../Wrapper/ItemWrapper";
import NoItems from "../Item/NoItems";
import ListItem from "../Item/ListItem";

type smbShared = {
  ip: String;
  hostname: String;
  shares: Storage[];
};

const DialogAddSmb = () => {
  const dispatch = useDispatch();

  const { storageConnect, storageMountShared, loading } = useStorageActions();

  const [smbIpAddress, setSmbIpAddress] = useState<string>("");
  const [smbUsername, setSmbUsername] = useState<string>("");
  const [smbPassword, setSmbPassword] = useState<string>("");
  const [smbResponse, setSmbResponse] = useState<smbShared>();
  const [selectedItems, setSelectedItems] = useState<Storage[]>([]);

  const onClickConnect = async () => {
    const result = await storageConnect(smbIpAddress, smbUsername, smbPassword);
    setSmbResponse(result);
  };

  const onClickMount = async () => {
    const response = await storageMountShared(selectedItems);
    response && dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
  };

  const onClickSelectSmbs = (item: Storage) => {
    setSelectedItems((prev) => (prev.some((i) => i.dev === item.dev) ? prev.filter((i) => i.dev !== item.dev) : [...prev, item]));
  };

  return (
    <Modal
      title="Add Network Drive"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText={smbResponse?.ip ? "Add Selected" : "Connect"}
      buttonLoading={loading}
      buttonOnClick={smbResponse?.ip ? onClickMount : onClickConnect}
      buttonDisabled={smbResponse?.ip ? smbResponse?.ip && !selectedItems.length : smbIpAddress == ""}
      padding
    >
      {smbResponse?.ip ? (
        <div className="overflow-auto">
          {smbResponse?.shares?.length ? (
            <>
              <div className="pt-2 pb-4 text-secondary px-5">
                Found {smbResponse.shares.length} items. Select the items you want to add and they will appear in your Storage section.
              </div>
              {smbResponse.shares.map((item: Storage) => (
                <ItemWrapper key={item.uri}>
                  <ListItem item={item} selected={selectedItems.some((i) => i.dev === item.dev)} onClick={() => onClickSelectSmbs(item)} selectable />
                </ItemWrapper>
              ))}
            </>
          ) : (
            <NoItems title="No Shared Drives" icon={<HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          )}
        </div>
      ) : (
        <div className="px-5">
          <div className="pt-2 pb-4 text-secondary">
            Enter the details of the SMB share you want to connect to. Make sure the host device is on the same network and has file sharing enabled.
          </div>
          <Input
            type="text"
            placeholder="IP Address / Hostname"
            value={smbIpAddress}
            onChange={(e) => setSmbIpAddress(e.target.value)}
            onClickClear={() => setSmbIpAddress("")}
            disabled={loading}
          />

          <Input
            type="text"
            className="mt-4"
            placeholder="Username"
            value={smbUsername}
            onChange={(e) => setSmbUsername(e.target.value)}
            onClickClear={() => setSmbUsername("")}
            disabled={loading}
          />

          <Input
            type="text"
            className="mt-4 mb-1"
            placeholder="Password"
            value={smbPassword}
            onChange={(e) => setSmbPassword(e.target.value)}
            onClickClear={() => setSmbPassword("")}
            disabled={loading}
          />
        </div>
      )}
    </Modal>
  );
};

export default DialogAddSmb;
