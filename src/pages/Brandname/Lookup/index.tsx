import colors from '@/commons/colors';
import NoPermissionPage from '@/pages/NoPermisson';
import { exportLOOKUP, fetchLookUp } from '@/services/lookup';
import { DownloadOutlined, InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { history, useAccess, useModel } from '@umijs/max';
import { Button, Col, Input, Row, Tag, Tooltip, message, Badge } from 'antd';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'umi';
import CursorPagination from '../../../components/CursorPagination';
import Modal from '../../../components/Modal';
import FilterForm from './FilterForm';
import styles from './index.less';

const TableList: React.FC = () => {
  const access = useAccess();
  /** cấu hình language */
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const LIST_TELCO = initialState?.configs.telcos;
  const actionRef = useRef<ActionType>();
  const [params, setParams] = useState<any>({});
  const [cursor, setCursor] = useState<any>();
  const [datas, setDatas] = useState<any>();
  const [selectpage, setSelectpage] = useState<any>(10);
  const [defaultpage, setDefaultpage] = useState<any>();
  const [loading, setLoading] = useState(false);

  const callbackBtn: any = useCallback(
    async (newsValue: any, selectpage: any) => {
      setLoading(true);
      const result = await fetchLookUp({
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
    [setCursor, setDatas, setSelectpage, setDefaultpage],
  );

  useEffect(() => {
    callbackBtn(cursor, selectpage);
  }, [setCursor, setDatas, setSelectpage, setDefaultpage]);

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

  const handleParamChange = (newValue: any) => {
    setParams(newValue);
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
      const response: any = await exportLOOKUP(values);
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
  const columns: ProColumns<API_LOOKUP.CurrentLookup>[] = [
    {
      title: <FormattedMessage id="lookup.sender" defaultMessage="Brandname" />,
      key: 'sender',
      render(dom, item) {
        return (
          <div>
            <Tag color="processing">
              <span>{item?.sender}</span>
            </Tag>
          </div>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="lookup.campaign"
          defaultMessage="Tên chiến dịch"
        />
      ),
      key: 'campaign',
      render: (dom, entity) => {
        return (
          <div
            className={entity.is_cancelled === 1 ? 'table-row-disabled' : ''}
          >
            <a
              style={{
                color:
                  entity.is_cancelled === 1 ? 'rgba(105, 103, 103, 0.45)' : '',
              }}
              onClick={() => {
                history.push({
                  pathname: '/campaigns/'.concat(`${entity.id}`),
                });
              }}
            >
              {entity?.campaign?.title}
            </a>
            {entity?.messages_invalid_count > 0 ? (
              <span className="ml-6" style={{ color: '#8C8C8C' }}>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.file.error',
                    defaultMessage: 'Lỗi tập tin',
                  })}
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="lookup.recipent" defaultMessage="Số điện thoại" />
      ),
      key: 'recipent',
      dataIndex: 'recipent',
      align: 'center',
    },

    {
      title: <FormattedMessage id="label.telco" defaultMessage="Nhà mạng" />,
      dataIndex: 'telco',
      key: 'telco',
      valueType: 'text',
      align: 'center',
      render: telco => (
        <span style={{ color: '#000' }}>
          {LIST_TELCO.find((item: any) => item.value === telco)?.label}
        </span>
      ),
    },
    {
      title: (
        <FormattedMessage id="lookup.text" defaultMessage="Nội dung tin nhắn" />
      ),
      key: 'text',
      align: 'center',
      render(dom, item) {
        return (
          <Tooltip
              placement="top"
              title={
                  item?.text
              }
          >
          <div className={styles.content__text}>
            <span>{item?.text}</span>
          </div>
          </Tooltip>
        );
      },
    },

    {
      title: (
        <FormattedMessage id="lookup.sms_count" defaultMessage="Số ký tự" />
      ),
      key: 'sms_count',
      align: 'center',
      dataIndex: 'sms_count',
    },
    {
      title: (
        <FormattedMessage
          id="number.of.messages"
          defaultMessage="Số lượng tin"
        />
      ),
      key: 'sms_count',
      align: 'center',
      dataIndex: 'sms_count',
    },

    {
      title: (
        <FormattedMessage id="type.of.message" defaultMessage="Kiểu tin nhắn" />
      ),
      dataIndex: 'sms_type',
      key: 'sms_type',
      align: 'center',
      valueEnum: {
        1: {
          text: <FormattedMessage id="lookup.type.1" defaultMessage="CSKH" />,
          status: '1',
        },
        2: {
          text: <FormattedMessage id="lookup.type.2" defaultMessage="QC" />,
          status: '2',
        },
      },
    },
    {
      title: (
        <FormattedMessage id="campaign.status" defaultMessage="Trạng thái" />
      ),
      key: 'status',
      render(dom, item) {
        const campaignStatus = item.status;
        if (campaignStatus === 1) {
          return (
            <div className="">
              <Tag color="success">
                {intl.formatMessage({
                  id: 'campaign.status.new',
                  defaultMessage: 'Mới',
                })}
              </Tag>
            </div>
          );
        }
        if (campaignStatus === 2) {
          return (
            <div className="">
              <Tag color="warning">
                <Badge className="mr-6" color={colors.YELLOW} />
                {intl.formatMessage({
                  id: 'campaign.status.awaiting_approval',
                  defaultMessage: 'Chờ duyệt',
                })}
              </Tag>
            </div>
          );
        }
        if (campaignStatus === 3) {
          return (
            <div className="">
              <Tag color="purple">
                <Badge className="mr-6" color={colors.PURPLE} />
                {intl.formatMessage({
                  id: 'campaign.status.pending',
                  defaultMessage: 'Chờ gửi',
                })}
              </Tag>
            </div>
          );
        }

        if (campaignStatus === 4) {
          return (
            <div className="">
              <Tag color="processing">
                <Badge className="mr-6" color={colors.BLUE} />
                <span style={{ color: 'black' }}>
                  {intl.formatMessage({
                    id: 'campaign.status.sending',
                    defaultMessage: 'Đang chạy',
                  })}
                </span>
              </Tag>
            </div>
          );
        }
        if (campaignStatus === 5) {
          return (
            <div className="">
              <Tag icon={<CheckOutlined />} color="success">
                <span style={{ color: 'black' }}>
                  {intl.formatMessage({
                    id: 'campaign.status.completed',
                    defaultMessage: 'Hoàn thành',
                  })}
                </span>
              </Tag>
            </div>
          );
        }
        if (campaignStatus === 6) {
          return (
            <div className="">
              <Tag color="default">
                <Badge className="mr-6" color={colors.GRAY} />
                {intl.formatMessage({
                  id: 'campaign.status.cancelled',
                  defaultMessage: 'Hủy',
                })}
              </Tag>
            </div>
          );
        }

        if (campaignStatus === 7) {
          return (
            <div className="">
              <Tag color="error">
                <Badge className="mr-6" color={colors.RED} />
                {intl.formatMessage({
                  id: 'campaign.status.error',
                  defaultMessage: 'Lỗi',
                })}
              </Tag>
            </div>
          );
        }
      },
    },
    {
      title: (
        <FormattedMessage
          id="lookup.delivered_at"
          defaultMessage="Thời gian gửi"
        />
      ),
      key: 'delivered_at',
      render(dom, item) {
        return item?.delivered_at === null ? '' : item?.delivered_at;
      },
    },
    {
      title: (
        <FormattedMessage id="lookup.error" defaultMessage="Chi tiết lỗi" />
      ),
      key: 'error',
      render(dom, item) {
        return item?.error === null
          ? ''
          : {
              0: {
                text: (
                  <FormattedMessage
                    id="lookup.error"
                    defaultMessage="Số điện thoại không đúng"
                  />
                ),
                status: '0',
              },
              1: {
                text: (
                  <FormattedMessage
                    id="lookup.type.main"
                    defaultMessage="Null"
                  />
                ),
                status: '1',
              },
            };
      },
    },
  ];

  if (!access.canMessagesIndex) return <NoPermissionPage />;

  return (
    <>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <a href="#">
                {intl.formatMessage({
                  id: 'brandname.service',
                  defaultMessage: 'Dịch vụ Brandname',
                })}
              </a>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <li>
              <span>
                {intl.formatMessage({
                  id: 'lookup.lable.list',
                  defaultMessage: 'Tra cứu',
                })}
              </span>
            </li>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'lookup.lable.list' })}
            </span>
          </div>
        </div>
      </div>

      <div className="pa-24">
        <FilterForm onParamChange={handleParamChange} />
      </div>

      <div className="ph-24">
        <div className={styles.table_backgroud}>
          <Fragment>
            <ProTable<API_LOOKUP.CurrentLookup>
              rowSelection={false}
              actionRef={actionRef}
              pagination={false}
              search={false}
              loading={loading}
              columns={columns}
              params={params}
              headerTitle={`${intl.formatMessage({
                id: 'lookup.report.results',
              })}`}
              rowKey="key"
              scroll={{}}
              dataSource={datas}
              request={async (params: any, filter: any) => {
                const response = await fetchLookUp(params, filter);
                if (response?.success) {
                  setDatas(response?.data);
                  return { data: response?.data };
                }
                return {};
              }}
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
          </Fragment>
        </div>
      </div>
    </>
  );
};

export default TableList;
