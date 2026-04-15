import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRadioService } from "@/services/radio";
import { REF } from "@/constants/refs";
import { ViewMode } from "@/types";

import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";
import Page from "@/components/Page";
import { usePlayNow } from "@/hooks/usePlayNow";


const Radio = () => {
  const navigate = useNavigate();
    const { handlePlayNow } = usePlayNow();
  

  const { getDirectory } = useRadioService();
  const [layout, setLayout] = useState<ViewMode>("grid");

  return (
    <Page
      wfull={layout === "grid"}
      title={"Internet Radio"}
      rightComponent={
        <div className="mr-4">
          <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
        </div>
      }
      backButtonOnClick={() => navigate("/")}
      backButton
    >
      {layout === "list" && (
        <List
          uri={REF.RADIO}
          getDirectory={getDirectory}
          onClickCallback={handlePlayNow}
        />
      )}
      {layout === "grid" && (
        <Grid
          uri={REF.RADIO}
          getDirectory={getDirectory}
          onClickCallback={handlePlayNow}
        />
      )}
    </Page>
  );
};

export default Radio;
