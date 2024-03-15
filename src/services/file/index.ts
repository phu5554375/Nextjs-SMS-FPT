import { request } from '@umijs/max';

export async function importFile(params: any) {
  return request<any>('/v1/files/imports', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      ...params,
    },
  });
}

export async function fetchAllFileExport(
  params: any,
  filter?: { [key: string]: any },
) {
  return request<any>('/v1/files/exports', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}

export async function downloadExportFile(params: any) {
  return request<any>('/v1/files/exports/'.concat(`${params}`), {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function deleteExportFile(params: any) {
  return request<any>('/v1/files/exports/'.concat(`${params}`), {
    method: 'DELETE',
    params: {
      ...params,
    },
  });
}
