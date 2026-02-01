import { TableOfContentsItem } from "@/hooks/useBlogArticles";
import SvgIcon from "@/components/SvgIcon";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeHeading: string;
  onHeadingClick: (headingId: string) => void;
}

export function TableOfContents({
  items,
  activeHeading,
  onHeadingClick,
}: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-[300px] order-1 lg:order-2 lg:sticky lg:top-20 lg:h-fit">
      <div className="bg-[var(--black-light)] rounded-lg p-3 lg:p-4 border border-[var(--white-light)]">
        <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4">
          目录
        </h3>
        <nav className="lg:block">
          {/* 移动端折叠目录 */}
          <div className="lg:hidden">
            <details className="group">
              <summary className="cursor-pointer text-sm text-gray-300 hover:text-white transition-colors list-none flex items-center justify-between">
                <span>展开目录</span>
                <SvgIcon
                  name="down"
                  width={16}
                  height={16}
                  color="#9CA3AF"
                  className="group-open:rotate-180 transition-transform"
                />
              </summary>
              <div className="mt-2 max-h-60 overflow-y-auto custom-scrollbar overflow-x-hidden">
                {items.map((item) => (
                  <TOCButton
                    key={item.id}
                    item={item}
                    isActive={activeHeading === item.id}
                    onClick={() => onHeadingClick(item.id)}
                  />
                ))}
              </div>
            </details>
          </div>

          {/* 桌面端展开目录 */}
          <div className="hidden lg:block">
            {items.map((item) => (
              <TOCButton
                key={item.id}
                item={item}
                isActive={activeHeading === item.id}
                onClick={() => onHeadingClick(item.id)}
              />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

interface TOCButtonProps {
  item: TableOfContentsItem;
  isActive: boolean;
  onClick: () => void;
}

function TOCButton({ item, isActive, onClick }: TOCButtonProps) {
  const getClassName = () => {
    let baseClass =
      "block w-full text-left py-2 px-2 text-sm hover:bg-[rgba(255,255,255,.1)] rounded transition-colors relative ";

    if (isActive) {
      baseClass += "text-[#214362] font-semibold pl-4";
    } else if (item.level === 1) {
      baseClass += "text-white font-medium";
    } else if (item.level === 2) {
      baseClass += "text-gray-300 ml-4";
    } else {
      baseClass += "text-gray-400 ml-8";
    }

    return baseClass;
  };

  return (
    <button onClick={onClick} className={getClassName()}>
      {isActive && (
        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-[#214362] rounded-r"></span>
      )}
      <span className={isActive ? "ml-3" : ""}>{item.title}</span>
    </button>
  );
}
