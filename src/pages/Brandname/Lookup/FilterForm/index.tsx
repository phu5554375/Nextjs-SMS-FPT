/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { fetchAllBrandname } from '@/services/brandname';
import { fetchAllCampaign } from '@/services/campaign';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Button, Col, Form, Row, Select } from 'antd';
import dayjs from 'dayjs';

import { useEffect, useState } from 'react';
import styles from './index.less';

export default function ({ onParamChange, listCampaignStatus }: any) {
  const intl = useIntl();

  const { initialState } = useModel('@@initialState');

  const { telcos: LIST_TELCO, sms_types: LIST_SMS_TYPE } =
    initialState?.configs;

  const listTypeOfSms: any = LIST_SMS_TYPE.map((item: any) => (
    {
    label: `${intl.formatMessage({
      id: 'lookup.type.'.concat(`${item.value}`) ,
    })}`,
    value: item.value,
    }
  ))
   const arr = [...listTypeOfSms]
   arr.push({
    label:'All',
    value:''
   });

  const [form] = Form.useForm();
  const [param, setParam] = useState<any>({});
  const [dataCampaignStatus, setDataCampaignStatus] = useState([]);

  useEffect(() => {
    form.submit();
  }, []);
  
  useEffect(() => {
   const fetchAllCampaignStatusFormat = async () => {
      let transformedData: any = listCampaignStatus.map((item: any) => ({
        label: `${intl.formatMessage({
          id: 'campaign.status.'.concat(`${item.label}`),
        })}`,
        value: item.value,
      }));

      setDataCampaignStatus(transformedData);
    };
    fetchAllCampaignStatusFormat().catch(console.error);
  }, []);

  const handleFormSubmit = async (values: any) => {
    const newParam = {
      from:
        values.dateRange && values.dateRange[0]
          ? dayjs(values.dateRange[0]).format('YYYY-MM-DD')
          : '',
      to:
        values.dateRange && values.dateRange[1]
          ? dayjs(values.dateRange[1]).format('YYYY-MM-DD')
          : '',

      campaign_ids: values.campaign_ids.toString(),
      sms_type: values.sms_type,
      status: values.status,
      recipent: values.recipent,
      brandname_id: values.brandname_id,
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
      initialValues={{
        sms_type: '',
        campaign_ids: '',
        brandname_id: '',
        dateRange: [dayjs().subtract(45, 'day'), dayjs()],

      }}
      autoComplete="off"
    >
      <div className="bg-white pa-24">
        <Row className="filter--lookup" justify="start" gutter={[20, 20]}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className={styles.customFormLabel}
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'lookup.recipent',
                defaultMessage: 'Số điện thoại',
              })}`}
            >
              <ProFormText
                name="recipent"
                placeholder={`${intl.formatMessage({
                  id: 'lookup.recipent',
                  defaultMessage: 'Nhập số điện thoại',
                })}`}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
            <Form.Item className="fw-600">
              <ProFormSelect
                className="label-bold"
                showSearch
                label="Brandname"
                name="brandname_id"
                placeholder={`${intl.formatMessage({
                  id: 'lookup.status',
                  defaultMessage: 'Lựa chọn',
                })}`}
                request={async () => {
                  const { data } = await fetchAllBrandname();
                  const result = data
                    ? data.map((item: { id: any; name: any }) => ({
                        value: item?.id,
                        label: item?.name,
                      }))
                    : [];
                    result.push({ label: 'All', value: '' });
                  return result;
                }}
                fieldProps={{
                  optionLabelProp: 'label',
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
            <Form.Item className="fw-600">
              <ProFormSelect
                showSearch
                label={intl.formatMessage({
                  id: 'campaign',
                  defaultMessage: 'Chiến dịch',
                })}
                name="campaign_ids"
                placeholder=""
                request={async () => {
                  const { data } = await fetchAllCampaign({ pageSize: 1000 });
                  const result = data
                    ? data.map((item: { id: any; title: any }) => ({
                        value: item?.id,
                        label: item?.title,
                      }))
                    : [];
                  result.push({ label: 'All', value: '' });
                  return result;
                }}
                fieldProps={{
                  mode: 'multiple',
                  optionLabelProp: 'label',
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
            <Form.Item
              label={`${intl.formatMessage({
                id: 'lookup.sms_type',
                defaultMessage: 'Loại tin',
              })}`}
              name="sms_type"
              labelAlign="left"
              className="label-bold"
            >
           
              <Select options={arr} />
            </Form.Item>
          </Col>
          
        <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
                <Form.Item
                label={`${intl.formatMessage({
                  id: 'lookup.status-title',
                  defaultMessage: 'Trạng thái',
                })}`}
                  
                  name="status"
                  labelAlign="left"
                  className="label-bold"
                >
                  <Select
                    defaultValue="All"
                    options={[
                      { label: 'All', value: ''  },
                      { label: 'Chờ gửi', value: 1},
                      { label: 'Đã gửi', value: 2  },
                      { label: 'Thành công', value: 3},
                      { label: 'Gửi lỗi', value: 4},
                    ]}
                  />
                </Form.Item>
              </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Form.Item
              className={styles.customFormLabel}
              labelAlign="left"
              label={`${intl.formatMessage({
                id: 'lookup.createdAt',
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
        <Row justify="end" className="t-al-right">
          <Col span={24}>
            <div className="pr-26">
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({
                  id: 'lookup.btn.filter',
                  defaultMessage: 'Tìm kiếm',
                })}
              </Button>
              <Button
                type="default"
                style={{ marginLeft: '8px' }}
                onClick={() => handleResetFormSubmit()}
              >
                {intl.formatMessage({
                  id: 'lookup.btn.reset',
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
