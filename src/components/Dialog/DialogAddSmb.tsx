import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "../Form/Input";
import { useStorageActions } from "@/hooks/useStorageActions";
import { StorageItem } from "@/types";
import { CheckCircleIcon, CircleIcon, HardDriveIcon } from "@phosphor-icons/react";
import { DIALOG_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Modal from "@/components/Modal";
import ItemWrapper from "../Wrapper/ItemWrapper";
import ItemPadding from "../Wrapper/ItemPadding";
import CoverList from "../Item/ListItem";
import NoItems from "../Item/NoItems";

type smbShared = {
  ip: String;
  hostname: String;
  shares: StorageItem[];
};

const DialogAddSmb = () => {
  const dispatch = useDispatch();

  const { connectStorage, mountSharedStorage, loading } = useStorageActions();

  const [smbIpAddress, setSmbIpAddress] = useState<string>("");
  const [smbUsername, setSmbUsername] = useState<string>("");
  const [smbPassword, setSmbPassword] = useState<string>("");
  const [smbResponse, setSmbResponse] = useState<smbShared>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const onClickConnect = async () => {
    const result = await connectStorage(smbIpAddress, smbUsername, smbPassword);
    setSmbResponse(result);
  };

  const onClickMount = async () => {
    const response = await mountSharedStorage(selectedItems)
    response && dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
  };

  const onClickSelectSmbs = (item: StorageItem) => {
    setSelectedItems((prev) => (prev.includes(item.dev) ? prev.filter((dev) => dev !== item.dev) : [...prev, item.dev]));
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
          {smbResponse?.shares?.length === 0 ? (
            <NoItems title="No Shared Drives" icon={<HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          ) : (
            <>
              <div className="pt-2 pb-4 text-secondary px-5">Found {smbResponse?.shares?.length} items. Select the items you want to add and they will appear in your Storage section.</div>
              {smbResponse?.shares?.map((item: StorageItem) => (
                <ItemWrapper key={item.dev}>
                  <button className="w-full cursor-pointer" onClick={() => onClickSelectSmbs(item)}>
                    <ItemPadding>
                      <CoverList item={item as any} />
                      {selectedItems.includes(item.dev) ? (
                        <CheckCircleIcon weight="fill" size={ICON_SM} />
                      ) : (
                        <CircleIcon size={25} className="opacity-50" />
                      )}
                    </ItemPadding>
                  </button>
                </ItemWrapper>
              ))}
            </>
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
