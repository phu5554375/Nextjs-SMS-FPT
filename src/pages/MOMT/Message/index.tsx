import CursorPagination from '@/components/CursorPagination';
import DateRangePicker from '@/components/DateRangePicker';
import Modal from '@/components/Modal';
import TagSelectGroup from '@/components/TagSelectGroup';
import NoPermissionPage from '@/pages/NoPermisson';
import { exportMTMessage, fetchAllMessage } from '@/services/MT/message';
import { fetchAllSyntax } from '@/services/MT/subscription';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useAccess, useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

export default function Page() {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');

  const LIST_TELCO = initialState?.configs['mo-mt-telcos'];

  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm();

  const [params, setParams] = useState<any>({});

  const [cursor, setCursor] = useState<any>();
  const [datas, setDatas] = useState<any>();
  const [selectpage, setSelectpage] = useState<any>(10);
  const [defaultpage, setDefaultpage] = useState<any>();
  const [loading, setLoading] = useState(false);

  const callbackBtn = useCallback(
    async (newsValue: any, selectpage: any) => {
      actionRef.current?.reload();
      setLoading(true);
      const result = await fetchAllMessage({
        ...params,
        cursor: newsValue?.cursor,
        limit: selectpage && selectpage ? selectpage : 10,
      });
      if (result) {
        setLoading(false);
        setCursor(result?.cursor);
        setDatas(result?.data);
        setSelectpage(selectpage);
        setDefaultpage(defaultpage);
      }
    },
    [setCursor, setDatas, setSelectpage, setDefaultpage, params],
  );

  useEffect(() => {
    callbackBtn(cursor, selectpage);
  }, [setCursor, setDatas, setSelectpage, setDefaultpage, params]);

  const handlePanigation = (newsValue: any) => {
    setCursor(newsValue);
    callbackBtn(newsValue, selectpage);
  };

  const handleSelect = (newsPage: any) => {
    let a = newsPage;
    callbackBtn(cursor, a);
  };
  const handleDefault = (newsValue: any) => {
    callbackBtn(newsValue, defaultpage);
  };

  const [fileName, setFileName] = useState<any>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestExport = async () => {
    const values: any = {
      title: fileName,
      ...params,
    };
    try {
      const response: any = await exportMTMessage(values);
      setIsLoading(true);
      if (response.success) {
        if (response?.data?.redirect) {
          history.push('/exports/list');
        } else {
          const link = document.createElement('a');

          const modifiedFileName = fileName
            ? fileName + '.xlsx'
            : 'Export_' +
              new Date().getTime() +
              new Date().getDate() +
              new Date().getMonth() +
              new Date().getFullYear() +
              '.xlsx';

          link.setAttribute('href', response.data.link_url);
          link.setAttribute('download', modifiedFileName);
          link.setAttribute('rel', 'noopener noreferrer');

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setFileName(undefined);
        }
      }
      setIsLoading(false);
    } catch (error) {
      message.error('Export failed');
      setIsLoading(false);
    }
  };
  const handleConfirmAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsModalOpen(false);
      handleRequestExport();
      setIsLoading(false);
    }, 1000);
  };

  const [listSyntax, setListSyntax] = useState<
    { label: string; value: string }[]
  >([]);

  const [telcoSelected, setTelcoSelected] = useState<string[]>([]);

  const columns: ProColumns<API_MTMESSAGE.Message>[] = [
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      valueType: 'text',
    },
    {
      title: 'Nhà mạng',
      dataIndex: 'telco',
      key: 'telco',
      valueType: 'text',
      render: telco => (
        <span style={{ color: '#1890FF' }}>
          {LIST_TELCO.find((item: any) => item.value === telco)?.label}
        </span>
      ),
    },
    {
      title: 'Đầu số',
      // dataIndex: 'mo_business_number',
      key: 'mo_business_number',
      valueType: 'text',
      align: 'left',
      render: (dom, item) => <span>{item?.mo_business_number}</span>,
    },
    {
      title: 'MO',
      dataIndex: 'mo_syntax',
      key: 'mo_syntax',
      valueType: 'text',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_charged',
      key: 'is_charged',
      valueType: 'text',
      align: 'left',
      render: is_charged =>
        is_charged === 1 ? (
          <Tag color="green">Tính phí</Tag>
        ) : (
          <Tag color="blue">Không tính phí</Tag>
        ),
    },
    {
      title: 'Thời gian gửi tin',
      dataIndex: 'delivered_at',
      key: 'delivered_at',
      valueType: 'text',
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
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    const newParam = {
      from:
        values.dateRange && values.dateRange[0]
          ? dayjs(values.dateRange[0]).format('YYYY-MM-DD')
          : '',
      to:
        values.dateRange && values.dateRange[1]
          ? dayjs(values.dateRange[1]).format('YYYY-MM-DD')
          : '',
      phone_number: values.phone_number || '',
      mo_subscription_ids: values.syntax,
      is_charged: values.is_charged,
      telcos: telcoSelected.toString(),
    };

    if (JSON.stringify(newParam) !== JSON.stringify(params)) {
      setParams(newParam);
    }
  };

  const handlefetchAllSyntax = async () => {
    try {
      const response = await fetchAllSyntax();
      if (response.success) {
        const transformedData = response.data.map((item: any) => ({
          label: item.text,
          value: item.id,
        }));
        transformedData.unshift({
          label: 'All',
          value: '',
        });
        setListSyntax(transformedData);
      }
    } catch (error) {
      console.log('Error fetching syntax data:', error);
    }
  };

  useEffect(() => {
    handlefetchAllSyntax();
    form.submit();
  }, []);

  if (!access.canMtMessagesIndex) return <NoPermissionPage />;

  return (
    <Fragment>
      <PageContainer>
        <Card className="mb-24">
          <Form
            form={form}
            labelAlign="left"
            onFinish={handleFormSubmit}
            initialValues={{
              phone_number: '',
              syntax: '',
              is_charged: '',
              dateRange: [dayjs().subtract(45, 'day'), dayjs()],
            }}
            autoComplete="off"
          >
            <Row gutter={[10, 10]} className="mb-10">
              <Col span={24}>
                <Form.Item label="Nhà mạng" labelAlign="left">
                  <TagSelectGroup
                    isReset={isReset}
                    defaultSelectedAll
                    items={LIST_TELCO}
                    onSelectionChange={handleTagSelectionChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]} className="mb-16">
              <Col xs={24} sm={12} md={12} lg={6}>
                <Form.Item
                  label="Số điện thoại"
                  labelAlign="left"
                  className="label-bold"
                  name="phone_number"
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <Form.Item
                  label="MO"
                  name="syntax"
                  labelAlign="left"
                  className="label-bold"
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    placeholder="MO"
                    options={listSyntax}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <Form.Item
                  label="Trạng thái"
                  name="is_charged"
                  labelAlign="left"
                  className="label-bold"
                >
                  <Select
                    placeholder="Trạng thái"
                    options={[
                      { label: 'All', value: '' },
                      { label: 'Tính phí', value: 1 },
                      { label: 'Không tính phí', value: 0 },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <Form.Item
                  label="Thời gian"
                  labelAlign="left"
                  className="label-bold date-range-custom"
                >
                  <DateRangePicker />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]}>
              <Col span={24} className="col-form-custom t-al-right">
                <Button type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
                <Button
                  type="default"
                  onClick={handleFormReset}
                  className="ml-8"
                  htmlType="reset"
                >
                  Làm lại
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <ProTable<API_MTMESSAGE.Message>
          rowSelection={false}
          actionRef={actionRef}
          pagination={false}
          search={false}
          columns={columns}
          params={params}
          loading={loading}
          headerTitle="Tra cứu"
          rowKey="key"
          scroll={{}}
          dataSource={datas}
          toolBarRender={() => [
            <Button
              style={{
                backgroundColor: 'rgb(56, 158, 13)',
                color: '#FFFFFF',
                borderRadius: '2px',
                marginRight: '8px',
              }}
              type="primary"
              key="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <DownloadOutlined />{' '}
              <FormattedMessage
                id="account.btn.Export"
                defaultMessage="Export"
              />
            </Button>,
          ]}
          footer={() => (
            <CursorPagination
              onCursorChange={handlePanigation}
              cursor={cursor}
              onSelectPage={handleSelect}
              onFirstDefault={handleDefault}
            />
          )}
        />
        <Modal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAction}
          loading={isLoading}
        >
          <Row>
            <Col span={24}>
              <Input
                placeholder="Enter file name"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
              />
            </Col>
          </Row>
        </Modal>
      </PageContainer>
    </Fragment>
  );
}
