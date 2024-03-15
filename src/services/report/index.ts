import { request } from '@umijs/max';

export async function fetchAllBrandnameReport(
  params: API_BRANDNAME_REPORT.Params,
  filter?: { [key: string]: any },
) {
  return request<API_BRANDNAME_REPORT.ResponseReport>('/v1/reports', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}

export async function exportBrandnameReport(
  params: API_BRANDNAME_REPORT.Params,
  filter?: { [key: string]: any },
) {
  return request<API_BRANDNAME_REPORT.ResponseReport>('/v1/reports/export', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}
