import "@/index.css";
import ContentItemComponent from '@components/ContentItem';
import { scrollToElement } from '@utils/navigation';
import usePageContentAnalysis from '../hooks/usePageContentAnalysis';


export default function SidePanel() {
  const { currentUrl, extractionResult, loading } = usePageContentAnalysis();

  return (
    <div className="w-full h-screen p-4 box-border font-system bg-white dark:bg-gray-800 overflow-y-auto text-gray-800 dark:text-gray-200">
      <div className="mb-5 border-b border-gray-200 dark:border-gray-600 pb-4">
        <h1 className="m-0 mb-3 text-lg font-semibold text-gray-900 dark:text-white">Website Content Lister1</h1>
        <div className="text-xs text-gray-600 dark:text-gray-300 leading-normal">
          <strong className="block mb-1 text-gray-700 dark:text-white">Current URL:</strong>
          <span className="break-all bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200">
            {currentUrl || 'No active tab'}
          </span>
        </div>
      </div>

      <div className="flex-1">
        {extractionResult && extractionResult.content.length > 0 ? (
          <div>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <h3 className="m-0 mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
                Analysis Results
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
                <div>Total items: <span className="font-semibold">{extractionResult.stats.total}</span></div>
                <div>Headings: <span className="font-semibold">{extractionResult.stats.headings}</span></div>
                <div>Links: <span className="font-semibold">{extractionResult.stats.links}</span></div>
                <div>Images: <span className="font-semibold">{extractionResult.stats.images}</span></div>
                <div className="col-span-2">Paragraphs: <span className="font-semibold">{extractionResult.stats.paragraphs}</span></div>
              </div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                Analyzed at: {new Date(extractionResult.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <h3 className="m-0 mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Content Items:
            </h3>
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
