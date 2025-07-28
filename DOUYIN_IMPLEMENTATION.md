# 🎵 抖音官方表情包实现指南

## 功能概述

本实现为 Emoji Hand 添加了完整的抖音官方表情包支持，包括：

1. **抖音隐藏表情短代码**：支持 `[smile]`、`[happy]`、`[loveface]` 等官方短代码
2. **抖音特有表情组合**：如 `👁👄👁`、`🥺👉👈` 等
3. **抖音表情含义解释**：提供每个表情的详细含义和使用示例
4. **表情分类系统**：按功能分类组织表情
5. **可视化选择器**：用户友好的表情选择界面

## 技术实现

### 1. 核心工具文件 (`src/utils/tiktokEmojis.ts`)

#### 短代码映射
```typescript
export const DOUYIN_SHORTCODES = {
  '[smile]': '😊',
  '[happy]': '😄',
  '[loveface]': '🥰',
  // ... 更多映射
};
```

#### 表情组合
```typescript
export const DOUYIN_COMBINATIONS = {
  '👁👄👁': 'I am observing and somewhat engrossed in this content',
  '🥺👉👈': 'Shy or bashful',
  // ... 更多组合
};
```

#### 特殊含义
```typescript
export const DOUYIN_MEANINGS = {
  '🪑': {
    meaning: 'Chair - placeholder with no single meaning',
    usage: 'Sometimes implying sexual meaning, other times simply to create confusion',
    example: 'nice 🪑'
  },
  // ... 更多含义
};
```

### 2. 表情选择器组件 (`src/components/DouyinEmojiPicker.tsx`)

#### 功能特性
- **多标签页设计**：短代码、组合表情、热门表情、分类
- **实时预览**：选中表情显示详细信息和示例
- **分类浏览**：按反应、情感、动作、强调、特殊分类
- **交互反馈**：悬停效果和点击反馈

#### 使用方式
```typescript
<DouyinEmojiPicker
  onSelect={(emoji) => {
    // 处理选中的表情
  }}
  onSelectShortcode={(shortcode) => {
    // 处理选中的短代码
  }}
/>
```

### 3. 翻译器集成 (`src/components/Translator.tsx`)

#### 新增功能
- **抖音表情按钮**：🎵 按钮切换表情选择器
- **短代码处理**：自动解析输入中的抖音短代码
- **实时预览**：选择表情后立即添加到输入框

#### 处理流程
```typescript
// 1. 用户输入包含短代码的文本
const inputText = "I'm feeling [happy] today!";

// 2. 解析短代码
const processedText = parseDouyinShortcodes(inputText);
// 结果: "I'm feeling 😄 today!"

// 3. 发送给AI翻译
const result = await mutateAsync({ text: processedText, mode: 'tiktok' });
```

### 4. 后端API增强 (`src/server/api/routers/emoji.ts`)

#### 系统提示优化
```typescript
case 'tiktok':
  return '你是一个TikTok风格表情翻译器，将用户输入转换为类似TikTok视频中常见的表情表达。使用夸张、有趣、富有感染力的表情符号，模仿TikTok创作者的表达风格。优先使用抖音官方隐藏表情如[smile]、[happy]、[loveface]等，以及抖音特有的表情组合如👁👄👁、🥺👉👈等。';
```

## 使用方法

### 1. 基本使用
1. 在翻译器中选择 "TikTok" 模式
2. 点击 🎵 按钮打开抖音表情选择器
3. 选择想要的表情或短代码
4. 输入文本并翻译

### 2. 短代码使用
- 直接输入：`[smile]`、`[happy]`、`[loveface]`
- 自动转换：系统会自动将短代码转换为对应表情
- 组合使用：可以混合使用短代码和普通文本

### 3. 表情组合使用
- 选择组合表情：如 `👁👄👁`、`🥺👉👈`
- 理解含义：每个组合都有特定的含义
- 创意表达：用于表达复杂的情感状态

## 表情分类

### 反应类 (Reactions)
- 😱 🤯 💀 😵‍💫 😲 😱
- 用于表达震惊、惊讶等强烈反应

### 情感类 (Emotions)
- 😍 🥺 😭 😅 😩 😌
- 用于表达各种情感状态

### 动作类 (Actions)
- 👏 💃 🕺 🎊 📝 ✅
- 用于表达动作和状态

### 强调类 (Emphasis)
- 💯 🔥 ✨ 💖
- 用于强调和突出表达

### 特殊类 (Special)
- 🪑 🤡 🎂 👁 🧍
- 抖音特有的表情符号

## 热门表情

抖音用户最常用的表情包括：
😱 💯 🔥 ✨ 😵‍💫 🤯 💀 👏 🎉 💖 🤐 😶 💭 💃 🕺 🎊 📝 ✅ 😍 🥺 😭 🤣 😅 😩 😤 😌 😏 🤪 😜 🤓 🪑 🤡 🎂 👁 🧍 🥺👉👈

## 特殊含义表情

### 🪑 Chair
- **含义**：占位符，没有单一含义
- **用法**：有时暗示性含义，有时只是制造混乱或填充空间
- **示例**：`nice 🪑`

### ✨ Sparkles
- **含义**：强调某个观点
- **用法**：有时用于讽刺或嘲笑，可作为斜体的替代
- **示例**：`✨ amazing ✨`

### 🤡 Clown Face
- **含义**：描述自私或愚蠢的人
- **用法**：用于嘲笑或批评某人
- **示例**：`You're such a 🤡`

### 💀 Skull
- **含义**：比喻"我笑死了"
- **用法**：😂 的替代，表示非常有趣
- **示例**：`This is so funny 💀`

## 技术细节

### 短代码解析
```typescript
export function parseDouyinShortcodes(text: string): string {
  let result = text;
  
  Object.entries(DOUYIN_SHORTCODES).forEach(([shortcode, emoji]) => {
    const regex = new RegExp(shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, emoji);
  });
  
  return result;
}
```

### 表情含义查询
```typescript
export function getDouyinMeaning(emoji: string): string | null {
  return DOUYIN_MEANINGS[emoji as keyof typeof DOUYIN_MEANINGS]?.meaning ?? null;
}
```

### 热门表情检查
```typescript
export function isDouyinPopular(emoji: string): boolean {
  return DOUYIN_POPULAR_EMOJIS.includes(emoji);
}
```

## 扩展建议

### 1. 添加更多短代码
- 定期更新抖音官方新增的短代码
- 支持用户自定义短代码映射

### 2. 表情使用统计
- 记录用户最常用的表情
- 提供个性化推荐

### 3. 表情包下载
- 支持将表情组合导出为图片
- 提供分享功能

### 4. 社区功能
- 用户创建的表情组合
- 表情使用排行榜

## 注意事项

1. **版权问题**：确保使用的表情符号符合相关版权规定
2. **平台兼容性**：不同平台的表情显示可能略有差异
3. **用户体验**：保持界面简洁，避免功能过于复杂
4. **性能优化**：大量表情时需要考虑性能问题

## 总结

通过这个实现，我们为 Emoji Hand 添加了完整的抖音官方表情包支持，用户可以：

1. **使用官方短代码**：如 `[smile]`、`[happy]` 等
2. **选择表情组合**：如 `👁👄👁`、`🥺👉👈` 等
3. **了解表情含义**：每个表情都有详细的解释和示例
4. **分类浏览**：按功能分类查找表情
5. **智能翻译**：AI会根据抖音风格生成表情组合

这大大提升了用户在使用抖音相关功能时的体验，让表情表达更加准确和有趣。 