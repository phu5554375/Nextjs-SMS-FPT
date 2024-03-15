import { request } from '@umijs/max';

export async function login(
  body: API_AUTH.LoginParams,
  options?: { [key: string]: any },
) {
  return request<API_AUTH.LoginResult>('/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function currentUser(options?: { [key: string]: any }) {
  return request<{ data: API_AUTH.User }>('/v1/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/v1/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateProfile(
  body: API_AUTH.User,
  options?: { [key: string]: any },
) {
  return request<any>('/v1/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function changePassword(
  body: API_AUTH.ChangePassword,
  options?: { [key: string]: any },
) {
  return request<any>('/v1/profile/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function forgotPass(
  body: API_AUTH.ForgotPassParams,
  options?: { [key: string]: any },
) {
  return request<API_AUTH.LoginResult>('/v1/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function resetPassword(
  body: API_AUTH.ResetPassParams,
  urlParams?: any,
) {
  return request<any>('/v1/reset-password/'.concat(`${urlParams}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
