import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTunerService } from "@/services/tuner";
import { REF } from "@/constants/refs";
import { ViewMode } from "@/types";
import { GearIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";
import Page from "@/components/Page";
import ButtonIcon from "@/components/Button/ButtonIcon";


const Tuner = () => {
  const navigate = useNavigate();

  const { getDirectory } = useTunerService();
  const [layout, setLayout] = useState<ViewMode>("list");

  return (
    <Page
      wfull={layout === "grid"}
      title={"Tuner"}
      rightComponent={
        <div className="flex items-center">
          <div className="mr-4">
            <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
          </div>
          <div className="mr-4">
            <ButtonIcon onClick={() => navigate("/settings/tuner")}>
              <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
            </ButtonIcon>
          </div>
        </div>
      }
      backButtonOnClick={() => navigate("/")}
      backButton
    >
      {layout === "list" && <List uri={REF.TUNER} getDirectory={getDirectory} onClickCallback={undefined} />}
      {layout === "grid" && <Grid uri={REF.TUNER} getDirectory={getDirectory} onClickCallback={undefined} />}
    </Page>
  );
};

export default Tuner;
