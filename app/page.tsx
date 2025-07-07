import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Felix API Proxy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            带有API key使用统计功能的API代理服务，可以转发请求到指定的目标域名并跟踪API key的使用情况。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* API测试页面 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">API测试</h3>
            </div>
            <p className="text-gray-600 mb-4">
              测试API接口功能，包括创建API key、调用generate接口和查看统计信息。
            </p>
            <Link 
              href="/test"
              className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              开始测试
            </Link>
          </div>

          {/* 管理页面 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">管理面板</h3>
            </div>
            <p className="text-gray-600 mb-4">
              查看所有API key的使用统计，管理剩余次数和监控使用情况。
            </p>
            <Link 
              href="/admin"
              className="block w-full bg-green-500 text-white text-center py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              进入管理
            </Link>
          </div>

          {/* API文档 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">API文档</h3>
            </div>
            <p className="text-gray-600 mb-4">
              查看详细的API接口文档，了解如何使用各个接口。
            </p>
            <a 
              href="https://github.com/your-repo/felix#api接口"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-purple-500 text-white text-center py-2 px-4 rounded hover:bg-purple-600 transition-colors"
            >
              查看文档
            </a>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">功能特性</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold text-gray-900">API请求转发</h3>
                <p className="text-gray-600">将请求转发到配置的目标域名</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold text-gray-900">API Key管理</h3>
                <p className="text-gray-600">跟踪每个API key的使用统计</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold text-gray-900">使用限制</h3>
                <p className="text-gray-600">当API key剩余次数为0时拒绝请求</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold text-gray-900">统计记录</h3>
                <p className="text-gray-600">记录总调用次数、成功次数、剩余次数</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
