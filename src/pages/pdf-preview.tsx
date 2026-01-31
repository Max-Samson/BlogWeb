import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import PdfViewer from "@/components/PdfViewer";

export default function PdfPreviewPage() {
  const router = useRouter();
  const { file } = router.query;

  const [pdfFile, setPdfFile] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (file && typeof file === "string") {
      setPdfFile(`/api/pdf/${file}`);
    } else {
      setError("未指定 PDF 文件");
    }
  }, [file]);

  return (
    <>
      <Head>
        <title>PDF 预览 - XiaoShuai&apos;s Blog</title>
        <meta name="description" content="PDF 文件预览" />
      </Head>

      <div className="min-h-screen p-4 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          {/* 返回按钮 */}
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← 返回
          </button>

          {/* 错误状态 */}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* PDF 预览 */}
          {pdfFile && !error && (
            <PdfViewer file={pdfFile} className="h-screen" />
          )}
        </div>
      </div>
    </>
  );
}
