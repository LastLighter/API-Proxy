import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeyStats } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET: 获取API key统计信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const all = searchParams.get('all');

    // 如果请求所有API key
    if (all === 'true') {
      const allStats = await db.query.apiKeyStats.findMany({
        orderBy: (apiKeyStats, { desc }) => [desc(apiKeyStats.updatedAt)],
      });

      return NextResponse.json(allStats);
    }

    // 获取单个API key的统计信息
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key parameter is required' },
        { status: 400 }
      );
    }

    const stats = await db.query.apiKeyStats.findFirst({
      where: eq(apiKeyStats.apiKey, apiKey),
    });

    if (!stats) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      apiKey: stats.apiKey,
      totalCalls: stats.totalCalls,
      successfulCalls: stats.successfulCalls,
      remainingCalls: stats.remainingCalls,
      createdAt: stats.createdAt,
      updatedAt: stats.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching API key stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 创建新的API key记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, initialRemainingCalls = 100 } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // 检查API key是否已存在
    const existingStats = await db.query.apiKeyStats.findFirst({
      where: eq(apiKeyStats.apiKey, apiKey),
    });

    if (existingStats) {
      return NextResponse.json(
        { error: 'API key already exists' },
        { status: 409 }
      );
    }

    // 创建新的API key记录
    const newStats = await db.insert(apiKeyStats).values({
      apiKey,
      totalCalls: 0,
      successfulCalls: 0,
      remainingCalls: initialRemainingCalls,
    }).returning();

    return NextResponse.json({
      message: 'API key created successfully',
      apiKey: newStats[0].apiKey,
      remainingCalls: newStats[0].remainingCalls,
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: 更新API key的剩余次数
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, remainingCalls } = body;

    if (!apiKey || typeof remainingCalls !== 'number') {
      return NextResponse.json(
        { error: 'API key and remainingCalls are required' },
        { status: 400 }
      );
    }

    const updatedStats = await db.update(apiKeyStats)
      .set({
        remainingCalls,
        updatedAt: new Date(),
      })
      .where(eq(apiKeyStats.apiKey, apiKey))
      .returning();

    if (updatedStats.length === 0) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'API key updated successfully',
      apiKey: updatedStats[0].apiKey,
      remainingCalls: updatedStats[0].remainingCalls,
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 