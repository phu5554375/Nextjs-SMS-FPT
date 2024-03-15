import defaultSettings from '@/../config/defaultSettings';
import { login } from '@/services/auth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history, setLocale, useModel } from '@umijs/max';
import { Button, Row, message } from 'antd';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import styles from './index.less';

export default function Page() {
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (initialState?.currentUser && localStorage.getItem('isLogged')) {
      history.push('/dashboard');
    }
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState(s => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const fetchConfigs = async () => {
    const configs = await initialState?.fetchConfig?.();
    if (configs) {
      flushSync(() => {
        setInitialState(s => ({
          ...s,
          configs: configs,
        }));
      });
    }
  };

  const handleSubmit = async (params: API_AUTH.LoginParams) => {
    localStorage.setItem('username', params.username);
    localStorage.setItem('password', params.password);
    const response = await login({ ...params });
    if (response?.data?.is_required_TFA === true) {
      history.push('/towfactor');
    } else {
      localStorage.setItem('token', response?.data?.access_token);
      localStorage.setItem('isLogged', 'true');
      if (localStorage.getItem('umi_locale') === null) {
        setLocale('vi-VN');
      } else {
        setLocale(`${localStorage.getItem('umi_locale')}`);
      }
      await fetchUserInfo();
      await fetchConfigs();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      message.success('Đăng nhập thành công!');
      localStorage.removeItem('password');
      localStorage.removeItem('username');
    }
  };

  return (
    <div className={styles?.background}>
      <div className={styles?.formlogin}>
        <LoginForm
          contentStyle={{
            minWidth: 400,
            maxWidth: '90vw',
          }}
          logo={
            <img
              alt="logo"
              src={defaultSettings.logo}
              className={styles?.logo}
            />
          }
          initialValues={{
            autoLogin: true,
          }}
          actions={''}
          onFinish={async value => {
            await handleSubmit(value as API_AUTH.LoginParams);
          }}
          submitter={{
            searchConfig: {
              submitText: 'Đăng nhập',
            },
          }}
        >
          <h5>Đăng nhập vào hệ thống SMS Partner</h5>
          <div className="mb-16">
            <h6>Login</h6>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              width={400}
              placeholder={'Tên tài khoản'}
              rules={[
                {
                  required: true,
                  message: 'Tên tài khoản không được để trống',
                },
              ]}
            />
          </div>
          <div className="mb-16">
            <ProFormText.Password
              className="mb-10"
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              width={400}
              placeholder={'Mật khẩu'}
              rules={[
                {
                  required: true,
                  message: 'Mật khẩu không được để trống',
                },
              ]}
            />
          </div>
          <Row className={styles?.paddingBottom}>
            <ProFormCheckbox noStyle name="rememberMe">
              <span> Ghi nhớ đăng nhập</span>
            </ProFormCheckbox>
            <Button
              type="link"
              onClick={() => history.push('/forgot-password')}
            >
              Quên mật khẩu?
            </Button>
          </Row>
        </LoginForm>
      </div>
    </div>
  );
}
