import colors from '@/commons/colors';
import FormattedDateTime from '@/components/Common/FormattedDateTime';
import NoPermissionPage from '@/pages/NoPermisson';
import {
  approveCampaignById,
  getCampaignById,
  getCampaignInvalidMessagesById,
} from '@/services/campaign';
import { CheckOutlined } from '@ant-design/icons';
import {
  NavLink,
  history,
  useAccess,
  useIntl,
  useModel,
  useParams,
} from '@umijs/max';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import ApproveForm from '../ApproveForm';
import ViewMessage from './ViewMessage';
import ViewWrongFormat from './ViewWrongFormat';
import styles from './index.less';

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

export default function PageCampaignDetail() {
  const access = useAccess();
  const intl = useIntl();

  const { initialState } = useModel('@@initialState');

  const showApproval = initialState?.configs?.setting;

  const listSmsType = initialState?.configs?.sms_types;

  const list_campaign_type = initialState?.configs.campaign_types;

  const params = useParams();

  const [currentCampaign, setCurrentCampaign] =
    useState<API_CAMPAIGN.CurrentCampaign>();

  const [totalDataWrong, setTotalDataWrong] = useState(0);

  const [keyTab, setKeyTab] = useState('tab_messages');

  const handTabChange = (key: string) => {
    setKeyTab(key);
  };

  useEffect(() => {
    const fetchCampaignById = async () => {
      const result = await getCampaignById(params);
      setCurrentCampaign(result?.data);
    };
    fetchCampaignById().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchDataWorng = async () => {
      const result = await getCampaignInvalidMessagesById({
        current: 1,
        pageSize: 20,
        id: params,
      });
      setTotalDataWrong(result?.total);
    };
    fetchDataWorng().catch(console.error);
  }, []);

  function RenderStatus({ value }: any) {
    if (value === 1) {
      return (
        <>
          {intl.formatMessage({
            id: 'campaign.status.new',
          })}
        </>
      );
    }
    if (value === 2) {
      return (
        <span>
          <Badge className="mr-6" status="warning" />
          {intl.formatMessage({
            id: 'campaign.status.awaiting_approval',
          })}
        </span>
      );
    }
    if (value === 3) {
      return (
        <span>
          <Badge className="mr-6" color={colors.PURPLE} />
          {intl.formatMessage({
            id: 'campaign.status.pending',
          })}
        </span>
      );
    }

    if (value === 4) {
      return (
        <span>
          <Badge className="mr-6" status="processing" />
          <span style={{ color: 'black' }}>
            {intl.formatMessage({ id: 'campaign.status.sending' })}
          </span>
        </span>
      );
    }
    if (value === 5) {
      return (
        <>
          <span style={{ color: colors.GREEN }}>
            <CheckOutlined />
          </span>{' '}
          {intl.formatMessage({
            id: 'campaign.status.completed',
            defaultMessage: 'Hoàn thành',
          })}
        </>
      );
    }
    if (value === 6) {
      return (
        <span>
          <Badge className="mr-6" status="default" />
          {intl.formatMessage({
            id: 'campaign.status.cancelled',
          })}
        </span>
      );
    }

    if (value === 7) {
      return (
        <span>
          <Badge className="mr-6" status="error" />
          {intl.formatMessage({
            id: 'campaign.status.error',
          })}
        </span>
      );
    }
  }

  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<any>(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const iShowUpdateByTime = useCallback((value: any) => {
    let today = dayjs().add(1, 'h');
    let scheduledDate = dayjs(value);
    const remaining = today.unix() - scheduledDate.unix();
    if (remaining <= 0) {
      return true;
    } else return false;
  }, []);

  function RenderTitle({ value }: any) {
    let title: any = value;
    if (title?.length > 65) {
      return title.slice(0, 65).concat('...');
    } else {
      return value;
    }
  }

  if (!access.canCampaignsIndex) return <NoPermissionPage />;
  return (
    <div>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <NavLink to="/campaigns/list">
                {intl.formatMessage({
                  id: 'campaign',
                  defaultMessage: 'Chiến dịch',
                })}
              </NavLink>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <Tooltip
              overlayStyle={{ minWidth: '400px' }}
              placement="top"
              title={<div className="pa-10">{currentCampaign?.title}</div>}
            >
              <li>
                <span>
                  <RenderTitle value={currentCampaign?.title} />
                </span>
              </li>
            </Tooltip>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'campaign.details' })}
            </span>
          </div>
        </div>

        <div>
          <Row gutter={[16, 16]} className={styles.my_headerContent}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="t-al-right">
              {showApproval.campaignAutoApprove !== true &&
                access.canCampaignsApprove() &&
                currentCampaign?.status === 2 && (
                  // <Popconfirm
                  //   title={intl.formatMessage({
                  //     id: 'campaign.tip.title.accept',
                  //     defaultMessage: 'Duyệt chiến dịch',
                  //   })}
                  //   description={intl.formatMessage({
                  //     id: 'campaign.tip.content.approve',
                  //     defaultMessage:
                  //       'Bạn có chắc chắn muốn duyệt chiến dịch này không?',
                  //   })}
                  //   icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  //   onConfirm={async () => {
                  //     await handleApproveCampaign(currentCampaign?.id);
                  //   }}
                  //   okText={intl.formatMessage({
                  //     id: 'account.action.ok',
                  //     defaultMessage: 'Có',
                  //   })}
                  //   cancelText={intl.formatMessage({
                  //     id: 'account.action.no',
                  //     defaultMessage: 'Không',
                  //   })}
                  // >
                  //   <Button type="default" className="mr-6 mb-6">
                  //     {intl.formatMessage({
                  //       id: 'campaign.approve',
                  //       defaultMessage: 'Duyệt',
                  //     })}
                  //   </Button>
                  // </Popconfirm>
                  <Button
                    type="default"
                    className="mr-6 mb-6"
                    key="approve"
                    onClick={() => {
                      setCurrentRow(currentCampaign && currentCampaign);
                      handleUpdateModalVisible(true);
                    }}
                  >
                    {intl.formatMessage({
                      id: 'campaign.approve',
                      defaultMessage: 'Duyệt',
                    })}
                  </Button>
                )}

              {access.canCampaignsUpdate() &&
                (currentCampaign?.status === 1 ||
                  currentCampaign?.status === 2 ||
                  (currentCampaign?.status === 3 &&
                    iShowUpdateByTime(currentCampaign.scheduled_at))) && (
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push({
                        pathname: '/campaigns/'
                          .concat(`${params.id}`)
                          .concat('/edit'),
                      });
                    }}
                  >
                    {intl.formatMessage({
                      id: 'account.action.update',
                      defaultMessage: 'Cập nhật',
                    })}
                  </Button>
                )}
            </Col>
          </Row>
        </div>
      </div>

      <div className="pa-16">
        <Row>
          <Col span={24} className="">
            <Card
              title={intl.formatMessage({
                id: 'campaign.information',
                defaultMessage: 'Thông tin chiến dịch',
              })}
            >
              <Row className="">
                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong> ID </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <Typography.Text>{currentCampaign?.id}</Typography.Text>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong> Code </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <Typography.Text>{currentCampaign?.code}</Typography.Text>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Tooltip
                    overlayStyle={{ minWidth: '400px' }}
                    placement="top"
                    title={
                      <div className="pa-10">{currentCampaign?.title}</div>
                    }
                  >
                    <Typography.Text strong>
                      {' '}
                      {intl.formatMessage({
                        id: 'campaign.name',
                        defaultMessage: 'Tên chiến dịch',
                      })}{' '}
                    </Typography.Text>
                    <span className="c3 b">{' :  '}</span>
                    <RenderTitle value={currentCampaign?.title} />
                  </Tooltip>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong>Brandname</Typography.Text>
                  <span className="c3 b">
                    <span className="c3 b">{' :  '}</span>
                  </span>
                  <Typography.Text>
                    {currentCampaign && currentCampaign?.brandname && (
                      <Tag
                        color={colors.BLUE_TAG}
                        style={{
                          color: '#034EA2',
                          fontSize: '12px',
                          fontStyle: 'normal',
                          fontWeight: '600',
                          lineHeight: '20px',
                        }}
                      >
                        <span>{currentCampaign?.brandname?.name}</span>
                      </Tag>
                    )}
                  </Typography.Text>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'campaign.type',
                      defaultMessage: 'Loại chiến dịch',
                    })}
                  </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <Typography.Text className="ml-3">
                    {list_campaign_type.find(
                      (item: any) => item.value === currentCampaign?.type,
                    ) &&
                      intl.formatMessage({
                        id: 'campaign.type.'.concat(`${currentCampaign?.type}`),
                      })}
                  </Typography.Text>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'message.type',
                      defaultMessage: 'Loại tin nhắn',
                    })}
                  </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <Typography.Text className="ml-3">
                    {listSmsType.find(
                      (item: any) => item.value === currentCampaign?.sms_type,
                    ) &&
                      intl.formatMessage({
                        id: 'sms.type.'.concat(`${currentCampaign?.sms_type}`),
                      })}
                  </Typography.Text>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'campaign.sending.time',
                      defaultMessage: 'Thời gian gửi',
                    })}
                  </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <Typography.Text>
                    {currentCampaign?.scheduled_at &&
                      FormattedDateTime(currentCampaign?.scheduled_at)}
                  </Typography.Text>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'campaign.status',
                      defaultMessage: 'Trạng thái',
                    })}
                  </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <span>
                    <RenderStatus value={currentCampaign?.status} />
                  </span>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'account.created.by',
                      defaultMessage: 'Người tạo',
                    })}
                  </Typography.Text>
                  <span className="c3 b">{' :  '}</span>
                  <span>{currentCampaign?.created_by?.full_name}</span>
                </Col>

                <Divider dashed></Divider>

                <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                  <Row>
                    <Col span={24} className="pb-16">
                      <Typography.Text strong>
                        {intl.formatMessage({
                          id: 'number.of.messages.sent',
                          defaultMessage: 'Số lượng tin nhắn đã gửi',
                        })}
                      </Typography.Text>
                      <span className="c3 b">{' :  '}</span>
                      <Typography.Text>
                        {currentCampaign?.messages_delivered_count} /{' '}
                        {currentCampaign?.messages_count}
                      </Typography.Text>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                  <Row>
                    <Col span={24} className="pb-16">
                      <Typography.Text strong>
                        {intl.formatMessage({
                          id: 'number.of.successful.messages',
                          defaultMessage: 'Số lượng tin nhắn thành công',
                        })}
                      </Typography.Text>
                      <span className="c3 b">{' :  '}</span>
                      <Typography.Text>
                        {currentCampaign?.messages_succeed_count} /{' '}
                        {currentCampaign?.messages_delivered_count}
                      </Typography.Text>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                  <Row>
                    <Col span={24} className="pb-16">
                      <Typography.Text strong>
                        {intl.formatMessage({
                          id: 'number.of.failed.messages',
                          defaultMessage: 'Số lượng tin nhắn thất bại',
                        })}
                      </Typography.Text>
                      <span className="c3 b">{' :  '}</span>
                      <Typography.Text>
                        {currentCampaign?.messages_failed_count} /{' '}
                        {currentCampaign?.messages_delivered_count}
                      </Typography.Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24} className="pv-24">
            <Row className={styles.my_card}>
              <Col span={24} className="ph-24 mt-24">
                <Typography.Text strong>
                  {intl.formatMessage({
                    id: 'list',
                    defaultMessage: 'Danh sách',
                  })}
                </Typography.Text>
              </Col>
              <Col span={24} className="">
                <Tabs defaultActiveKey="tab_messages" onChange={handTabChange}>
                  <Tabs.TabPane
                    tab={
                      <div className="ph-24">
                        {intl.formatMessage({
                          id: 'message',
                          defaultMessage: 'Tin nhắn',
                        })}
                      </div>
                    }
                    key="tab_messages"
                  >
                    <div className="mt-24">
                      {' '}
                      <ViewMessage id_campaign={params} />{' '}
                    </div>
                  </Tabs.TabPane>

                  <Tabs.TabPane
                    tab={
                      <div>
                        {intl.formatMessage({
                          id: 'wrong.format',
                          defaultMessage: 'Sai định dạng',
                        })}
                        <span style={{ marginLeft: '3px' }}>
                          {keyTab === 'tab_messages_error' ? (
                            <Badge
                              count={totalDataWrong}
                              overflowCount={9999999999}
                              style={{ backgroundColor: 'red' }}
                            />
                          ) : (
                            <Badge
                              count={totalDataWrong}
                              overflowCount={9999999999}
                              style={{
                                backgroundColor: '#F1F1F1',
                                color: '#9C9C9C',
                              }}
                            />
                          )}
                        </span>
                      </div>
                    }
                    key="tab_messages_error"
                  >
                    <div className="mt-24">
                      {' '}
                      <ViewWrongFormat id_campaign={params} />{' '}
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
        <ApproveForm
          onSubmit={async value => {
            // const success = await handleApproveCampaign(value);
            const param = {
              scheduled_at: value?.scheduled_at,
            };
            const result = await approveCampaignById(param, value?.id);
            if (result.success === true) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);
              message.success(
                `${intl.formatMessage({
                  id: 'campaign.message.approve.success',
                })}`,
              );
              history.push({
                pathname: '/campaigns/list',
              });
            } else {
              setIsLoading(false);
              handleUpdateModalVisible(false);
              message.success(
                `${intl.formatMessage({
                  id: 'campaign.message.approve.fail',
                })}`,
              );
            }
          }}
          onCancel={() => {
            setCurrentRow(undefined);
            handleUpdateModalVisible(false);
            setIsLoading(false);
          }}
          updateModalVisible={updateModalVisible}
          values={currentRow}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
