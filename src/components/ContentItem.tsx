import type { ContentItem as ContentItemType } from "@customTypes/content";

interface ContentItemProps {
  item: ContentItemType;
  index: number;
  onScrollToElement: (elementId: string) => void;
}

export default function ContentItem({ item, index, onScrollToElement }: ContentItemProps) {
  const getHeadingLevel = (tag: string): number => {
    const match = tag.match(/^h([1-6])$/);
    return match ? Number.parseInt(match[1]) : 1;
  };

  const getIndentationStyle = (level: number) => {
    const baseIndent = (level - 1) * 20; // 20px per level
    return { marginLeft: `${baseIndent}px` };
  };

  const getPrefix = (level: number): string => {
    if (level === 1) return ''; // No prefix for H1
    return '-'
  };

  if (item.type !== 'heading') return null;
  const headingLevel = getHeadingLevel(item.tag || 'h1');
  const indentStyle = getIndentationStyle(headingLevel);
  const prefix = getPrefix(headingLevel);

  return (
    <div style={indentStyle}>
      <button
        type="button"
        className="flex gap-2   dark:bg-gray-700 rounded-md  text-xs leading-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors w-full max-w-max"
        onClick={() => item.id && onScrollToElement(item.id)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && item.id) {
            e.preventDefault();
            onScrollToElement(item.id);
          }
        }}
        tabIndex={0}
        title={item.id ? `Click to focus on element with ID: ${item.id}` : 'No ID available'}
      >
        <span className="text-gray-700 dark:text-gray-200 break-words">
          {prefix}{item.text}
        </span>
      </button>
    </div>
  );
}
