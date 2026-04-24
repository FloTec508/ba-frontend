import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DotsNineIcon } from "@phosphor-icons/react";
import { OVERLAY_EVENTS, DIALOG_EVENTS } from "@/store/constants";
import { ICON_SM } from "@/constants";

import DateTime from "../DateTime";
import ButtonIcon from "../Button/ButtonIcon";
import ButtonSearch from "../Button/ButtonSearch";
import ButtonVolume from "../Player/ButtonVolume";
import BluetoothStatus from "../Bluetooth/BluetoothStatus";
import SourceStatus from "../Source/SourceStatus";

export function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickMenuHandler = () => {
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
    navigate("/");
  };

  return (
    <div className="rounded-none px-4 h-12 flex justify-between items-center shadow-none relative text-lg">
      <div className="flex items-center ">
        <ButtonIcon onClick={onClickMenuHandler}>
          <DotsNineIcon size={ICON_SM} weight={"bold"} />
        </ButtonIcon>
        <span className="pr-4 pl-1">
          <DateTime time />
        </span>
      </div>

      <div className="flex items-center">
        <BluetoothStatus />
        <SourceStatus/>
        <ButtonSearch />
        <ButtonVolume />
      </div>
    </div>
  );
}
