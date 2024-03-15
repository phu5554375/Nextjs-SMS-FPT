import { request } from '@umijs/max';

export async function fetchAllBrandname() {
  return request<any>('/v1/brandnames', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
