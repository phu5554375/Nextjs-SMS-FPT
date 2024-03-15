import { request } from '@umijs/max';

export async function fetchAllBusinessNumber() {
  return request<API_SUBSCRIPTION.ResponseSubscription>(
    '/v1/mo/subscriptions',
    {
      method: 'GET',
      params: {
        group_by: 'business_number_format',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export async function fetchAllSyntax() {
  return request<API_SUBSCRIPTION.ResponseSubscription>(
    '/v1/mo/subscriptions',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
