import { request } from '@umijs/max';

export async function fetchAllMessage(params: API_MTMESSAGE.Params) {
  return request<API_MTMESSAGE.ResponseMessage>('/v1/mt/messages', {
    method: 'GET',
    params: {
      limit: 20,
      ...params,
    },
  });
}

export async function exportMTMessage(
  params: API_MTMESSAGE.Params,
  filter?: { [key: string]: any },
) {
  return request<API_MTREPORT.ResponseReport>('/v1/mt/messages/export', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}
