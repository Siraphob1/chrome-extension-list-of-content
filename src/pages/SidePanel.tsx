import "@/index.css";
import ContentItemComponent from '@components/ContentItem';
import { scrollToElement } from '@utils/navigation';
import usePageContentAnalysis from '../hooks/usePageContentAnalysis';


export default function SidePanel() {
  const { currentUrl, extractionResult, loading } = usePageContentAnalysis();

  return (
    <div className="w-full h-screen p-4 box-border font-system bg-white dark:bg-gray-800 overflow-y-auto text-gray-800 dark:text-gray-200">
      <h1 className="m-0 mb-3 text-lg font-semibold text-gray-900 dark:text-white">Content Items:</h1>

      <div className="flex-1">
        {extractionResult && extractionResult.content.length > 0 ? (
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
