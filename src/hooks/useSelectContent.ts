import { useCallback, useState } from "react";

export interface ContentSelectType {
  id: string | null;
  selectContent: (content: string) => void;
}

export const useSelectContent = (): ContentSelectType => {
  const [id, setId] = useState<string | null>(null);

  const selectContent = useCallback((content: string) => {
    setId(content);
  }, []);

  return {
    id,
    selectContent,
  };
}