import { useEffect, useRef } from "react";

interface Props {
  analyzeWebsiteContent: () => void;
}
export const useResize = ({ analyzeWebsiteContent }: Props) => {
  const debounceTime = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const handleResize = () => {
      if (debounceTime.current) clearTimeout(debounceTime.current);
      debounceTime.current = setTimeout(() => {
        analyzeWebsiteContent();
      }, 400);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (debounceTime.current) clearTimeout(debounceTime.current);
    };
  }, [analyzeWebsiteContent]);
}