import Summary from '@/components/Sumary';
import TagSelectGroup from '@/components/TagSelectGroup';
import ViewTable from '@/components/ViewTable';
import { useFormatNumber as formatNumber } from '@/hooks/useFormatNumber';
import TruncatedString from '@/hooks/useTruncatedString';
import {
  exportBrandnameReport,
  fetchAllBrandnameReport,
} from '@/services/report';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Button, Card, Col, DatePicker, Form, Row, Select } from 'antd';
import dayjs from 'dayjs';

import { Fragment, useEffect, useRef, useState } from 'react';

export default function Page() {
  const intl = useIntl();

  const { initialState } = useModel('@@initialState');

  const { telcos: LIST_TELCO, sms_types: LIST_SMS_TYPE } =
    initialState?.configs;

  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm();

  const [data, setData] = useState<any>();

  const [params, setParams] = useState<any>({});

  const [telcoSelected, setTelcoSelected] = useState<string[]>([]);

  const columns: ProColumns<API_BRANDNAME_REPORT.Report>[] = [
    {
      title: 'Tháng',
      // dataIndex: 'delivered_on',
      key: 'delivered_on',
      valueType: 'text',
      render: (dom, item) => <span>{item?.delivered_on}</span>,
    },
    {
      title: 'Brandname',
      dataIndex: 'brandname',
      key: 'brandname',
      valueType: 'text',
      render: (value: any) => {
        return value ? value?.name : '';
      },
    },
    {
      title: 'Chiến dịch',
      dataIndex: 'campaign',
      key: 'campaign',
      valueType: 'text',
      render: (value: any) => {
        return value ? TruncatedString(value?.title) : '';
      },
    },
    {
      title: 'Nhà mạng',
      dataIndex: 'telco',
      key: 'telco',
      valueType: 'text',
      render: (value: any) => (
        <span style={{ color: '#1890FF' }}>
          {LIST_TELCO.find((item: any) => item.value === value)?.label}
        </span>
      ),
    },
    {
      title: 'Loại tin',
      dataIndex: 'sms_type',
      key: 'sms_type',
      valueType: 'text',
      render: (value: any) =>
        value !== '-' ? (
          <span style={{ color: '#1890FF' }}>
            {intl.formatMessage({
              id: `sms.type.${
                LIST_SMS_TYPE.find((item: any) => item.value === value)?.value
              }`,
              defaultMessage: LIST_SMS_TYPE.find(
                (item: any) => item.value === value,
              )?.label,
            })}
          </span>
        ) : (
          ''
        ),
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'messages_delivered_count',
      key: 'messages_delivered_count',
      valueType: 'text',
      align: 'right',
      render: (value: any) => formatNumber(value),
    },
    {
      title: 'Tin lỗi',
      dataIndex: 'messages_failed_count',
      key: 'messages_failed_count',
      valueType: 'text',
      align: 'right',
      render: (value: any) => formatNumber(value),
    },
    {
      title: 'Tin thành công',
      dataIndex: 'messages_succeed_count',
      key: 'messages_succeed_count',
      valueType: 'text',
      align: 'right',
      render: (value: any) => formatNumber(value),
    },
    {
      title: 'Tin chờ kết quả',
      dataIndex: 'messages_pending_count',
      key: 'messages_pending_count',
      valueType: 'text',
      align: 'right',
      render: (value: any) => formatNumber(value),
    },
    {
      title: 'Tổng tiền (VND)',
      dataIndex: 'amount',
      key: 'amount',
      valueType: 'text',
      align: 'right',
      render: (value: any) => formatNumber(value),
    },
  ];

  const handleTagSelectionChange = (selectedItems: string[]) => {
    setTelcoSelected(selectedItems);
  };

  const [isReset, setIsReset] = useState(false);

  const handleFormReset = () => {
    setIsReset(!isReset);
    form.resetFields();
    form.submit();
  };

  const handleFormSubmit = async (values: any) => {
    actionRef.current?.reload();

    const selectedMonth = dayjs(values.month);

    const startOfMonth = selectedMonth.startOf('month').format('YYYY-MM-DD');

    const endOfMonth = selectedMonth.endOf('month').format('YYYY-MM-DD');

    const newParam = {
      from: startOfMonth,
      to: endOfMonth,
      telcos: telcoSelected.toString(),
      sms_types: values.sms_type,
    };

    if (JSON.stringify(newParam) !== JSON.stringify(params)) {
      setParams(newParam);
    }
  };

  useEffect(() => {
    form.submit();
  }, []);

  return (
    <Fragment>
      <Summary items={data} />

      <Card className="mb-24">
        <Form
          form={form}
          labelAlign="left"
          onFinish={handleFormSubmit}
          initialValues={{
            month: dayjs(),
            sms_type: '',
          }}
          autoComplete="off"
        >
          <Row gutter={[10, 10]} className="mb-16">
            <Col span={24}>
              <Form.Item label="Nhà mạng" labelAlign="left" className="">
                <TagSelectGroup
                  isReset={isReset}
                  defaultSelectedAll
                  items={LIST_TELCO}
                  onSelectionChange={handleTagSelectionChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Form.Item
                label="Loại tin"
                name="sms_type"
                labelAlign="left"
                className="label-bold"
              >
                <Select
                  options={[{ label: 'All', value: '' }, ...LIST_SMS_TYPE].map(
                    items => {
                      return {
                        label: intl.formatMessage({
                          id: `sms.type.${items.label}`,
                          defaultMessage: items.label,
                        }),
                        value: items.value,
                      };
                    },
                  )}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Form.Item
                label="Tháng"
                labelAlign="left"
                className="label-bold date-range-custom"
                name="month"
              >
                <DatePicker picker="month" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              className="col-form-custom t-al-right"
            >
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
              <Button
                type="default"
                className="ml-8"
                htmlType="reset"
                onClick={handleFormReset}
              >
                Làm lại
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <ViewTable
        keyTable="brandname.month"
        actionRef={actionRef}
        columns={columns}
        params={params}
        headerTitle="Kết quả báo cáo"
        rowKey="key"
        isExpanded={true}
        scroll={{}}
        sendData={(values: any) => {
          setData(values);
        }}
        requestData={async () => {
          return await fetchAllBrandnameReport({
            type: 'month',
            ...params,
          });
        }}
        handleExport={async (fileName: string) => {
          return await exportBrandnameReport({
            title: fileName,
            type: 'month',
            ...params,
          });
        }}
      />
    </Fragment>
  );
}
