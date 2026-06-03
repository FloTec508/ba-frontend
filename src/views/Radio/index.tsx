import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRadioService } from "@/services/radio";
import { REF } from "@/constants/refs";
import { ViewMode, AnyItem } from "@/types";
import { usePlayNow } from "@/hooks/usePlayNow";

import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";
import Page from "@/components/Page";

const Radio = () => {
  const navigate = useNavigate();

  const { getDirectory } = useRadioService();
  const { handlePlayNow } = usePlayNow();
  const [layout, setLayout] = useState<ViewMode>("grid");

  const onClickItem = async (item: AnyItem) => {
    await handlePlayNow(item);
  };

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
      {layout === "list" && <List uri={REF.RADIO} getDirectory={getDirectory} />}
      {layout === "grid" && <Grid uri={REF.RADIO} getDirectory={getDirectory} onClickCallback={onClickItem} />}
    </Page>
  );
};

export default Radio;
