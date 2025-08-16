import IconLoading from "@/assets/icons/loading";
import IconRefresh from "@/assets/icons/refresh";
import type { DisplayOptionsType } from "@/hooks/useDisplay";
import clsx from "clsx";

interface Props {
  analyzeWebsiteContent: () => void;
  loading: boolean;
  displayOptions: DisplayOptionsType
}
const HeadingSidePanel = ({ analyzeWebsiteContent, loading, displayOptions }: Props) => {
  const { toggleTagName, stateTagName } = displayOptions;
  return (
    <section className="sticky top-4 flex items-center justify-between">
      <h1 className=" text-lg font-semibold text-gray-900 dark:text-white">Content Items</h1>
      <section className="flex items-center gap-2">
        <button
          type="button"
          className={clsx("text-base cursor-pointer",
            { "line-through": stateTagName }
          )}
          aria-label="Toggle display tag of each heading"
          onClick={toggleTagName}>
          Tag
        </button>
        <button
          type="button"
          onClick={analyzeWebsiteContent}
          className="cursor-pointer"
          aria-label="Refresh content analysis"
        >
          {loading ? <IconLoading className="animate-spin w-4 h-4" /> : <IconRefresh className="w-4 h-4" />}
        </button>
      </section>

    </section>
  )
}

export default HeadingSidePanel