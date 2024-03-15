import { request } from '@umijs/max';

export async function fetchAllConfig(options?: { [key: string]: any }) {
  return request<API_CONFIG.ResponseConfig>('/v1/configs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
