const Spinner = ({ mode }: { mode?: "dark" | "light" }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`animate-spin rounded-full h-5 w-5 border-2 border-t-transparent ${mode === "dark" ? "border-neutral-950" : mode === "light" ? "border-white" : "loader-foreground"}`}
      ></div>
    </div>
  );
};

export default Spinner