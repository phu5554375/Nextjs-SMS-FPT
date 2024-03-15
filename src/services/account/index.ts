import { request } from '@umijs/max';

/** Fetch all accounts **/
export async function fetchAllAccounts(
  params: any,
  filter?: { [key: string]: any },
) {
  return request<API_ACCOUNT.AccountList>('/v1/accounts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(filter || {}),
  });
}

/** Get accounts by id **/
export async function currentAccount(params: { id?: number }) {
  return request<{ data: API_ACCOUNT.CurrentAccount }>(
    '/v1/accounts/'.concat(`${params.id}`),
    {
      method: 'GET',
    },
  );
}

/** Add account POST /v1/accounts */
export async function addAccount(
  body: API_ACCOUNT.CurrentAccount,
  options?: { [key: string]: any },
) {
  return request<any>('/v1/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Update account PUT /v1/accounts/:id */
export async function updateAccount(options?: { [key: string]: any }) {
  return request<API_ACCOUNT.CurrentAccount>(
    '/v1/accounts/'.concat(`${options?.id}`),
    {
      method: 'PUT',
      ...(options || {}),
    },
  );
}
export async function updateAccountInfo(
  body: API_ACCOUNT.CurrentAccount,
  options?: { [key: string]: any },
) {
  return request<any>('/v1/accounts/'.concat(`${body?.id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Remove account DELETE /v1/accounts/:id */
export async function removeAccount(params: { key?: number }) {
  return request<{ data: API_ACCOUNT.AccountList }>(
    '/v1/accounts/'.concat(`${params?.key}`),
    {
      method: 'DELETE',
    },
  );
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API_ACCOUNT.RuleList>('/v1/accounts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API_ACCOUNT.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API_ACCOUNT.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
