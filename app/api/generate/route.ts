import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeyStats } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { forwardGenerateRequest, validateGenerateRequest } from '@/utils/apiProxy';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, ...requestData } = body;

    // 验证API key是否存在
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // 验证请求参数
    const validation = validateGenerateRequest(requestData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 查询API key的统计信息
    const keyStats = await db.query.apiKeyStats.findFirst({
      where: eq(apiKeyStats.apiKey, apiKey),
    });

    // 如果API key不存在，直接报错
    if (!keyStats) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // 检查剩余次数
    if (keyStats.remainingCalls <= 0) {
      return NextResponse.json(
        { error: 'API key has no remaining calls' },
        { status: 403 }
      );
    }

    // 更新总调用次数
    await db.update(apiKeyStats)
      .set({
        totalCalls: sql`${apiKeyStats.totalCalls} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(apiKeyStats.apiKey, apiKey));

    // 转发请求到目标域名
    const targetDomain = process.env.TARGET_API_DOMAIN;
    if (!targetDomain) {
      throw new Error('TARGET_API_DOMAIN environment variable is not set');
    }

    const response = await forwardGenerateRequest(
      requestData,
      targetDomain,
      process.env.TARGET_API_KEY
    );

    if (response.error) {
      // 请求失败，不更新成功次数
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    // 请求成功，更新成功次数和剩余次数
    await db.update(apiKeyStats)
      .set({
        successfulCalls: sql`${apiKeyStats.successfulCalls} + 1`,
        remainingCalls: sql`${apiKeyStats.remainingCalls} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(apiKeyStats.apiKey, apiKey));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 