# Google Analytics 设置指南

## 概述
本文档说明如何在 EmojiHand 项目中设置 Google Analytics。

## 当前配置
您的项目已配置了以下 Google Analytics 信息：
- **测量 ID**: `G-68FV3N1QZR`
- **验证代码**: `google68fv3n1qzr`
- **验证文件**: `public/google68fv3n1qzr.html`

## 步骤 1: 验证环境变量
确保 `.env` 文件中包含以下配置：

```env
# Google Analytics Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-68FV3N1QZR
GOOGLE_ANALYTICS_ID=G-68FV3N1QZR
GOOGLE_SITE_VERIFICATION=google68fv3n1qzr
```

## 步骤 2: 验证文件检查
确认以下文件存在且内容正确：
- `public/google68fv3n1qzr.html` - Google 站点验证文件
- `src/app/components/GoogleAnalytics.tsx` - Google Analytics 跟踪组件
- `src/app/layout.tsx` - 已集成跟踪代码的根布局

## 步骤 3: 测试设置
1. 重新启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问您的网站

3. 在浏览器开发者工具中检查：
   - Network 标签页是否有 Google Analytics 请求
   - Console 标签页是否有错误信息

4. 在 Google Analytics 实时报告中查看访问数据

## 步骤 4: 验证 Google 站点所有权
1. 访问 `https://emojihand.com/google68fv3n1qzr.html`
2. 确认页面可以正常访问
3. 在 Google Analytics 中完成站点验证

## 自动化设置
如果您需要重新配置，可以使用自动化脚本：

```bash
npm run setup:ga
```

## 注意事项
- Google Analytics 可能需要 24-48 小时才能开始显示完整数据
- 确保在生产环境中正确配置环境变量
- 验证文件必须可以通过公网访问

## 故障排除
如果遇到问题：
1. 检查环境变量是否正确设置
2. 确认验证文件是否可访问
3. 检查浏览器控制台是否有错误
4. 验证 Google Analytics 测量 ID 是否正确
5. 确认网站已部署并可通过公网访问

## 当前状态
✅ Google Analytics 跟踪代码已集成  
✅ 环境变量已配置  
✅ 验证文件已创建  
✅ 根布局已更新  
✅ 组件已创建  

您的 Google Analytics 设置已完成！🎉 