import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Button, Col, Form, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function ({ onParamChange }: any) {
  const intl = useIntl();
  //init state
  const { initialState } = useModel('@@initialState');
  //list campaign status
  const listExportStatus = initialState?.configs?.export_statuses;

  const [form] = Form.useForm();

  const [param, setParam] = useState<any>({});

  const dataCampaignStatus: [] =
    listExportStatus &&
    listExportStatus.map((item: any) => ({
      label: `${intl.formatMessage({
        id: 'export_status.'.concat(`${item.value}`),
      })}`,
      value: item.value,
    }));

  const dataServices = [
    { label: 'Brandname', value: 'Brandname' },

    { label: 'MO-MT', value: 'MO-MT' },
  ];

  useEffect(() => {
    form.submit();
  }, []);

  const handleFormSubmit = async (values: any) => {
    const newParam = {
      name: values.name,
      module: values.module,
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
        <Row justify="space-between" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className="w-100-p mb-0"
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'account.name',
                defaultMessage: 'Tên',
              })}:`}
            >
              <ProFormText
                name="name"
                placeholder={`${intl.formatMessage({
                  id: 'name.file',
                  defaultMessage: 'Tên file',
                })}`}
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
                className="w-100-p"
                name="status"
                placeholder={`${intl.formatMessage({
                  id: 'campaign.selection',
                  defaultMessage: 'Lựa chọn',
                })}`}
                showSearch
                options={dataCampaignStatus ? dataCampaignStatus : []}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className="w-100-p mb-0"
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'export.service',
                defaultMessage: 'Dịch vụ',
              })}:`}
            >
              <ProFormSelect
                className="w-100-p"
                name="module"
                placeholder={`${intl.formatMessage({
                  id: 'campaign.selection',
                  defaultMessage: 'Lựa chọn',
                })}`}
                showSearch
                options={dataServices}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} className="mb-16">
            <Form.Item
              className="w-100-p mb-0"
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'export.date',
                defaultMessage: 'Ngày export',
              })}`}
            >
              <ProFormDateRangePicker
                className="w-100-p"
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
        </Row>
        <Row justify="end" className="t-al-right">
          <Col span={24}>
            <div className="">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '88.38px' }}
              >
                {intl.formatMessage({
                  id: 'account.btn.filter',
                  defaultMessage: 'Tìm kiếm',
                })}
              </Button>
              <Button
                type="default"
                style={{ marginLeft: '8px', width: '88.38px' }}
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
      </div>
    </Form>
  );
}
