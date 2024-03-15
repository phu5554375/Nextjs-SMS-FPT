import defaultSettings from '@/../config/defaultSettings';
import { forgotPass } from '@/services/auth';
import { UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Typography, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import styles from './index.less';

export default function Page() {
  /** cấu hình language */
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: API_AUTH.ForgotPassParams) => {
    try {
      setIsLoading(true);
      const response: any = await forgotPass({ ...values });
      if (response.success) {
        message.success(response?.message);
        history.push('/forgot-password-link');
      }
      setIsLoading(false);
    } catch (error) {
      message.error('Forgot password error!');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles?.background}>
      <div className={styles.speech_bubble}>
        <div className="">
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
            subTitle={`${intl.formatMessage({ id: 'account.reset.pass' })}`}
            actions={''}
            onFinish={async value => {
              await handleSubmit(value as API_AUTH.ForgotPassParams);
            }}
            submitter={{
              searchConfig: {
                submitText: `${intl.formatMessage({
                  id: 'account.btn.confirm',
                })}`,
              },
              submitButtonProps: { style: { display: 'none' } },
            }}
          >
            <div className="mb-16">
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'request.reset.email',
                })}
              </Typography.Text>
            </div>
            <div className="mb-16">
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                width={400}
                placeholder={`${intl.formatMessage({
                  id: 'enter.regist.email',
                })}`}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.required.email',
                      defaultMessage: 'Địa chỉ email không được để trống',
                    })}`,
                  },
                  {
                    pattern:
                      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/,
                    message: `${intl.formatMessage({
                      id: 'account.required.email.format',
                      defaultMessage: 'Địa chỉ email không đúng định dạng',
                    })}`,
                  },
                ]}
              />
            </div>
            <div className="mb-16 t-al-center">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                {intl.formatMessage({ id: 'account.btn.confirm' })}
              </Button>
            </div>
          </LoginForm>
        </div>
      </div>
    </div>
  );
}
