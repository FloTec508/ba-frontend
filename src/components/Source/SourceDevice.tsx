import { useSelector } from "react-redux";

const SourceDevice = () => {
  const { source } = useSelector((state: any) => state.player);
  const source_name = source.state?.name === "none" ? "" : source.state?.name;

  const show = ["spotify", "bluetooth", "shairportsync"].includes(source.uri);

  return (
    <span>
      {show && (source?.state?.connected ? source_name : "No device connected")}
    </span>
  );
};

export default SourceDevice;