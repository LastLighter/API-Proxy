import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username } = await request.json();
  const adminUsername = process.env.ADMIN_USERNAME;

  if (username === adminUsername) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, message: '用户名错误' }, { status: 401 });
  }
} 