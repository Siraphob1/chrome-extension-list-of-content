import { useDisplay } from "@/hooks/useDisplay";
import { useResize } from "@/hooks/useResize";
import { useSelectContent } from "@/hooks/useSelectContent";
import "@/index.css";
import ContentItemComponent from '@components/ContentItem';
import HeadingSidePanel from "@components/HeadingSidePanel";
import { scrollToElement } from '@utils/navigation';
import usePageContentAnalysis from '../hooks/usePageContentAnalysis';


export default function SidePanel() {
  const { extractionResult, loading, analyzeWebsiteContent } = usePageContentAnalysis();
  const displayOptions = useDisplay();
  const propsSelectContent = useSelectContent();
  useResize({ analyzeWebsiteContent });

  return (
    <div className="w-full p-4 pr-0 box-border font-system bg-white text-gray-800">
      <HeadingSidePanel analyzeWebsiteContent={analyzeWebsiteContent} loading={loading} displayOptions={displayOptions} />
      <div className="mt-4 overflow-y-auto max-h-[calc(100vh-100px)]">
        {extractionResult && extractionResult?.content.length > 0 && !loading ? (
          <div>
            <div className="flex flex-col gap-2">
              {extractionResult.content?.map((item, index) => (
                <ContentItemComponent
                  key={item.id ? `${item.type}-${item.id}` : `${item.type}-${index}`}
                  item={item}
                  displayOptions={displayOptions}
                  onScrollToElement={scrollToElement}
                  propsSelectContent={propsSelectContent}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 px-5 text-gray-600 text-sm leading-relaxed">
            {loading ? 'Analyzing page content...' : 'No content found with IDs on this page. Make sure elements have ID attributes.'}
          </div>
        )}
      </div>
    </div>
  );
}
