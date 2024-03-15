import { request } from '@umijs/max';

/** Fetch all campaign **/
export async function fetchAllCampaign(
  params: any,
  filter?: { [key: string]: any },
) {
  return request<any>('/v1/campaigns', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}

/** Cancel a campaign **/
export async function cancelCampaignById(params: { key?: number }) {
  return request<any>(
    '/v1/campaigns/'.concat(`${params?.key}`).concat('/cancel'),
    {
      method: 'POST',
    },
  );
}

/** Approve a campaign **/
export async function approveCampaignById(body: any, id: any) {
  return request<any>('/v1/campaigns/'.concat(`${id}`).concat('/approve'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** Delete a campaign **/
export async function removeCampaignById(params: { key?: number }) {
  return request<any>('/v1/campaigns/'.concat(`${params?.key}`), {
    method: 'DELETE',
  });
}

/** Get campaign by id **/
export async function getCampaignById(params: { id?: number }) {
  return request<any>(
    '/v1/campaigns/'.concat(`${params.id}`),
    {
      method: 'GET',
    },
  );
}

/** Get campaign message by id **/
export async function getCampaignMessagesById(params: any) {
  return request<any>(
    '/v1/campaigns/'.concat(`${params?.id?.id}`).concat('/messages'),
    {
      method: 'GET',
      params: {
        pageSize: params.pageSize,
        current: params.current,
      },
    },
  );
}

/** Get campaign invalid message by id **/
export async function getCampaignInvalidMessagesById(params: any) {
  return request<any>(
    '/v1/campaigns/'.concat(`${params?.id?.id}`).concat('/invalid-messages'),
    {
      method: 'GET',
      params: {
        pageSize: params.pageSize,
        current: params.current,
      },
    },
  );
}

/** Create campaign POST /v1/campaign */
export async function createCampaign(
  body: API_CAMPAIGN.Campaign,
  options?: { [key: string]: any },
) {
  return request<any>('/v1/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Add campaign POST /v1/campaigns */
export async function addCampaign(
  body: API_CAMPAIGN.CurrentCampaign,
  options?: { [key: string]: any },
) {
  return request<any>('/v1/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Update campaign POST /v1/campaigns */
export async function updateCampaign(body: any, id: any) {
  return request<any>('/v1/campaigns/'.concat(`${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** importFile POST /v1/files/imports */
export async function importFile(file: any) {
  return request<any>('/v1/files/imports', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      file,
    },
  });
}
