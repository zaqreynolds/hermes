import { DarkModeSelector } from "./DarkModeButton";

export const Header = () => {
  return (
    <div className="flex flex-shrink-0 w-full h-20 text-left px-4 mb-2 bg-background-alt shadow-sm items-center justify-between">
      <h1 className="text-3xl font-bold ">Hermes</h1>
      <DarkModeSelector />
    </div>
  );
};
