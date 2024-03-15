import defaultSettings from '@/../config/defaultSettings';
import colors from '@/commons/colors';
import { resetPassword } from '@/services/auth';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from '@ant-design/icons';
import { history, useIntl } from '@umijs/max';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';
import styles from './index.less';

export default function Page() {
  /** cấu hình language */
  const intl = useIntl();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  let urlParams = new URL(window.location.href)?.search;

  const handleSubmit = async (values: any) => {
    const param = {
      password: values?.password,
      password_confirmation: values?.password,
    };
    try {
      setIsLoading(true);
      const response: any = await resetPassword(param, urlParams);
      if (response.success) {
        message.success(response?.message);
        history.push('/login');
      }
      setIsLoading(false);
    } catch (error) {
      message.error('Forgot password error!');
      setIsLoading(false);
    }
  };

  const [matchPassword, setMatchPassword] = useState(true);
  const handleChangePass = () => {
    if (
      form.getFieldValue('password_confirmation') !== undefined ||
      form.getFieldValue('password') !== undefined
    ) {
      if (
        form.getFieldValue('password') !==
        form.getFieldValue('password_confirmation')
      ) {
        return setMatchPassword(false);
      }
      if (
        form.getFieldValue('password_confirmation') !==
        form.getFieldValue('password')
      ) {
        return setMatchPassword(false);
      }
    }
    if (
      form.getFieldValue('password_confirmation') !== undefined ||
      form.getFieldValue('password') !== undefined
    ) {
      return setMatchPassword(true);
    }
  };

  return (
    <div className={styles?.background}>
      <div className={styles.speech_bubble}>
        <div className={styles.form_login_container}>
          <Form
            form={form}
            style={{
              minWidth: 400,
              maxWidth: '90vw',
            }}
            onFinish={async value => {
              await handleSubmit(value as API_AUTH.ResetPassParams);
            }}
          >
            <div>
              <img
                alt="logo"
                className={styles.logo}
                src={defaultSettings.logo}
              ></img>
            </div>
            <div className={styles.form_login_desc}>
              <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.45' }}>
                {intl.formatMessage({
                  id: 'account.reset.pass',
                })}
              </Typography.Text>
            </div>

            <div className="mb-24">
              <Row justify="space-between">
                <Col span={12}>
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'create.new.pass',
                    })}
                  </Typography.Text>
                </Col>

                <Col span={12} className="t-al-right">
                  <Tooltip
                    color={'#fff'}
                    placement="top"
                    overlayStyle={{ minWidth: '400px' }}
                    title={
                      <div className="pa-10">
                        <p>
                          {intl.formatMessage({
                            id: 'tooltip.help.reset.pass.1',
                          })}
                        </p>
                        <p>
                          {intl.formatMessage({
                            id: 'tooltip.help.reset.pass.2',
                          })}
                        </p>
                        <p>
                          <span>
                            {intl.formatMessage({
                              id: 'tooltip.help.reset.pass.3',
                            })}
                          </span>
                          <br></br>
                          <span style={{ padding: '0 0 0 16px' }}>
                            {intl.formatMessage({
                              id: 'tooltip.help.reset.pass.4',
                            })}
                          </span>
                          <br></br>
                          <span style={{ padding: '0 0 0 16px' }}>
                            {intl.formatMessage({
                              id: 'tooltip.help.reset.pass.5',
                            })}
                          </span>
                          <br></br>
                          <span style={{ padding: '0 0 0 16px' }}>
                            {intl.formatMessage({
                              id: 'tooltip.help.reset.pass.6',
                            })}
                          </span>
                          <br></br>
                          <span style={{ padding: '0 0 0 16px' }}>
                            {intl.formatMessage({
                              id: 'tooltip.help.reset.pass.7',
                            })}
                          </span>
                          {'` ~ ! @ # $ % ^ & * ( ) _ + - = { } | \\ " ; '}
                          &#160; &#39; &#160;
                          {'<> ? , . /)'}
                        </p>
                        <p>
                          {intl.formatMessage({
                            id: 'tooltip.help.reset.pass.8',
                          })}
                        </p>
                        <p>
                          {intl.formatMessage({
                            id: 'tooltip.help.reset.pass.9',
                          })}
                        </p>
                      </div>
                    }
                  >
                    <Typography.Text strong style={{ color: colors.BLUE }}>
                      {intl.formatMessage({ id: 'need.help' })}
                    </Typography.Text>
                  </Tooltip>
                </Col>
              </Row>
            </div>
            <div className="mb-24">
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'input.password',
                      defaultMessage: 'input password',
                    })}`,
                  },
                  {
                    pattern: new RegExp(
                      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,30}$',
                    ),
                    message:
                      'Mật khẩu phải chứa ít nhất một chữ thường, chữ hoa, số và ký tự đặc biệt.Độ dài 6-30 kí tự',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#4692E3' }} />}
                  maxLength={30}
                  placeholder={intl.formatMessage({
                    id: 'input.password',
                    defaultMessage: 'input password',
                  })}
                  allowClear
                  iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={() => handleChangePass()}
                />
              </Form.Item>
            </div>

            <div className="mb-24">
              <Form.Item
                name="password_confirmation"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'input.password',
                      defaultMessage: 'input password',
                    })}`,
                  },
                  {
                    pattern: new RegExp(
                      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,30}$',
                    ),
                    message:
                      'Mật khẩu phải chứa ít nhất một chữ thường, chữ hoa, số và ký tự đặc biệt.Độ dài 6-30 kí tự',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#4692E3' }} />}
                  maxLength={30}
                  placeholder={intl.formatMessage({
                    id: 'reenter.new.pass',
                  })}
                  allowClear
                  iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={() => handleChangePass()}
                  className={
                    !matchPassword ? 'ant-input-affix-wrapper-status-error' : ''
                  }
                />
              </Form.Item>
            </div>

            <div className="mb-24">
              {!matchPassword && (
                <p style={{ color: colors.RED }}>
                  {intl.formatMessage({
                    id: 'account.password.not.match',
                    defaultMessage: 'Mật khẩu mới mà bạn đã nhập không khớp.',
                  })}
                </p>
              )}
            </div>
            <div className="mb-24 t-al-center">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                {intl.formatMessage({ id: 'sign.new.pass' })}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
