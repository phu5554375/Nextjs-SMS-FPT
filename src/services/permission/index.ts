import { request } from '@umijs/max';

export async function fetchAllPermission() {
  return request<any>('/v1/permissions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
