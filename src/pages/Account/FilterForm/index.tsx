import { SearchOutlined } from '@ant-design/icons';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Col, Form, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function ({ onParamChange }: any) {
  const intl = useIntl();

  const [form] = Form.useForm();

  const [param, setParam] = useState<any>({});

  useEffect(() => {
    form.submit();
  }, []);

  const handleFormSubmit = async (values: any) => {
    const newParam = {
      q: values.q,
      from:
        values &&
        values.dateRange &&
        moment(values.dateRange[0].$d).format('YYYY-MM-DD'),
      to:
        values &&
        values.dateRange &&
        moment(values.dateRange[1].$d).format('YYYY-MM-DD'),
      is_admin: values.is_admin,
      enabled: values.enabled,
    };

    if (JSON.stringify(newParam) !== JSON.stringify(param)) {
      setParam(newParam);
      onParamChange(newParam);
    }
  };

  const handleResetFormSubmit = async () => {
    const newParam = form.resetFields();
    if (JSON.stringify(newParam) !== JSON.stringify(param)) {
      setParam(newParam);
      onParamChange(newParam);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
      autoComplete="off"
      labelCol={{ span: 6 }}
      labelWrap
      labelAlign="right"
      wrapperCol={{ span: 24 }}
      className="bg-white pa-24 ma-24"
    >
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={4}>
          <Form.Item>
            <ProFormText
              name="q"
              placeholder={`${intl.formatMessage({
                id: 'account.filter.enter.keywords',
                defaultMessage: 'Nhập từ khóa...',
              })}`}
              fieldProps={{
                prefix: <SearchOutlined />,
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
          <Form.Item
            label={`${intl.formatMessage({
              id: 'account.type',
              defaultMessage: 'Loại tài khoản',
            })}:`}
          >
            <ProFormSelect
              name="is_admin"
              placeholder={`${intl.formatMessage({
                id: 'account.type',
                defaultMessage: 'Loại tài khoản',
              })}`}
              valueEnum={{
                0: {
                  text: (
                    <FormattedMessage
                      id="account.type.sub"
                      defaultMessage="sub account"
                    />
                  ),
                  status: '0',
                },
                1: {
                  text: (
                    <FormattedMessage
                      id="account.type.main"
                      defaultMessage="main account"
                    />
                  ),
                  status: '1',
                },
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
          <Form.Item
            label={`${intl.formatMessage({
              id: 'account.status',
              defaultMessage: 'Trạng thái',
            })}:`}
          >
            <ProFormSelect
              name="enabled"
              placeholder={`${intl.formatMessage({
                id: 'account.status',
                defaultMessage: 'Trạng thái',
              })}`}
              showSearch
              valueEnum={{
                0: {
                  text: (
                    <FormattedMessage
                      id="account.status.inactive"
                      defaultMessage="Chưa kích hoạt"
                    />
                  ),
                  status: '0',
                },
                1: {
                  text: (
                    <FormattedMessage
                      id="account.status.active"
                      defaultMessage="Đã kích hoạt"
                    />
                  ),
                  status: '1',
                },
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Form.Item
            label={`${intl.formatMessage({
              id: 'account.createdAt',
              defaultMessage: 'Ngày tạo',
            })}`}
          >
            <ProFormDateRangePicker
              name="dateRange"
              fieldProps={{
                placeholder: [
                  `${intl.formatMessage({ id: 'account.from.date' })}`,
                  `${intl.formatMessage({ id: 'account.to.date' })}`,
                ],
                format: value => value.format('YYYY-MM-DD'),
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[10, 10]} style={{ marginTop: '10px', textAlign: 'right' }}>
        <Col span={24}>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage({
              id: 'account.btn.filter',
              defaultMessage: 'Tìm kiếm',
            })}
          </Button>
          <Button
            type="default"
            style={{ marginLeft: '10px' }}
            onClick={() => handleResetFormSubmit()}
          >
            {intl.formatMessage({
              id: 'account.btn.reset',
              defaultMessage: 'Làm lại',
            })}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
