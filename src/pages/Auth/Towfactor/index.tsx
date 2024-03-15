import defaultSettings from '@/../config/defaultSettings';
import { login } from '@/services/auth';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, setLocale, useModel } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import styles from './index.less';

export default function Page() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (values: API_AUTH.LoginParams) => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (values?.code && values?.code.length > 1) {
      const response = await login({
        ...values,
        password: password,
        username: username,
      });

      if (response.success) {
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
        // history.push(localStorage.getItem('href_before') || '/');
        message.success('Đăng nhập thành công!');
        localStorage.removeItem('password');
        localStorage.removeItem('username');
      }
    } else if (values === undefined) {
      setIsLoading(true);
      const response = await login({
        password: password,
        username: username,
      });
      if (response.success) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles?.background}>
      <div className={styles?.formlogin}>
        <LoginForm
          loading={isLoading}
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
              submitText: 'Xác nhận',
            },
          }}
        >
          <h5>Mã xác thực đã được gửi tới email của bạn</h5>
          <div className="mb-16">
            <h6>Login</h6>
            <ProFormText
              name="code"
              width={400}
              placeholder={'OTP Number'}
              rules={[
                {
                  required: true,
                  message: 'OTP không được để trống',
                },
              ]}
            />
          </div>
          <h4>
            Bạn chưa nhận được mã? <a onClick={() => handleSubmit()}>Gửi lại</a>
          </h4>
        </LoginForm>
      </div>
    </div>
  );
}
