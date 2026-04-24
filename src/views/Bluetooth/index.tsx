import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBluetoothService } from "@/services/bluetooth";
import { useBluetoothActions } from "@/hooks/useBluetoothActions";
import { BluetoothDevice } from "@/types";
import { BluetoothConnectedIcon, BluetoothIcon, BluetoothSlashIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { BluetoothDeviceIcon, getBitDepth, getSampleRate } from "@/util";
import { DotIcon } from "lucide-react";
import { ICON_SM, ICON_WEIGHT, ICON_XS } from "@/constants";

import Page from "@/components/Page";
import ActionMenu from "@/components/Actions";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ItemPadding from "@/components/Wrapper/ItemPadding";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Spinner from "@/components/Spinner";
import ButtonBluetoothScan from "@/components/Button/ButtonBluetoothScan";
import ButtonBluetoothToggle from "@/components/Button/ButtonBluetoothToggle";
import NoItems from "@/components/Item/NoItems";

const Bluetooth = () => {
  const { devices } = useSelector((state: any) => state.bluetooth);
  const { removeDevice, disconnectDevice, connectDevice } = useBluetoothService();
  const { fetchDevices, loading } = useBluetoothActions();

  useEffect(() => {
    fetchDevices();
  }, []);

  const ListItem = ({ item }: { item: BluetoothDevice }) => {
    const actionItems = [
      {
        name: "Connect",
        icon: <BluetoothConnectedIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: () => connectDevice(item.address),
        hide: item.connected,
      },
      {
        name: "Disconnect",
        icon: <BluetoothSlashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: async () => disconnectDevice(item.address),
        hide: !item.connected,
      },
      {
        name: "Forget",
        icon: <TrashSimpleIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: async () => removeDevice(item.address),
      },
    ];

    return (
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex  items-center">
            <BluetoothDeviceIcon type={item.icon} className={`mr-2 ${item.connected ? "text-primary" : ""}`} />
            <div className="">
              <div className="w-full">
                <div className="text-lg font-medium">{item.name}</div>
                {item.audio_codec && (
                  <div className="flex items-center text-muted -mt-1">
                    {item.audio_codec}
                    {item?.sample_rate && (
                      <>
                        <DotIcon size={32} className="-mx-2" />
                        {getSampleRate(item?.sample_rate as number)}
                      </>
                    )}
                    {item?.bit_depth && (
                      <>
                        <DotIcon size={32} className="-mx-2" />
                        {getBitDepth(item?.bit_depth)}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="-mr-2">
            <ActionMenu items={actionItems} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Page
      backButton
      title="Bluetooth"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonBluetoothScan />
          </div>
          <div className="mr-4">
            <ButtonBluetoothToggle />
          </div>
        </div>
      }
    >
      {loading ? (
        <LayoutHeightWrapper>
          <Spinner />
        </LayoutHeightWrapper>
      ) : (
        <>
          {devices?.length ? (
            devices.map((item: BluetoothDevice, index: number) => (
              <ItemWrapper key={index}>
                <ItemPadding>
                  <ListItem item={item} />
                </ItemPadding>
              </ItemWrapper>
            ))
          ) : (
            <LayoutHeightWrapper>
              <NoItems
                title="No Devices Found"
                desc={"Scan to search for available devices"}
                icon={<BluetoothIcon weight={ICON_WEIGHT} size={ICON_SM} />}
              />
            </LayoutHeightWrapper>
          )}
        </>
      )}
    </Page>
  );
};

export default Bluetooth;
