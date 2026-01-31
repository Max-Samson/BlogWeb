import { defineConfig } from "committier";

export default defineConfig({
  // 关闭自动emoji（默认开启）
  autoEmoji: true,
  // 不自动添加作用域，手动输入
  autoScope: false,
  // 修改默认提交类型为feat
  defaultType: "feat",
  // 开启自动生成默认描述信息来兜底
  defaultDescription: true,
});
