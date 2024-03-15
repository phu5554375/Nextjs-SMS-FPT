/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Col, Form, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function ({ onParamChange, listCampaignStatus }: any) {
  const intl = useIntl();

  const [form] = Form.useForm();

  const [param, setParam] = useState<any>({});

  const dataCampaignStatus: [] =
    listCampaignStatus &&
    listCampaignStatus.map((item: any) => ({
      label: `${intl.formatMessage({
        id: 'campaign.status.'.concat(`${item.label}`),
      })}`,
      value: item.value,
    }));

  useEffect(() => {
    form.submit();
  }, []);

  const handleFormSubmit = async (values: any) => {
    const newParam = {
      title: values.title,
      from:
        values &&
        values.dateRange &&
        moment(values.dateRange[0].$d).format('YYYY-MM-DD'),
      to:
        values &&
        values.dateRange &&
        moment(values.dateRange[1].$d).format('YYYY-MM-DD'),
      status: values.status,
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
      className="bg-white pa-24 ma-24"
    >
      <div className="pt-8">
        <Row justify="space-between" gutter={16}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className="w-100-p mb-0"
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'campaign.name',
                defaultMessage: 'Tên chiến dịch',
              })}:`}
            >
              <ProFormText
                name="title"
                placeholder={`${intl.formatMessage({
                  id: 'campaign.enter.name',
                  defaultMessage: 'Nhập tên chiến dịch',
                })}`}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className="w-100-p mb-0"
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'campaign.sending.time',
                defaultMessage: 'Thời gian gửi',
              })}`}
            >
              <ProFormDateRangePicker
                name="dateRange"
                fieldProps={{
                  placeholder: [
                    `${intl.formatMessage({ id: 'campaign.from.date' })}`,
                    `${intl.formatMessage({ id: 'campaign.to.date' })}`,
                  ],
                  format: value => value.format('YYYY-MM-DD'),
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className="w-100-p mb-0"
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'account.status',
                defaultMessage: 'Trạng thái',
              })}:`}
            >
              <ProFormSelect
                name="status"
                placeholder={`${intl.formatMessage({
                  id: 'account.status',
                  defaultMessage: 'Trạng thái',
                })}`}
                showSearch
                options={dataCampaignStatus ? dataCampaignStatus : []}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Row justify="end" className="t-al-right">
              <Col span={24}>
                <div className="mb-8">
                  <Button type="primary" htmlType="submit">
                    {intl.formatMessage({
                      id: 'account.btn.filter',
                      defaultMessage: 'Tìm kiếm',
                    })}
                  </Button>
                  <Button
                    type="default"
                    style={{ marginLeft: '8px' }}
                    onClick={() => handleResetFormSubmit()}
                  >
                    {intl.formatMessage({
                      id: 'account.btn.reset',
                      defaultMessage: 'Làm lại',
                    })}
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Form>
  );
}
