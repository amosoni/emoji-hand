export function applyBrandSponsorship(text: string): string {
  // 30% 概率显示品牌彩蛋
  if (Math.random() > 0.7) {
    const brands = [
      { name: "Starbucks", emoji: "☕", text: "fueled by Starbucks" },
      { name: "Nike", emoji: "👟", text: "Just Do It" },
      { name: "Apple", emoji: "", text: "Think Different" }
    ];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    return `${text} ${brand.emoji} *${brand.text}*`;
  }
  return text;
}
