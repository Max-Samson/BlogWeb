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

// 文件类型检测辅助函数
function getFileType(fileName: string): "pdf" | "md" | "unknown" {
  const lowerName = fileName.toLowerCase();

  // 检查是否包含 pdf 关键字（扩展名或文件名中包含）
  if (lowerName.includes(".pdf") || lowerName.includes("pdf")) {
    return "pdf";
  }

  // 检查是否包含 md 关键字
  if (lowerName.includes(".md") || lowerName.endsWith("md")) {
    return "md";
  }

  return "unknown";
}

// 文件图标配置
const FILE_ICONS = {
  pdf: {
    icon: "pdf",
    color: "#EF4444",
    bgColor: "bg-red-500/10",
    label: "PDF"
  },
  md: {
    icon: "md",
    color: "#3B82F6",
    bgColor: "bg-blue-500/10",
    label: "MD"
  },
  unknown: {
    icon: "file",
    color: "#9CA3AF",
    bgColor: "bg-gray-500/10",
    label: "FILE"
  }
};

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
    const currentCategory = item.isFolder ? item.name : parentCategory;

    if (item.isFolder) {
      return (
        <div>
          <div
            className="flex items-center cursor-pointer hover:bg-[rgba(255,255,255,.05)] rounded px-1.5 py-1 transition-colors"
            style={{ paddingLeft: `${level * 12}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            <SvgIcon
              name={isCollapsed ? "right" : "down"}
              width={14}
              height={14}
              color="#9CA3AF"
              className="mr-1.5 flex-shrink-0"
            />
            <span className="text-[16px] mr-1.5">📁</span>
            <span className="text-sm text-gray-200 font-medium">{item.name}</span>
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
      const fileType = getFileType(item.name);
      const iconConfig = FILE_ICONS[fileType];

      return (
        <div
          className="flex items-center cursor-pointer hover:bg-[rgba(255,255,255,.08)] rounded px-1.5 py-1 transition-colors group"
          style={{ paddingLeft: `${level * 12 + 20}px` }}
          onClick={() => onFileClick(item.id, item.name, currentCategory)}
        >
          {/* 文件图标 */}
          <div className={`flex-shrink-0 mr-2 ${iconConfig.bgColor} rounded p-1`}>
            <span className="text-[14px]">
              {fileType === "pdf" ? "📕" : fileType === "md" ? "📄" : "📄"}
            </span>
          </div>

          {/* 文件名 */}
          <span className="text-sm text-gray-300 line-clamp-1 group-hover:text-white transition-colors">
            {item.name}
          </span>

          {/* 文件类型标签 */}
          <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium ${iconConfig.bgColor} text-[${iconConfig.color}]`}>
            {iconConfig.label}
          </span>
        </div>
      );
    }
  },
);

DirectoryTreeItem.displayName = "DirectoryTreeItem";
