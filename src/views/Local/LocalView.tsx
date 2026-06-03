import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalService } from "@/services/local";
import { Album, AnyItem, Artist, ViewMode } from "@/types";
import { REF } from "@/constants/refs";

import Page from "@/components/Page";
import Grid from "../../components/InfiniteScroll/Grid";
import List from "../../components/InfiniteScroll/List";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import LocalDetail from "./LocalDetail";

const LocalView = () => {
  const navigate = useNavigate();

  const { view, id } = useParams<{ view: REF; id: string }>();
  const { getDirectory } = useLocalService();

  const [layout, setLayout] = useState<ViewMode>("grid");

  const viewType = !view ? "directory" : id ? "detail" : "listing";

  const title: Record<string, string> = {
    [REF.ALBUM]: "Albums",
    [REF.ARTIST]: "Artists",
    [REF.GENRE]: "Genre",
    [REF.TRACK]: "Tracks",
  };

  const onClickItem = async (item: AnyItem) => {
    const [view, id] = (item as Artist | Album)?.uri.split(":");
    navigate(`/local/${view}/${id}`);
  };

  if (!view) return null;

  return (
    <>
      <div className={`${viewType === "listing" ? "show" : "hide"}`}>
        <Page
          wfull={layout === "grid"}
          title={title[view]}
          rightComponent={
            <div className="mr-4">
              <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
            </div>
          }
          backButton
        >
          {layout === "list" && <List uri={view} getDirectory={getDirectory} onClickCallback={onClickItem} />}
          {layout === "grid" && <Grid uri={view} getDirectory={getDirectory} onClickCallback={onClickItem} />}
        </Page>
      </div>

      <div className={`${viewType === "detail" ? "show" : "hide"}`}>{id && <LocalDetail key={id} />}</div>
    </>
  );
};

export default LocalView;
