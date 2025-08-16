import { useState } from "react";

export interface DisplayOptionsType {
  stateTagName: boolean;
  toggleTagName: () => void;
}

export const useDisplay = (): DisplayOptionsType => {
  const [stateTagName, setStateTagName] = useState<boolean>(false);
  return {
    stateTagName,
    toggleTagName: () => setStateTagName((prev) => !prev),
  }
}