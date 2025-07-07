interface GenerateRequestData {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  batch_size?: number;
  model?: string;
  image?: string;
  denoise?: number;
}

interface GenerateResponse {
  imageUrl?: string;
  error?: string;
}

export async function forwardGenerateRequest(
  requestData: GenerateRequestData,
  targetDomain: string,
  targetApiKey?: string
): Promise<GenerateResponse> {
  try {
    const targetUrl = `${targetDomain}/api/generate`;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(targetApiKey && {
          'Authorization': `Bearer ${targetApiKey}`,
        }),
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || `Target API request failed with status ${response.status}`,
      };
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error forwarding request:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to forward request',
    };
  }
}

export function validateGenerateRequest(data: any): { valid: boolean; error?: string } {
  const { width, height, steps } = data;

  if (width !== undefined && (width < 64 || width > 1920)) {
    return { valid: false, error: 'Invalid image dimensions' };
  }

  if (height !== undefined && (height < 64 || height > 1920)) {
    return { valid: false, error: 'Invalid image dimensions' };
  }

  if (steps !== undefined && (steps < 5 || steps > 60)) {
    return { valid: false, error: 'Invalid steps value' };
  }

  return { valid: true };
} 