import IconLoading from "@/assets/icons/loading";
import IconRefresh from "@/assets/icons/refresh";
import "@/index.css";
import ContentItemComponent from '@components/ContentItem';
import { scrollToElement } from '@utils/navigation';
import usePageContentAnalysis from '../hooks/usePageContentAnalysis';


export default function SidePanel() {
  const { extractionResult, loading, analyzeWebsiteContent } = usePageContentAnalysis();

  return (
    <div className="w-full p-4 box-border font-system bg-white dark:bg-gray-800  text-gray-800 dark:text-gray-200">
      <section className="sticky top-4 flex items-center justify-between">
        <h1 className=" text-lg font-semibold text-gray-900 dark:text-white">Content Items</h1>
        <button
          type="button"
          onClick={analyzeWebsiteContent}
          className="cursor-pointer"
          aria-label="Refresh content analysis"
        >
          {loading ? <IconLoading className="animate-spin w-4 h-4" /> : <IconRefresh className="w-4 h-4" />}
        </button>

      </section>
      <div className="mt-4 flex-1">
        {extractionResult && extractionResult?.content.length > 0 && !loading ? (
          <div>
            <div className="flex flex-col gap-2">
              {extractionResult.content?.map((item, index) => (
                <ContentItemComponent
                  key={item.id ? `${item.type}-${item.id}` : `${item.type}-${index}`}
                  item={item}
                  index={index}
                  onScrollToElement={scrollToElement}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 px-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {loading ? 'Analyzing page content...' : 'No content found with IDs on this page. Make sure elements have ID attributes.'}
          </div>
        )}
      </div>
    </div>
  );
}
