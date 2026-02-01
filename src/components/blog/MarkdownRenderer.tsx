import { useState, JSX } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownRendererProps {
  content: string;
  onCopyToast?: () => void;
}

export function MarkdownRenderer({ content, onCopyToast }: MarkdownRendererProps) {
  const [showToast, setShowToast] = useState(false);

  // 复制代码功能
  const copyToClipboard = (text: string) => {
    const cleanText = text.replace(/\n$/, "");
    navigator.clipboard
      .writeText(cleanText)
      .then(() => {
        setShowToast(true);
        onCopyToast?.();
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("复制失败:", err);
      });
  };

  // 渲染 Markdown 内容
  const renderMarkdown = (content: string): JSX.Element[] => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent = "";
    let codeLanguage = "";
    let headingIndex = 0;

    lines.forEach((line, index) => {
      // 代码块处理
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockContent = "";
          codeLanguage = line.replace("```", "").trim() || "plaintext";
        } else {
          inCodeBlock = false;
          const currentCodeContent = codeBlockContent;
          const currentLanguage = codeLanguage;

          elements.push(
            <div
              key={`code-${index}`}
              className="bg-gray-900 rounded-lg my-4 overflow-hidden relative group"
            >
              {/* 语言标签和复制按钮 */}
              <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 uppercase font-mono">
                  {currentLanguage}
                </span>
                <button
                  onClick={() => copyToClipboard(currentCodeContent)}
                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                  title="复制代码"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  复制
                </button>
              </div>

              {/* 使用 SyntaxHighlighter 进行语法高亮 */}
              <SyntaxHighlighter
                language={currentLanguage === "plaintext" ? "text" : currentLanguage}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  background: "transparent",
                  fontSize: "14px",
                }}
                showLineNumbers={false}
                wrapLines={true}
              >
                {currentCodeContent}
              </SyntaxHighlighter>
            </div>,
          );
        }
        return;
      }

      if (inCodeBlock) {
        if (codeBlockContent === "") {
          codeBlockContent = line;
        } else {
          codeBlockContent += "\n" + line;
        }
        return;
      }

      // 标题处理
      if (line.startsWith("# ")) {
        const id = `heading-${headingIndex}`;
        headingIndex++;
        elements.push(
          <h1
            key={index}
            id={id}
            className="text-3xl font-bold mb-4 text-white mt-8 first:mt-0"
          >
            {line.replace("# ", "")}
          </h1>,
        );
      } else if (line.startsWith("## ")) {
        const id = `heading-${headingIndex}`;
        headingIndex++;
        elements.push(
          <h2
            key={index}
            id={id}
            className="text-2xl font-bold mb-3 text-white mt-6"
          >
            {line.replace("## ", "")}
          </h2>,
        );
      } else if (line.startsWith("### ")) {
        const id = `heading-${headingIndex}`;
        headingIndex++;
        elements.push(
          <h3
            key={index}
            id={id}
            className="text-xl font-bold mb-2 text-white mt-4"
          >
            {line.replace("### ", "")}
          </h3>,
        );
      } else if (line.trim() && !line.startsWith("`")) {
        // 普通段落
        elements.push(
          <p key={index} className="mb-4 text-gray-300 leading-relaxed">
            {line}
          </p>,
        );
      } else if (!line.trim()) {
        elements.push(<br key={index} />);
      }
    });

    return elements;
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          代码已复制到剪贴板
        </div>
      )}
      {renderMarkdown(content)}
    </>
  );
}
