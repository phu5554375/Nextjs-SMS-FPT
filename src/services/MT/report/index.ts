import { request } from '@umijs/max';

export async function fetchAllMTReport(
  params: API_MTREPORT.Params,
  filter?: { [key: string]: any },
) {
  return request<API_MTREPORT.ResponseReport>('/v1/mt/reports', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}

export async function exportMTReport(
  params: API_MTREPORT.Params,
  filter?: { [key: string]: any },
) {
  return request<API_MTREPORT.ResponseReport>('/v1/mt/reports/export', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}
