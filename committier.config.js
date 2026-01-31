import { defineConfig } from "committier";

export default defineConfig({
  // 关闭自动emoji（默认开启）
  autoEmoji: true,
  // 自动从工作区包名推断作用域
  autoScope: "replaceToPackageName",
  // 修改默认提交类型为feat
  defaultType: "feat",
  // 开启自动生成默认描述信息来兜底
  defaultDescription: true,
});
