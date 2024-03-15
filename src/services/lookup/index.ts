import { request } from '@umijs/max';

export async function fetchLookUp(
  params: API_LOOKUP.Params,   
  filter?: { [key: string]: any },
  ) {
  return request<API_LOOKUP.ResponseMessage>('/v1/messages', {
    method: 'GET',
    params: {
      limit: params.limit && params.limit ? params.limit : 10,
      // cursor: params.cursor,
      ...params,
    },
    ...(filter || {}),
  });
}
export async function exportLOOKUP(
  params: API_LOOKUP.Params,
  filter?: { [key: string]: any },
) {
  return request<API_LOOKUP.ResponseMessage>('/v1/messages/export', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}
