# Felix - API Proxy with Usage Tracking

这是一个带有API key使用统计功能的API代理服务，可以转发请求到指定的目标域名并跟踪API key的使用情况。

## 功能特性

- **API请求转发**: 将请求转发到配置的目标域名
- **API Key管理**: 跟踪每个API key的使用统计
- **使用限制**: 当API key剩余次数为0时拒绝请求
- **统计记录**: 记录总调用次数、成功次数、剩余次数
- **管理接口**: 提供API key的创建、查询和更新功能

## 技术栈

- **Next.js 15**: React框架
- **Drizzle ORM**: 数据库ORM
- **PostgreSQL**: 数据库
- **TypeScript**: 类型安全

## 安装和设置

1. 安装依赖：
```bash
npm install
```

2. 创建环境变量文件 `.env.local`：
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/felix_db"

# Target API domain for forwarding requests
TARGET_API_DOMAIN="https://api.example.com"

# API key for the target service (if needed)
TARGET_API_KEY="your_target_api_key"
```

3. 生成数据库迁移：
```bash
npm run db:generate
```

4. 运行数据库迁移：
```bash
npm run db:migrate
```

5. 启动开发服务器：
```bash
npm run dev
```

## API接口

### 1. Generate API (`POST /api/generate`)

转发请求到目标域名的generate接口。

**请求参数:**
```json
{
  "apiKey": "your_api_key",
  "prompt": "your prompt",
  "width": 512,
  "height": 512,
  "steps": 20,
  "batch_size": 1,
  "model": "default"
}
```

**响应:**
- 成功: 返回目标API的响应数据
- 失败: 返回错误信息

### 2. API Key管理 (`/api/apikey`)

#### GET - 获取API key统计信息
```
GET /api/apikey?apiKey=your_api_key
```

#### POST - 创建新的API key
```json
POST /api/apikey
{
  "apiKey": "new_api_key",
  "initialRemainingCalls": 100
}
```

#### PUT - 更新API key剩余次数
```json
PUT /api/apikey
{
  "apiKey": "your_api_key",
  "remainingCalls": 50
}
```

## 数据库结构

### api_key_stats 表
- `id`: 主键
- `apiKey`: API key (唯一)
- `totalCalls`: 总调用次数
- `successfulCalls`: 成功调用次数
- `remainingCalls`: 剩余调用次数
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### site_stats 表
- `id`: 主键
- `totalGenerations`: 总生成次数
- `dailyGenerations`: 每日生成次数
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

## 使用流程

1. **创建API Key**: 使用 `/api/apikey` POST接口创建新的API key（必需）
2. **调用Generate API**: 使用有效的API key调用 `/api/generate` 接口
3. **查看统计**: 使用 `/api/apikey` GET接口查看使用统计
4. **管理配额**: 使用 `/api/apikey` PUT接口更新剩余次数

**注意**: API key必须先通过管理接口创建，无效的API key会导致401错误。

## 测试页面

访问 `http://localhost:3000/test` 可以使用Web界面测试所有功能。

## 开发命令

- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run start`: 启动生产服务器
- `npm run db:generate`: 生成数据库迁移
- `npm run db:migrate`: 运行数据库迁移
- `npm run db:studio`: 启动Drizzle Studio

## 注意事项

1. 确保PostgreSQL数据库已正确配置
2. 设置正确的目标域名环境变量
3. **API key必须先通过管理接口创建，不会自动创建**
4. 当剩余次数为0时，请求会被拒绝
5. 只有成功的请求才会减少剩余次数
6. 无效的API key会返回401错误

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
