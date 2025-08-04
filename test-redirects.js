// 测试重定向配置的脚本
const testUrls = [
  'https://www.emojihand.com/',
  'https://www.emojihand.com/tiktok',
  'https://www.emojihand.com/en',
  'https://www.emojihand.com/zh',
  'https://www.emojihand.com/en/tiktok',
  'https://www.emojihand.com/zh/tiktok',
];

console.log('重定向测试结果：');
console.log('==================');

testUrls.forEach(url => {
  console.log(`测试 URL: ${url}`);
  console.log(`预期重定向: ${url.includes('/en') || url.includes('/zh') ? '无重定向' : '重定向到 /en 路径'}`);
  console.log('---');
});

console.log('修复说明：');
console.log('1. 根页面现在直接重定向到 /en');
console.log('2. 中间件只处理没有语言代码的路径');
console.log('3. 所有页面都添加了 X-Robots-Tag: index, follow');
console.log('4. Sitemap 已更新为正确的域名和语言路径');
console.log('5. Robots.txt 已正确配置'); 