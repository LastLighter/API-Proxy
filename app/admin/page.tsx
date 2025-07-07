'use client';

import { useState, useEffect } from 'react';

interface APIKeyStats {
  id: number;
  apiKey: string;
  totalCalls: number;
  successfulCalls: number;
  remainingCalls: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [apiKeys, setApiKeys] = useState<APIKeyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAPIKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/apikey?all=true');
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      const data = await response.json();
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateRemainingCalls = async (apiKey: string, remainingCalls: number) => {
    try {
      const response = await fetch('/api/apikey', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, remainingCalls }),
      });

      if (!response.ok) {
        throw new Error('Failed to update API key');
      }

      // 刷新数据
      fetchAllAPIKeys();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  useEffect(() => {
    fetchAllAPIKeys();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">API Key Management</h1>
        <button
          onClick={fetchAllAPIKeys}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                API Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Calls
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Successful Calls
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining Calls
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {key.apiKey.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {key.totalCalls}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {key.successfulCalls}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`font-semibold ${key.remainingCalls <= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {key.remainingCalls}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {key.totalCalls > 0 
                    ? `${((key.successfulCalls / key.totalCalls) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(key.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      const newCalls = prompt('Enter new remaining calls:', key.remainingCalls.toString());
                      if (newCalls !== null) {
                        const calls = parseInt(newCalls);
                        if (!isNaN(calls) && calls >= 0) {
                          updateRemainingCalls(key.apiKey, calls);
                        }
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {apiKeys.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No API keys found
        </div>
      )}
    </div>
  );
} 