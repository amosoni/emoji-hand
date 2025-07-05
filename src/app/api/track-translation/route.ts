import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  // 这里可以存数据库、写日志等
  console.log("Track translation:", data);
  return NextResponse.json({ success: true });
} 