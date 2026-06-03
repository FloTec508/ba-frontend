import { useNavigate } from "react-router-dom";
import { FolderSimpleIcon, GearIcon, MusicNotesIcon, UserIcon, VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Page from "@/components/Page";
import ListMenu from "@/components/ListMenu";
import ButtonIcon from "@/components/Button/ButtonIcon";

const Local = () => {
  const navigate = useNavigate();

  const directories = [
    {
      name: "Artists",
      icon: <UserIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "artist",
    },
    {
      name: "Albums",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "album",
    },
    {
      name: "Tracks",
      icon: <MusicNotesIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "track",
    },
    {
      name: "Genre",
      icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "genre",
    },
  ];

  const onClickDirectory = (view: string) => {
    navigate(`/local/${view}`);
  };

  return (
    <Page
      title="Library"
      rightComponent={
        <div className="mr-4">
          <ButtonIcon onClick={() => navigate("/settings/local")}>
            <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </ButtonIcon>
        </div>
      }
      backButton
    >
      {directories.map((dir, index: number) => (
        <ListMenu key={index} name={dir.name} icon={dir.icon} onClick={() => onClickDirectory(dir.type)} />
      ))}
    </Page>
  );
};

export default Local;
