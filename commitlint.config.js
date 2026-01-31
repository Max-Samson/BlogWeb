export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: commitlintEmojiParser,
  rules: {
    // 类型枚举
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // 修复bug
        "docs", // 文档变更
        "style", // 代码格式调整
        "refactor", // 重构
        "perf", // 性能优化
        "test", // 测试相关
        "chore", // 构建/工具变动
        "revert", // 回退
      ],
    ],
    // 类型小写
    "type-case": [2, "always", "lower-case"],
    // 描述不能为空
    "subject-empty": [2, "never"],
    // 描述不以.结尾
    "subject-full-stop": [2, "never", "."],
    // header最大长度
    "header-max-length": [2, "always", 100],
  },
};
