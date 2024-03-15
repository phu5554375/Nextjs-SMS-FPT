import { history, type RequestConfig } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep } from 'lodash';
import { jwt } from './utils/jwt';

const authHeaderInterceptor = (config: RequestConfig) => {
  const url = config?.url;

  const clCommon: any = cloneDeep(config)?.headers?.common;

  const token = jwt.get();

  if (!token) {
    history.push('/login');
    return;
  }

  if (config && config.headers) {
    config.headers.common = {
      ...clCommon,
      ...{ Authorization: `Bearer ${token || ''}` },
    };
  }

  return {
    ...config,
    url,
  };
};

export const requestConfig: RequestConfig = {
  // timeout: 8000,
  // other axios options you want
  errorConfig: {
    errorHandler(error: any, options: any) {
      const { response } = error;
      if (options?.skipErrorHandler) throw error;

      if (response.status === 401) {
        if (localStorage.getItem('isLogged') && jwt.get()) {
          jwt.remove();
          localStorage.removeItem('isLogged');
          notification.error({
            message: 'Phiên làm việc đã hết hạn',
            description: 'Phiên làm việc đã kết thúc, vui lòng đăng nhập lại',
          });
        } else {
          notification.error({
            message: 'Đăng nhập thất bại',
            description:
              'Tên tài khoản hoặc mật khẩu không chính xác, vui lòng đăng nhập lại',
          });
        }
        history.push('/login');
        return response;
      }

      if (response && response.status === 404) {
        return history.push('/404');
      }
      if (response && response.status) {
        notification.error({
          message: `${response.statusText}`,
          description: response.data.message || response.data,
        });
      } else {
        notification.error({
          message: 'Network Error',
          description:
            'Failed to send request. Please check your network connection.',
        });
      }
      return response;
    },
    errorThrower() {},
  },
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [],
};
