# TikTok表情图片设置指南

## 概述

为了让TikTok表情显示真实的官方外观，我们需要将表情图片文件添加到项目中。这些图片应该与您在图片中看到的真实TikTok隐藏表情完全一致。

## 需要添加的图片文件

请将以下46个TikTok表情图片文件添加到 `public/images/tiktok-emojis/` 目录中：

### 基础表情 (22个)
1. `smile.png` - [smile] 粉色圆形笑脸
2. `happy.png` - [happy] 桃色脸，眯眼大笑
3. `angry.png` - [angry] 红色愤怒脸
4. `cry.png` - [cry] 蓝色哭泣脸
5. `embarrassed.png` - [embarrassed] 害羞脸红脸
6. `surprised.png` - [surprised] 惊讶脸
7. `wronged.png` - [wronged] 委屈脸
8. `shout.png` - [shout] 喊叫脸
9. `flushed.png` - [flushed] 脸红脸
10. `yummy.png` - [yummy] 舔嘴唇脸
11. `complacent.png` - [complacent] 自满脸
12. `drool.png` - [drool] 流口水脸
13. `scream.png` - [scream] 尖叫脸
14. `weep.png` - [weep] 哭泣脸
15. `speechless.png` - [speechless] 无语脸
16. `funnyface.png` - [funnyface] 搞笑脸
17. `laughwithtears.png` - [laughwithtears] 笑出眼泪脸
18. `wicked.png` - [wicked] 邪恶脸
19. `facewithrollingeyes.png` - [facewithrollingeyes] 翻白眼脸
20. `sulk.png` - [sulk] 生闷气脸
21. `thinking.png` - [thinking] 思考脸
22. `shock.png` - [shock] 震惊脸

### 高级表情 (24个)
23. `lovely.png` - [lovely] 可爱脸
24. `greedy.png` - [greedy] 贪婪脸
25. `wow.png` - [wow] 哇脸
26. `joyful.png` - [joyful] 开心脸
27. `hehe.png` - [hehe] 嘿嘿脸
28. `slap.png` - [slap] 拍手脸
29. `tears.png` - [tears] 眼泪
30. `stun.png` - [stun] 眩晕脸
31. `cute.png` - [cute] 可爱脸
32. `blink.png` - [blink] 眨眼脸
33. `disdain.png` - [disdain] 不屑脸
34. `astonish.png` - [astonish] 震惊脸
35. `rage.png` - [rage] 愤怒脸
36. `cool.png` - [cool] 酷脸
37. `excited.png` - [excited] 兴奋脸
38. `proud.png` - [proud] 骄傲脸
39. `smileface.png` - [smileface] 笑脸
40. `evil.png` - [evil] 恶魔脸
41. `angel.png` - [angel] 天使脸
42. `laugh.png` - [laugh] 大笑脸
43. `pride.png` - [pride] 自豪脸
44. `nap.png` - [nap] 睡觉脸
45. `loveface.png` - [loveface] 爱心脸
46. `awkward.png` - [awkward] 尴尬脸

## 图片要求

### 格式和尺寸
- **格式**: PNG (推荐) 或 JPG
- **尺寸**: 建议 64x64 像素或 128x128 像素
- **背景**: 透明背景 (PNG格式)
- **质量**: 清晰，无模糊

### 获取图片的方法

#### 方法1: 从官方网站下载
1. 访问 [alltiktokemojis.com](https://alltiktokemojis.com/)
2. 点击每个表情查看详情
3. 下载对应的PNG图片
4. 重命名为对应的文件名

#### 方法2: 从TikTok应用截图
1. 在TikTok应用中输入短代码
2. 截图表情显示效果
3. 裁剪为正方形
4. 保存为PNG格式

#### 方法3: 使用开发者工具
1. 在浏览器中打开TikTok
2. 输入表情短代码
3. 使用开发者工具查看网络请求
4. 找到表情图片的URL并下载

## 文件结构

```
public/
└── images/
    └── tiktok-emojis/
        ├── smile.png
        ├── happy.png
        ├── angry.png
        ├── cry.png
        ├── embarrassed.png
        ├── surprised.png
        ├── wronged.png
        ├── shout.png
        ├── flushed.png
        ├── yummy.png
        ├── complacent.png
        ├── drool.png
        ├── scream.png
        ├── weep.png
        ├── speechless.png
        ├── funnyface.png
        ├── laughwithtears.png
        ├── wicked.png
        ├── facewithrollingeyes.png
        ├── sulk.png
        ├── thinking.png
        ├── shock.png
        ├── lovely.png
        ├── greedy.png
        ├── wow.png
        ├── joyful.png
        ├── hehe.png
        ├── slap.png
        ├── tears.png
        ├── stun.png
        ├── cute.png
        ├── blink.png
        ├── disdain.png
        ├── astonish.png
        ├── rage.png
        ├── cool.png
        ├── excited.png
        ├── proud.png
        ├── smileface.png
        ├── evil.png
        ├── angel.png
        ├── laugh.png
        ├── pride.png
        ├── nap.png
        ├── loveface.png
        └── awkward.png
```

## 使用方法

### 1. 在组件中使用
```tsx
import TikTokEmojiImage from '@/components/TikTokEmojiImage';

// 显示单个表情
<TikTokEmojiImage shortcode="[smile]" size={32} />

// 显示多个表情
<div>
  <TikTokEmojiImage shortcode="[happy]" size={24} />
  <TikTokEmojiImage shortcode="[cool]" size={24} />
  <TikTokEmojiImage shortcode="[wicked]" size={24} />
</div>
```

### 2. 在文本中解析表情
```tsx
import { parseTikTokEmojiImages } from '@/utils/tiktokEmojiImages';

const text = "I'm so [happy] today! This is [cool] 😎";
const parsedText = parseTikTokEmojiImages(text);
// 结果: "I'm so <img src="/images/tiktok-emojis/happy.png" ... /> today! This is <img src="/images/tiktok-emojis/cool.png" ... /> 😎"
```

### 3. 回退机制
如果图片文件不存在，组件会自动回退到Unicode表情：
- 有图片文件 → 显示真实TikTok表情图片
- 无图片文件 → 显示Unicode表情符号
- 都不可用 → 显示短代码文本

## 测试

添加图片后，可以通过以下方式测试：

1. **访问页面**: `http://localhost:3001/tiktok`
2. **查看表情选择器**: 检查表情是否正确显示
3. **测试翻译功能**: 输入包含短代码的文本
4. **检查回退**: 删除某些图片文件，确认回退机制正常工作

## 注意事项

1. **文件命名**: 确保文件名与代码中的映射完全一致
2. **图片质量**: 使用高质量的图片，避免模糊或失真
3. **文件大小**: 优化图片大小，避免影响加载速度
4. **浏览器兼容性**: 确保图片格式在目标浏览器中支持
5. **CDN考虑**: 如果部署到生产环境，考虑使用CDN加速图片加载

## 完成后的效果

添加所有图片文件后，您的TikTok表情功能将显示：
- ✅ 真实的TikTok官方表情外观
- ✅ 与TikTok应用完全一致的表情效果
- ✅ 流畅的用户体验
- ✅ 完整的46个表情支持

这样用户就能看到与真实TikTok应用完全一致的表情效果了！🎵✨ 