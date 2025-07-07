'use client';

import { useState } from 'react';

export default function TestPage() {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const testGenerateAPI = async () => {
    if (!apiKey || !prompt) {
      alert('Please enter both API key and prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          prompt,
          width: 512,
          height: 512,
          steps: 20,
          batch_size: 1,
          model: 'Flux-Dev',
        }),
      });

      const data = await response.json();
      setResult(data);
      
      // 如果API key无效，提示用户先创建
      if (response.status === 401) {
        alert('Invalid API key. Please create an API key first using the "Create API Key" button.');
      }
    } catch (error) {
      setResult({ error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  const getAPIKeyStats = async () => {
    if (!apiKey) {
      alert('Please enter API key');
      return;
    }

    try {
      const response = await fetch(`/api/apikey?apiKey=${encodeURIComponent(apiKey)}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setStats({ error: 'Failed to fetch stats' });
    }
  };

  const createAPIKey = async () => {
    if (!apiKey) {
      alert('Please enter API key');
      return;
    }

    try {
      const response = await fetch('/api/apikey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          initialRemainingCalls: 100,
        }),
      });

      const data = await response.json();
      alert(data.message || data.error);
      if (data.message) {
        getAPIKeyStats();
      }
    } catch (error) {
      alert('Failed to create API key');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API Key Management */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">API Key Management</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">API Key:</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your API key"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={createAPIKey}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create API Key
            </button>
            
            <button
              onClick={getAPIKeyStats}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Get Stats
            </button>
          </div>

          {stats && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">API Key Statistics:</h3>
              {stats.error ? (
                <p className="text-red-500">{stats.error}</p>
              ) : (
                <div className="space-y-1 text-sm">
                  <p><strong>Total Calls:</strong> {stats.totalCalls}</p>
                  <p><strong>Successful Calls:</strong> {stats.successfulCalls}</p>
                  <p><strong>Remaining Calls:</strong> {stats.remainingCalls}</p>
                  <p><strong>Created:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(stats.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Generate API Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Generate API Test</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Prompt:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded h-24"
              placeholder="Enter your prompt"
            />
          </div>

          <button
            onClick={testGenerateAPI}
            disabled={loading}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Test Generate API'}
          </button>

          {result && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 