import { memo } from "react";
import SvgIcon from "@/components/SvgIcon";
import { DirectoryTreeItem as DirectoryTreeItemType } from "@/hooks/useBlogArticles";

interface DirectoryTreeItemProps {
  item: DirectoryTreeItemType;
  level?: number;
  collapsedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
  onFileClick: (filePath: string, fileName: string, category: string) => void;
  parentCategory?: string;
}

export const DirectoryTreeItem = memo(
  ({
    item,
    level = 0,
    collapsedFolders,
    toggleFolder,
    onFileClick,
    parentCategory = "",
  }: DirectoryTreeItemProps) => {
    const isCollapsed = collapsedFolders.has(item.id);
    const isPdfFile = item.name.toLowerCase().endsWith(".pdf");
    const isMdFile = item.name.toLowerCase().endsWith(".md");

    // 当前类别
    const currentCategory = item.isFolder ? item.name : parentCategory;

    if (item.isFolder) {
      return (
        <div>
          <div
            className="flex items-center cursor-pointer hover:bg-[rgba(255,255,255,.05)] rounded px-1 py-0.5"
            style={{ paddingLeft: `${level * 12}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            <SvgIcon
              name={isCollapsed ? "right" : "down"}
              width={12}
              height={12}
              color="#9CA3AF"
              className="mr-1 flex-shrink-0"
            />
            <span className="text-yellow-400">📁</span>
            <span className="ml-1 text-gray-300">{item.name}</span>
          </div>
          {!isCollapsed && (
            <div>
              {item.children.map((child, index) => (
                <DirectoryTreeItem
                  key={child.id || `${child.name}-${index}`}
                  item={child}
                  level={level + 1}
                  collapsedFolders={collapsedFolders}
                  toggleFolder={toggleFolder}
                  onFileClick={onFileClick}
                  parentCategory={currentCategory}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className="flex items-center cursor-pointer hover:bg-[rgba(255,255,255,.05)] rounded px-1 py-0.5 transition-colors"
          style={{ paddingLeft: `${level * 12 + 16}px` }}
          onClick={() => onFileClick(item.id, item.name, currentCategory)}
        >
          <span
            className={
              isPdfFile
                ? "text-red-400"
                : isMdFile
                  ? "text-blue-400"
                  : "text-gray-400"
            }
          >
            {isPdfFile ? "📕" : isMdFile ? "📄" : "📄"}
          </span>
          <span className="ml-1 text-gray-300 line-clamp-1">{item.name}</span>
        </div>
      );
    }
  },
);

DirectoryTreeItem.displayName = "DirectoryTreeItem";
