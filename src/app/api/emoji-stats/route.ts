import { NextRequest, NextResponse } from "next/server";

// 用于演示，实际应存数据库，这里用内存变量
let stats: Record<string, number> = {};

export async function POST(req: NextRequest) {
  const { translated } = await req.json();
  // 简单统计每个 emoji 出现次数
  const emojis = (translated.match(/\p{Emoji}/gu) || []);
  emojis.forEach((e: string) => {
    stats[e] = (stats[e] || 0) + 1;
  });
  return NextResponse.json({ success: true });
}

export async function GET() {
  // 返回当前统计数据
  return NextResponse.json({ stats });
} 