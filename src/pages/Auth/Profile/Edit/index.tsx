import { PageContainer } from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Tag,
  Upload,
  message,
} from 'antd';

import { updateProfile } from '@/services/auth';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
} from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { flushSync } from 'react-dom';
import PermissionInfo from '../PermissionInfo';

export default function Page() {
  const intl = useIntl();

  const [form] = Form.useForm();

  const { initialState, setInitialState } = useModel('@@initialState');

  const {
    id,
    username,
    full_name,
    brandnames,
    enabled,
    is_admin,
    email,
    phone_number,
  } = initialState?.currentUser || {};

  const handleUpdateProfile = async (values: API_AUTH.User) => {
    if (
      values.hasOwnProperty('old_password') &&
      values.hasOwnProperty('new_password') &&
      values.hasOwnProperty('confirm_new_password')
    ) {
      delete values.old_password;
      delete values.new_password;
      delete values.confirm_new_password;
    }

    const response = await updateProfile({ ...values });

    if (response.success) {
      flushSync(() => {
        setInitialState((prevState: any) => ({
          ...prevState,
          currentUser: response.data,
        }));
      });
      message.success('Thay đổi thông tin tài khoản thành công');
    }
    history.push('/profile/detail');
    return;
  };

  const onFinish = async (values: any) => {
    await handleUpdateProfile(values);
  };

  return (
    <PageContainer
      header={{
        style: {
          display: 'none',
        },
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={8} xs={24} xl={8}>
          <div style={{ padding: '0px' }}>
            <Card />

            <Card>
              <div className="t-al-center pv-20">
                <Avatar
                  size={{
                    xs: 100,
                    sm: 100,
                    md: 130,
                    lg: 130,
                    xl: 128,
                    xxl: 130,
                  }}
                  className="mb-20"
                  style={{ backgroundColor: '#E6F7FF', color: '#034EA2' }}
                >
                  <span className="fw-600" style={{ fontSize: '48px' }}>
                    NT
                  </span>
                </Avatar>
                <div className="d-none">
                  <Upload>
                    <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                  </Upload>
                </div>
              </div>
            </Card>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              form={form}
              onFinish={onFinish}
              initialValues={{
                id: id,
                full_name: full_name,
                username: username,
                phone_number: phone_number,
                email: email,
                old_password: '',
                new_password: '',
                confirm_new_password: '',
              }}
              className="form-update-profile"
              autoComplete="off"
            >
              <Card>
                <Form.Item
                  labelAlign="left"
                  name="full_name"
                  label={intl.formatMessage({
                    id: 'account.full_name',
                    defaultMessage: 'Tên hiển thị',
                  })}
                  rules={[{ required: true }]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  name="username"
                  label={intl.formatMessage({
                    id: 'account.username',
                    defaultMessage: 'Tên đăng nhập',
                  })}
                  rules={[{ required: true }]}
                >
                  <Input allowClear />
                </Form.Item>
              </Card>
              <Card>
                <Form.Item
                  labelAlign="left"
                  name="old_password"
                  label={intl.formatMessage({
                    id: 'account.old_password',
                    defaultMessage: 'Mật khẩu cũ',
                  })}
                >
                  <Input.Password
                    placeholder="Mật khẩu cũ"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  name="new_password"
                  label={intl.formatMessage({
                    id: 'account.new_password',
                    defaultMessage: 'Mật khẩu mới',
                  })}
                  rules={[
                    {
                      pattern: new RegExp(
                        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,30}$',
                      ),
                      message: intl.formatMessage({
                        id: 'account.required.password',
                      }),
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu mới"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  labelAlign="left"
                  name="confirm_new_password"
                  label={intl.formatMessage({
                    id: 'account.confirm_new_password',
                    defaultMessage: 'Mật khẩu mới',
                  })}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Mật khẩu mới mà bạn đã nhập không khớp'),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập lại MK mới"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    allowClear
                  />
                </Form.Item>
              </Card>
              <Card className="pb-50">
                <Form.Item
                  labelAlign="left"
                  name="phone_number"
                  label={intl.formatMessage({
                    id: 'account.phoneNumber',
                    defaultMessage: 'Số điện thoại',
                  })}
                  rules={[{ required: true }]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input allowClear />
                </Form.Item>

                <Form.Item
                  labelAlign="left"
                  name="account_type"
                  label={intl.formatMessage({
                    id: 'account.type',
                    defaultMessage: 'Loại tài khoản',
                  })}
                >
                  <Select
                    disabled
                    allowClear
                    defaultValue={is_admin}
                    style={{ width: '100%' }}
                    options={[
                      { value: 0, label: 'Sub Account' },
                      { value: 1, label: 'Main Account' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  labelAlign="left"
                  name="brandname"
                  label={intl.formatMessage({
                    id: 'account.status',
                    defaultMessage: 'Trạng thái',
                  })}
                >
                  <Switch
                    disabled
                    checked={enabled === 1 ? true : false}
                    className="mr-8"
                  />
                  <span>
                    {intl.formatMessage({
                      id: 'account.activate',
                      defaultMessage: 'Kích hoạt',
                    })}
                  </span>
                </Form.Item>
                <Form.Item labelAlign="left" name="brandname" label="Brandname">
                  {brandnames?.map((value, index) => (
                    <Tag key={index}>{value.name}</Tag>
                  ))}
                </Form.Item>

                <Row>
                  <Col span={24} className="t-al-right">
                    <Button type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                    <Button type="default" className="ml-8" htmlType="reset">
                      Làm lại
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Form>
          </div>
        </Col>
        <Col span={16} xs={24} xl={16}>
          <PermissionInfo />
        </Col>
      </Row>
    </PageContainer>
  );
}
