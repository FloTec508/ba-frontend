import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBluetoothActions } from "@/hooks/useBluetoothActions";
import { Bluetooth } from "@/types";
import { BluetoothIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ButtonBluetoothScan from "@/components/Button/ButtonBluetoothScan";
import ButtonBluetoothToggle from "@/components/Button/ButtonBluetoothToggle";
import NoItems from "@/components/Item/NoItems";
import ListItem from "@/components/Item/ListItem";
import Spinner from "@/components/Spinner";
import Page from "@/components/Page";

const BluetoothView = () => {
  const { devices } = useSelector((state: any) => state.bluetooth);

  const { fetchDevices, loading } = useBluetoothActions();

  useEffect(() => {
    fetchDevices();
  }, []);

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
            devices.map((item: Bluetooth, index: number) => (
              <ItemWrapper key={index}>
                <ListItem item={item} />
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

export default BluetoothView;
