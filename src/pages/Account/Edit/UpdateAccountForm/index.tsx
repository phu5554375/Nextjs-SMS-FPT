/* eslint-disable array-callback-return */

import colors from '@/commons/colors';
import { updateAccountInfo } from '@/services/account';
import { fetchAllBrandname } from '@/services/brandname';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Typography,
  message,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useIntl, useParams } from 'umi';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

function UpdateProfileForm(props: any) {
  const { initialState } = useModel('@@initialState');
  const { id, full_name, email } = initialState?.currentUser || {};

  const permissions = initialState?.configs?.permissions;
  const isBrandname = initialState?.configs?.modules.Brandname;
  /** cấu hình language */
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [form] = Form.useForm();
  const [statusAcc, setStatusAcc] = useState(
    props && props?.currentAccount && props?.currentAccount?.enabled,
  );
  const [changeBrandname, setChangeBrandname] = useState(false);

  const [data, setData] = useState<any>();
  let current_permission: any =
    props && props?.currentAccount && props?.currentAccount?.permissions;

  const [checkedPermissons, setCheckedPermissons] =
    useState<any>(current_permission);

  useEffect(() => {
    const fetchAccount = async () => {
      let result = permissions;

      let new_items: any = [];
      for (let i = 0; i < result?.length; i++) {
        new_items[i] = {
          title: result[i].title,
          enabled: result[i].enabled,
          permissions: result[i]?.permissions,
          policys: [],
        };
        for (let j = 0; j < result[i]?.permissions?.length; j++) {
          for (let k = 0; k < current_permission?.length; k++) {
            if (result[i]?.permissions[j]?.name === current_permission[k]) {
              new_items[i].policys.push({
                item: current_permission[k],
              });
            }
          }
        }
      }
      setData(new_items.filter((itm: any) => itm.enabled === true));
    };
    fetchAccount().catch(console.error);
  }, []);

  const handleCheck = (event: CheckboxChangeEvent) => {
    let updatedList = [...checkedPermissons];
    if (event.target.checked) {
      updatedList = [...checkedPermissons, event.target.value];
    } else {
      updatedList.splice(checkedPermissons.indexOf(event.target.value), 1);
    }
    setCheckedPermissons(updatedList);
  };

  const handleResetFormSubmit = async () => {
    form.resetFields();
    setStatusAcc(
      props && props?.currentAccount && props?.currentAccount?.enabled,
    );
  };
  const handleUpdateAccount = async (values: API_ACCOUNT.CurrentAccount) => {
    let brandnames: any = [];
    if (isBrandname) {
      if (!changeBrandname) {
        const brandname: any = values && values.brandnames;
        let set = new Set(brandname.map((item: { value: any }) => item.value));
        brandnames = Array.from(set);
      } else {
        brandnames = values.brandnames;
      }
    }
    try {
      setIsLoading(true);
      const response = await updateAccountInfo({
        brandnames: brandnames,
        email: values && values?.email,
        enabled: statusAcc && parseInt(statusAcc),
        full_name: values && values?.full_name,
        id: params.id,
        is_admin: 0,
        permissions: checkedPermissons,
        phone_number: values && values.phone_number,
        username: props && props?.username && props?.currentAccount?.username,
        updated_by: {
          id: id,
          email: email,
          full_name: full_name,
        },
      });
      if (response.success === true) {
        flushSync(() => {
          props.setCurrentAccount((state: any) => ({
            ...state,
            currentAccount: response.data,
          }));
        });
        message.success(
          intl.formatMessage({ id: 'account.message.update.success' }),
        );
        await waitTime(1000);
        history.push({
          pathname: '/accounts/'.concat(`${params.id}`),
        });
      } else {
        return message.error(
          intl.formatMessage({ id: 'account.message.update.failed' }),
        );
      }
      setIsLoading(false);
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'account.message.update.failed' }),
      );
      setIsLoading(false);
      return false;
    }
  };

  const myFunction = () => {
    let str = form.getFieldValue('phone_number');
    let b = str.replaceAll(' ', '').trim();
    form.setFieldsValue({ phone_number: b });
  };

  return (
    <div>
      <Form
        form={form}
        initialValues={{
          id: props?.currentAccount && props?.currentAccount.id,
          username: props?.currentAccount && props?.currentAccount.username,
          full_name: props?.currentAccount && props?.currentAccount.full_name,
          phone_number:
            props?.currentAccount && props?.currentAccount.phone_number,
          email: props?.currentAccount && props?.currentAccount.email,
          is_admin:
            props?.currentAccount && props?.currentAccount.is_admin === 0
              ? `${intl.formatMessage({
                  id: 'account.type.sub',
                  defaultMessage: 'Sub account',
                })}`
              : `${intl.formatMessage({
                  id: 'account.type.main',
                  defaultMessage: 'Main account',
                })}`,
          enabled: statusAcc === 0 ? 0 : 1,
        }}
        onFinish={async value => {
          await handleUpdateAccount(value as API_ACCOUNT.CurrentAccount);
        }}
      >
        <Row gutter={24} className="ph-24">
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8} className="mb-16">
            <Col style={{ paddingLeft: 0 }}>
              <span>
                {intl.formatMessage({
                  id: 'account.display.name',
                  defaultMessage: 'Tên hiển thị',
                })}
              </span>
            </Col>
            <Form.Item>
              <ProFormText
                name="full_name"
                placeholder={intl.formatMessage({
                  id: 'account.display.name',
                  defaultMessage: 'Tên hiển thị',
                })}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.display.name.not.blank',
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
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8} className="mb-16">
            <Col style={{ paddingLeft: 0 }}>
              <span>
                {intl.formatMessage({
                  id: 'account.login',
                  defaultMessage: 'Tên đăng nhập',
                })}
              </span>
            </Col>
            <Form.Item>
              <ProFormText
                disabled
                name="username"
                placeholder={intl.formatMessage({
                  id: 'account.login',
                  defaultMessage: 'account.login',
                })}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.required.login',
                      defaultMessage: 'Tên đăng nhập không được để trống',
                    })}`,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8} className="mb-16">
            <Col style={{ paddingLeft: 0 }}>
              <span>
                {intl.formatMessage({
                  id: 'account.status',
                  defaultMessage: 'Trạng thái',
                })}
              </span>
            </Col>
            <Form.Item name="enabled">
              <Col>
                <Switch
                  defaultChecked={statusAcc === 1}
                  onChange={value => {
                    if (value === true) {
                      setStatusAcc(1);
                    } else setStatusAcc(0);
                  }}
                />
                <span className="pl-12">
                  {statusAcc === 0
                    ? `${intl.formatMessage({
                        id: 'account.inactive',
                        defaultMessage: 'Chưa kích hoạt',
                      })}`
                    : `${intl.formatMessage({
                        id: 'account.activate',
                        defaultMessage: 'Đã kích hoạt',
                      })}`}
                </span>
              </Col>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8} className="mb-16">
            <Col style={{ paddingLeft: 0 }}>
              <span>
                {intl.formatMessage({
                  id: 'account.phoneNumber',
                  defaultMessage: 'Số điện thoại',
                })}
              </span>
            </Col>
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
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8} className="mb-16">
            <Col style={{ paddingLeft: 0 }}>
              <span>Email</span>
            </Col>
            <Form.Item>
              <ProFormText
                name="email"
                // fieldProps={{
                //   prefix: <MailOutlined />,
                // }}
                placeholder={'Email'}
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
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8} className="mb-16">
            <Col style={{ paddingLeft: 0 }}>
              <span>
                {intl.formatMessage({
                  id: 'account.type',
                  defaultMessage: 'Loại tài khoản',
                })}
              </span>
            </Col>

            <Form.Item>
              <ProFormText
                name="is_admin"
                disabled
                placeholder={intl.formatMessage({
                  id: 'account.type',
                  defaultMessage: 'Loại tài khoản',
                })}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'account.required.type.not.blank',
                      defaultMessage: 'Loại tài khoản không được trống.',
                    })}`,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          {isBrandname === true ? (
            <Col xs={24} sm={12} md={12} lg={8} xl={8} className="mb-16">
              <Col style={{ paddingLeft: 0 }}>
                <span>Brandname</span>
              </Col>
              <Form.Item>
                <ProFormSelect
                  name="brandnames"
                  placeholder="Brand name"
                  fieldProps={{
                    mode: 'multiple',
                    onChange: value => {
                      setChangeBrandname(true);
                      console.log('onchang', value);
                    },
                  }}
                  rules={[
                    {
                      required: true,
                      type: 'array',
                    },
                  ]}
                  request={async () => {
                    const { data } = await fetchAllBrandname();
                    return data
                      ? data.map((item: { id: any; name: any }) => ({
                          value: `${item?.id}`,
                          label: item?.name,
                        }))
                      : [];
                  }}
                  initialValue={
                    props?.currentAccount &&
                    props?.currentAccount.brandnames &&
                    props?.currentAccount.brandnames?.map(
                      (item: { id: any; name: any }) => ({
                        value: `${item?.id}`,
                      }),
                    )
                  }
                />
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        <Divider />

        {/* quyen */}
        {props && props?.currentAccount && (
          <div className="pl-24 pr-24">
            <Typography.Text strong>
              {intl.formatMessage({
                id: 'account.decentralization',
                defaultMessage: 'Phân quyền',
              })}
            </Typography.Text>
            <Row className="pt-24 pb-0 pl-24 pr-24">
              {data &&
                data.map((e: any) => (
                  <>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8} className="">
                      {e?.title}
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={16} xl={16} className="">
                      {e &&
                        e?.permissions?.map((itm: any, index: any) => {
                          if (itm.enabled === true) {
                            return (
                              <>
                                <Form.Item name={`${itm.name}_checkbox`}>
                                  <Row
                                    gutter={16}
                                    className="mb-16"
                                    key={index}
                                  >
                                    <Col
                                      xs={2}
                                      sm={2}
                                      md={2}
                                      lg={1}
                                      xl={1}
                                      xxl={1}
                                      className="t-al-right pr-16"
                                    >
                                      {current_permission?.find(
                                        (e: any) => e === itm.name,
                                      ) ? (
                                        <Checkbox
                                          key={`${itm.name}_checked`}
                                          value={itm.name}
                                          defaultChecked={e}
                                          onChange={e => handleCheck(e)}
                                        />
                                      ) : (
                                        <Checkbox
                                          key={`${itm.name}`}
                                          value={itm.name}
                                          onChange={e => handleCheck(e)}
                                        />
                                      )}
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
        )}

        <Row>
          <Col span={8}></Col>
          <Col span={11} className="t-al-left pl-16">
            <Button
              disabled={isLoading}
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className="mr-8"
            >
              {intl.formatMessage({
                id: 'account.action.update',
                defaultMessage: 'Cập nhật',
              })}
            </Button>

            <Button type="default" onClick={() => handleResetFormSubmit()}>
              {intl.formatMessage({
                id: 'account.action.cancel',
                defaultMessage: 'Hủy',
              })}
            </Button>
          </Col>
        </Row>
        <br />
      </Form>
    </div>
  );
}

export default UpdateProfileForm;
