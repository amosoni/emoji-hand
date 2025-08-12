#!/usr/bin/env node

/**
 * Google Analytics 设置脚本
 * 使用方法: node scripts/setup-google-analytics.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Google Analytics 设置向导');
console.log('========================\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupGoogleAnalytics() {
  try {
    // 获取 Google Analytics 测量 ID
    const gaId = await question('请输入您的 Google Analytics 测量 ID (格式: G-XXXXXXXXXX): ');
    
    if (!gaId.match(/^G-[A-Z0-9]{10}$/)) {
      console.log('❌ 无效的 Google Analytics 测量 ID 格式');
      console.log('正确格式应该是: G-XXXXXXXXXX');
      return;
    }

    // 获取 Google 站点验证代码
    const verificationCode = await question('请输入您的 Google 站点验证代码: ');
    
    if (!verificationCode) {
      console.log('❌ 验证代码不能为空');
      return;
    }

    // 更新 .env 文件
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // 检查是否已存在配置
    if (envContent.includes('NEXT_PUBLIC_GA_MEASUREMENT_ID')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_GA_MEASUREMENT_ID=.*/g,
        `NEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId}`
      );
      envContent = envContent.replace(
        /GOOGLE_ANALYTICS_ID=.*/g,
        `GOOGLE_ANALYTICS_ID=${gaId}`
      );
      envContent = envContent.replace(
        /GOOGLE_SITE_VERIFICATION=.*/g,
        `GOOGLE_SITE_VERIFICATION=${verificationCode}`
      );
    } else {
      envContent += `\n# Google Analytics Configuration\nNEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId}\nGOOGLE_ANALYTICS_ID=${gaId}\nGOOGLE_SITE_VERIFICATION=${verificationCode}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env 文件已更新');

    // 创建验证文件
    const verificationPath = path.join(process.cwd(), 'public', `${verificationCode}.html`);
    const verificationContent = `<!DOCTYPE html>
<html>
<head>
    <title>Google Site Verification</title>
    <meta name="google-site-verification" content="${verificationCode}" />
</head>
<body>
    <p>This page is used for Google site verification for EmojiHand.</p>
</body>
</html>`;
    
    fs.writeFileSync(verificationPath, verificationContent);
    console.log(`✅ 验证文件已创建: public/${verificationCode}.html`);

    // 更新根布局文件中的验证代码
    const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    layoutContent = layoutContent.replace(
      /google: '.*'/g,
      `google: '${verificationCode}'`
    );
    
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('✅ 根布局文件已更新');

    console.log('\n🎉 Google Analytics 设置完成！');
    console.log('\n下一步:');
    console.log('1. 重新启动开发服务器');
    console.log('2. 访问您的网站');
    console.log('3. 在 Google Analytics 中验证设置');
    console.log('4. 检查实时报告是否显示访问数据');

  } catch (error) {
    console.error('❌ 设置过程中出现错误:', error instanceof Error ? error.message : String(error));
  } finally {
    rl.close();
  }
}

setupGoogleAnalytics(); 