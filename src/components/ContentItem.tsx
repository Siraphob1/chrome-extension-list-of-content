import type { DisplayOptionsType } from "@/hooks/useDisplay";
import type { ContentItem as ContentItemType } from "@customTypes/content";
import clsx from "clsx";

interface ContentItemProps {
  item: ContentItemType;
  onScrollToElement: (elementId: string) => void;
  displayOptions: DisplayOptionsType
}

export default function ContentItem({ item, displayOptions, onScrollToElement }: ContentItemProps) {
  const { stateTagName } = displayOptions;
  const getHeadingLevel = (tag: string): number => {
    const match = tag.match(/^h([1-6])$/);
    return match ? Number.parseInt(match[1]) : 1;
  };

  const getIndentationStyle = (level: number) => {
    const baseIndent = (level - 1) * 20; // 20px per level
    return { marginLeft: `${baseIndent}px` };
  };

  const getPrefix = (level: number): boolean => {
    if (level === 1) return false; // No prefix for H1
    return true
  };

  if (item.type !== 'heading') return null;
  const headingLevel = getHeadingLevel(item.tag || 'h1');
  const indentStyle = getIndentationStyle(headingLevel);
  const prefix = getPrefix(headingLevel);

  return (
    <div style={indentStyle} className="flex">
      {prefix && <span className={clsx({ 'mr-1': prefix })}>-</span>}
      <button
        type="button"
        className="flex gap-2  rounded-md  text-xs text-start leading-normal cursor-pointer  transition-colors w-full max-w-max group"
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
        <span className="text-gray-700 break-words group-hover:opacity-50">
          {stateTagName && <span className="border px-1 rounded-[4px]">{item.tag}</span>} {item.text}
        </span>
      </button>
    </div>
  );
}
