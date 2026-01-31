"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";

// 配置 Worker - 使用 CDN 确保版本匹配
if (typeof window !== "undefined") {
  // 使用与 react-pdf 内部 pdfjs-dist 版本匹配的 worker
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PdfViewerProps {
  file: string | File | Blob;
  className?: string;
}

export default function PdfViewer({ file, className = "" }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages);
    setLoading(false);
  }

  function onLoadError(error: Error) {
    setError(error.message);
    setLoading(false);
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }

  function goToPreviousPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  // 服务器端渲染时显示加载状态
  if (!mounted) {
    return (
      <div className={`pdf-viewer ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            加载中...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${className}`}>
      {/* 控制栏 */}
      {numPages > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            上一页
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            第 {pageNumber} / {numPages} 页
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            下一页
          </button>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            加载中...
          </span>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
          加载 PDF 失败: {error}
        </div>
      )}

      {/* PDF 渲染区域 */}
      <div className="pdf-container overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onLoadError}
          loading={loading ? undefined : <div></div>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="mx-auto"
          />
        </Document>
      </div>
    </div>
  );
}
