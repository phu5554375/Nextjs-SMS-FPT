/* eslint-disable array-callback-return */
import colors from '@/commons/colors';
import { fetchAllBrandname } from '@/services/brandname';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import type { RadioChangeEvent } from 'antd';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Typography,
  message,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import { addAccount } from '../../../services/account';
import styles from './index.less';

function CreateSubAccountForm() {
  /** cấu hình language */
  const intl = useIntl();
  const [form] = Form.useForm();

  const { initialState } = useModel('@@initialState');
  const { id } = initialState?.currentUser || {};
  // const curentPermissions = initialState?.currentUser?.permissions;
  const permissions = initialState?.configs?.permissions;
  const isBrandname = initialState?.configs?.modules.Brandname;
  // const isMomt = initialState?.configs?.modules.MOMT;
  const [dataPermissions, setDataPermissions] = useState<any>();

  useEffect(() => {
    const fetchAccount = async () => {
      let arr: any = [];
      // if (isBrandname === true && isMomt !== true) {
      //   arr = permissions.filter((itm: any) => itm.title !== 'MO/MT');
      // } else if (isMomt === true && isBrandname !== true) {
      //   arr = permissions.filter((itm: any) => itm.title !== 'Brandname');
      // } else if (isBrandname === true && isMomt === true) {
      //   arr = permissions;
      // }
      arr = permissions.filter((itm: any) => itm.enabled === true);
      setDataPermissions(arr);
    };
    fetchAccount().catch(console.error);
  }, []);

  const [checkedPermissons, setCheckedPermissons] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleResetFields = () => {
    form.resetFields();
  };
  const handleCheck = (event: CheckboxChangeEvent) => {
    let updatedList = [...checkedPermissons];
    if (event.target.checked) {
      updatedList = [...checkedPermissons, event.target.value];
    } else {
      updatedList.splice(checkedPermissons.indexOf(event.target.value), 1);
    }
    setCheckedPermissons(updatedList);
  };

  const myFunction = () => {
    let str = form.getFieldValue('phone_number');
    let b = str.replaceAll(' ', '').trim();
    form.setFieldsValue({ phone_number: b });
  };

  const handleCreateSubAccount = async (values: API_ACCOUNT.CurrentAccount) => {
    try {
      setIsLoading(true);
      const response = await addAccount({
        ...values,
        is_admin: 0,
        enabled: parseInt(values.enabled),
        brandnames: values.brandnames ? values.brandnames : [],
        permissions: checkedPermissons,
        created_by: id,
      });

      if (response.success === true) {
        message.success(
          `${intl.formatMessage({
            id: 'account.message.success.create.subAccount',
            defaultMessage: 'Thêm tài khoản con thành công!',
          })}`,
        );
        history.push('/accounts/list');
      } else {
        message.error(
          `${intl.formatMessage({
            id: 'account.message.failed.create.subAccount',
            defaultMessage: 'Thêm tài khoản con không thành công!',
          })}`,
        );
      }
      setIsLoading(false);
    } catch (error) {
      message.error(
        `${intl.formatMessage({
          id: 'account.message.failed.create.subAccount',
          defaultMessage: 'Thêm tài khoản con không thành công!',
        })}`,
      );
      setIsLoading(false);
    }
  };

  const [valueStatus, setValueStatus] = useState(1);

  const onChangeStatus = (e: RadioChangeEvent) => {
    setValueStatus(e.target.value);
  };

  const [matchPassword, setMatchPassword] = useState(true);
  const handleChangePass = () => {
    if (
      form.getFieldValue('confirm_new_password') !== undefined ||
      form.getFieldValue('password') !== undefined
    ) {
      if (
        form.getFieldValue('password') !==
        form.getFieldValue('confirm_new_password')
      ) {
        return setMatchPassword(false);
      }
      if (
        form.getFieldValue('confirm_new_password') !==
        form.getFieldValue('password')
      ) {
        return setMatchPassword(false);
      }
    }
    if (
      form.getFieldValue('confirm_new_password') !== undefined ||
      form.getFieldValue('password') !== undefined
    ) {
      return setMatchPassword(true);
    }
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={async value => {
          await handleCreateSubAccount(value as API_ACCOUNT.CurrentAccount);
        }}
      >
        <div className="t-al-center">
          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>* </span>
              {intl.formatMessage({
                id: 'account.display.name',
                defaultMessage: 'Tên hiển thị',
              })}
            </Col>
            <Col span={11} className="t-al-left pl-16">
              <Form.Item
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.required.display.name',
                      defaultMessage: 'Tên hiển thị không được để trống',
                    })}`,
                  },
                  {
                    pattern: new RegExp('^.{3,50}$'),
                    message: `${intl.formatMessage({
                      id: 'account.required.name.maxLength',
                      defaultMessage: 'Tên hiển thị từ 3-50 kí tự',
                    })}`,
                  },
                ]}
              >
                <Input
                  maxLength={50}
                  placeholder={intl.formatMessage({
                    id: 'account.display.name',
                    defaultMessage: 'Tên hiển thị',
                  })}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>* </span>
              {intl.formatMessage({
                id: 'account.login',
                defaultMessage: 'Tên đăng nhập',
              })}
            </Col>
            <Col span={11} className="t-al-left pl-16">
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.required.login',
                      defaultMessage: 'Tên đăng nhập không được để trống',
                    })}`,
                  },
                  {
                    pattern: new RegExp('^[a-z0-9]{5,30}$'),
                    message: `${intl.formatMessage({
                      id: 'account.requrired.username',
                      defaultMessage:
                        'Tên đăng nhập phải là kí tự chữ thường hoặc số, không chứa kí tự đặc biệt, tiếng việt, khoảng trắng. Độ dài từ 5-30 ký tự',
                    })}`,
                  },
                ]}
              >
                <Input
                  maxLength={30}
                  placeholder={intl.formatMessage({
                    id: 'account.login',
                    defaultMessage: 'Tên đăng nhập',
                  })}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>* </span>
              {intl.formatMessage({
                id: 'account.password',
                defaultMessage: 'Mật khẩu',
              })}
            </Col>
            <Col span={11} className="t-al-left pl-16">
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
            </Col>
          </Row>

          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>*</span>{' '}
              {intl.formatMessage({
                id: 'account.re.enter.password',
                defaultMessage: 'Nhập lại mật khẩu',
              })}{' '}
            </Col>
            <Col span={11} className="t-al-left pl-16">
              <Form.Item
                name="confirm_new_password"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'input.password',
                      defaultMessage: 'input password',
                    })}`,
                  },
                  // ({ getFieldValue }) => ({
                  //   validator(_, value) {
                  //     if (!value || getFieldValue('password') === value) {
                  //       return Promise.resolve();
                  //     }
                  //     return Promise.reject(
                  //       new Error(
                  //         `${intl.formatMessage({
                  //           id: 'account.password.not.match',
                  //           defaultMessage:
                  //             'Mật khẩu mới mà bạn đã nhập không khớp.',
                  //         })}`,
                  //       ),
                  //     );
                  //   },
                  // }),
                ]}
              >
                <Input.Password
                  placeholder={intl.formatMessage({
                    id: 'input.password',
                    defaultMessage: 'input password',
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
              {!matchPassword && (
                <p style={{ color: colors.RED }}>
                  {intl.formatMessage({
                    id: 'account.password.not.match',
                    defaultMessage: 'Mật khẩu mới mà bạn đã nhập không khớp.',
                  })}
                </p>
              )}
            </Col>
          </Row>

          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>* </span> Email
            </Col>
            <Col span={11} className="t-al-left pl-16">
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.required.email',
                      defaultMessage: 'Địa chỉ email không được để trống',
                    })}`,
                  },
                  {
                    type: 'email',
                    message: `${intl.formatMessage({
                      id: 'account.required.email.format',
                      defaultMessage: 'Địa chỉ email không đúng định dạng',
                    })}`,
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'input.email' })}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>* </span>
              {intl.formatMessage({
                id: 'account.phone.otp',
                defaultMessage: 'Số điện thoại nhận OTP',
              })}
            </Col>
            <Col span={11} className="t-al-left pl-16">
              <Form.Item
                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.phone.not.blank',
                      defaultMessage: 'Số điện thoại không được để trống',
                    })}`,
                  },
                  {
                    min: 9,
                    message: `${intl.formatMessage({
                      id: 'account.required.phone.length',
                      defaultMessage:
                        'Số điện thoại phải có độ dài từ 9 đến 15 kí tự.',
                    })}`,
                  },
                  {
                    pattern: new RegExp(
                      '^(?:(?:\\(?(?:00|\\+)([1-4]\\d\\d|[1-9]\\d?)\\)?)?[\\-\\.\\ \\\\\\/]?)?((?:\\(?\\d{1,}\\)?[\\-\\.\\ \\\\\\/]?){0,})(?:[\\-\\.\\ \\\\\\/]?(?:#|ext\\.?|extension|x)[\\-\\.\\ \\\\\\/]?(\\d+))?$',
                    ),
                    message: `${intl.formatMessage({
                      id: 'account.required.phone',
                      defaultMessage:
                        'Vui lòng kiểm tra lại và nhập đúng số điện thoại.',
                    })}`,
                  },
                ]}
              >
                <Input
                  maxLength={15}
                  placeholder={intl.formatMessage({ id: 'input.phone' })}
                  allowClear
                  onBlur={() => myFunction()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-16">
            <Col span={8} className={styles.my_labelForm}>
              <span style={{ color: 'red' }}>* </span>
              {intl.formatMessage({
                id: 'account.status',
                defaultMessage: 'Trạng thái',
              })}
            </Col>
            <Col span={11} className="t-al-left pl-16">
              <Form.Item name="enabled" initialValue={valueStatus}>
                <Radio.Group
                  onChange={e => onChangeStatus(e)}
                  value={valueStatus}
                >
                  <Radio value={1}>
                    {' '}
                    {intl.formatMessage({ id: 'account.activate' })}{' '}
                  </Radio>
                  <Radio value={0}>
                    {' '}
                    {intl.formatMessage({ id: 'account.not.actived' })}{' '}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {isBrandname === true ? (
            <>
              <Row className="mb-16">
                <Col span={8} className={styles.my_labelForm}>
                  <span style={{ color: 'red' }}>* </span>Brandname
                </Col>
                <Col span={11} className="t-al-left pl-16">
                  <Form.Item>
                    <ProFormSelect
                      name="brandnames"
                      placeholder="Brandname"
                      fieldProps={{
                        mode: 'multiple',
                      }}
                      rules={[
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'brandname.required',
                          })}`,
                        },
                      ]}
                      request={async () => {
                        const { data } = await fetchAllBrandname();
                        return data
                          ? data.map((item: { id: any; name: any }) => ({
                              value: item?.id,
                              label: item?.name,
                            }))
                          : [];
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : null}
        </div>

        <Divider />

        <div>
          <Typography.Text strong>
            {intl.formatMessage({
              id: 'account.decentralization',
              defaultMessage: 'Phân quyền',
            })}
          </Typography.Text>
          <Row className="pt-24 pb-0 pl-24 pr-24">
            {dataPermissions &&
              dataPermissions?.length > 0 &&
              dataPermissions.map((e: any) => (
                <>
                  <Col xs={24} sm={12} md={12} lg={7} xl={7} className="">
                    {e?.title}
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={16} xl={16} className="">
                    {e &&
                      e?.permissions?.map((itm: any, index: any) => {
                        if (itm.enabled === true) {
                          return (
                            <>
                              <Form.Item
                                name={`${itm.name}_checkbox`}
                                style={{ marginLeft: '30px' }}
                              >
                                <Row gutter={16} className="mb-16" key={index}>
                                  <Col
                                    xs={2}
                                    sm={2}
                                    md={2}
                                    lg={1}
                                    xl={1}
                                    xxl={1}
                                    className="t-al-right pr-16"
                                  >
                                    <Checkbox
                                      value={itm.name}
                                      onChange={e => handleCheck(e)}
                                    ></Checkbox>
                                  </Col>
                                  <Col
                                    xs={22}
                                    sm={22}
                                    md={22}
                                    lg={22}
                                    xl={22}
                                    xxl={22}
                                  >
                                    <Row gutter={16} className="">
                                      <Col span={24} className="pb-8">
                                        {itm?.title
                                          ? itm.title
                                          : itm?.description}
                                      </Col>
                                      <Col
                                        span={24}
                                        style={{ color: colors.GRAY }}
                                      >
                                        {itm?.description}
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Form.Item>
                            </>
                          );
                        }
                      })}
                  </Col>
                  <Divider style={{ marginTop: 0 }} />
                </>
              ))}
          </Row>
        </div>

        <Row>
          <Col span={8}></Col>
          <Col span={11} className="t-al-left pl-16">
            <Button
              disabled={isLoading}
              loading={isLoading}
              className="mr-8"
              type="primary"
              key="submit"
              htmlType="submit"
            >
              <FormattedMessage
                id="account.action.save"
                defaultMessage="Lưu tài khoản"
              />
            </Button>
            <Button
              type="default"
              key="rest"
              onClick={() => handleResetFields()}
            >
              <FormattedMessage
                id="account.action.cancel"
                defaultMessage="Hủy"
              />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default CreateSubAccountForm;
