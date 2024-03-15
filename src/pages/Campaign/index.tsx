import colors from '@/commons/colors';
import FormattedDateTime from '@/components/Common/FormattedDateTime';
import {
  approveCampaignById,
  cancelCampaignById,
  fetchAllCampaign,
  removeCampaignById,
} from '@/services/campaign';
import {
  CheckOutlined,
  CloseCircleOutlined,
  DeleteFilled,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { NavLink, history, useModel } from '@umijs/max';
import {
  Badge,
  Button,
  Divider,
  Popconfirm,
  Progress,
  Tag,
  Tooltip,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useRef, useState } from 'react';
import { FormattedMessage, useAccess, useIntl } from 'umi';
import NoPermissionPage from '../NoPermisson';
import ApproveForm from './ApproveForm';
import FilterForm from './FilterForm';
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

const TableList: React.FC = () => {
  const access = useAccess();
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const listCampaignStatus = initialState?.configs?.campaign_statuses;

  const showApproval = initialState?.configs?.setting;

  const actionRef = useRef<ActionType>();

  const [currentRow, setCurrentRow] = useState<any>(undefined);

  const [params, setParams] = useState(undefined);
  const handleParamChange = (newValue: any) => {
    setParams(newValue);
  };

  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);

  const handleCancelCampaign = async (_record?: number) => {
    if (!_record) return true;
    try {
      await waitTime(1000);
      await cancelCampaignById({
        key: _record,
      });
      message.success(
        `${intl.formatMessage({ id: 'campaign.message.cancel.success' })}`,
      );
      return true;
    } catch (error) {
      message.error(
        `${intl.formatMessage({ id: 'campaign.message.cancel.fail' })}`,
      );
      return false;
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async (id?: number) => {
    if (!id) return true;
    try {
      await waitTime(1000);
      await removeCampaignById({
        key: id,
      });
      message.success(
        `${intl.formatMessage({ id: 'campaign.action.delete.success' })}`,
      );
      return true;
    } catch (error) {
      message.error(
        `${intl.formatMessage({ id: 'campaign.action.delete.fail' })}`,
      );
      return false;
    }
  };

  function RenderActionRemoveCampaign(props: any) {
    return (
      <>
        {access.canCampaignsDestroy() &&
          props?.record.status !== 4 &&
          props?.record.status !== 5 && (
            <div>
              <Popconfirm
                title={intl.formatMessage({
                  id: 'campaign.tip.title.delete',
                  defaultMessage: 'Xóa chiến dịch',
                })}
                description={intl.formatMessage({
                  id: 'campaign.tip.content.delete',
                  defaultMessage: 'Bạn có chắc chắn xóa chiến dịch này không?',
                })}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={async () => {
                  await handleRemove(props?.record?.id);
                  actionRef.current?.reloadAndRest?.();
                }}
                okText={intl.formatMessage({
                  id: 'action.ok',
                  defaultMessage: 'Có',
                })}
                cancelText={intl.formatMessage({
                  id: 'action.no',
                  defaultMessage: 'Không',
                })}
              >
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.delete',
                    defaultMessage: 'Xóa chiến dịch',
                  })}
                >
                  <Button
                    style={{
                      paddingTop: 0,
                    }}
                    type="text"
                    danger
                    key="delete"
                  >
                    <DeleteFilled style={{ color: 'red' }} />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </div>
          )}
      </>
    );
  }

  const iShowUpdateByTime = useCallback((value: any) => {
    let today = dayjs().add(1, 'h');
    let scheduledDate = dayjs(value);
    const remaining = today.unix() - scheduledDate.unix();
    if (remaining <= 0) {
      return true;
    } else return false;
  }, []);

  const columns: ProColumns<API_CAMPAIGN.CurrentCampaign>[] = [
    {
      title: (
        <FormattedMessage id="campaign.name" defaultMessage="Tên chiến dịch" />
      ),
      key: 'title',
      render: (dom, item) => {
        let title: any = item?.title;
        if (title?.length > 65) {
          title = title.slice(0, 65).concat('...');
        } else {
          title = item?.title;
        }
        return (
          <div className={item.is_cancelled === 1 ? 'table-row-disabled' : ''}>
            <a
              style={{
                color:
                  item.is_cancelled === 1 ? 'rgba(105, 103, 103, 0.45)' : '',
              }}
              onClick={() => {
                setCurrentRow(item);
                history.push({
                  pathname: '/campaigns/'.concat(`${item.id}`),
                });
              }}
            >
              {title}
            </a>
            {item?.messages_invalid_count > 0 ? (
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
        <FormattedMessage id="campaign.progress" defaultMessage="Tiến độ" />
      ),
      key: 'progress',
      render(_, record) {
        console.log({ record });
        return (
          <div style={{ display: 'flex' }}>
            <div
              style={{
                minWidth: record.status === 7 ? 'calc(120px + 2em + 4px)' : 120,
              }}
            >
              <Progress
                className={record.status === 7 ? '' : 'progress-incomming'}
                percent={record.percentage_of_process}
                success={
                  record.status === 7
                    ? {}
                    : {
                        percent:
                          record.status === 6
                            ? record.percentage_of_process
                            : record.invalid_percentage_of_process,
                        strokeColor: '#BFBFBF',
                      }
                }
                status={
                  record.status === 7
                    ? 'exception'
                    : record.status === 5
                    ? 'success'
                    : 'active'
                }
                showInfo={record.status === 7}
                size={'small'}
              />
            </div>
            {record.status <= 6 && (
              <div
                style={{
                  marginLeft: 8,
                  lineHeight: 1.8,
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {record.messages_delivered_count +
                    record.messages_invalid_count}
                  /{record.messages_count}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="campaign.sending.time"
          defaultMessage="Thời gian gửi"
        />
      ),
      dataIndex: 'scheduled_at',
      key: 'scheduled_at',
      render(dom, item) {
        return (
          <span className={item.is_cancelled === 1 ? 'table-row-disabled' : ''}>
            {FormattedDateTime(item.scheduled_at)}
          </span>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="campaign.creation.time"
          defaultMessage="Thời gian tạo"
        />
      ),
      key: 'created_at',
      render(dom, item) {
        let fullName: any = item?.created_by?.full_name;
        if (fullName?.length > 15) {
          fullName = fullName.slice(0, 15).concat('...');
        } else {
          fullName = item?.created_by?.full_name;
        }
        return (
          <div className={item.is_cancelled === 1 ? 'table-row-disabled' : ''}>
            {FormattedDateTime(item.created_at)}
            <p className="c4 mb-0">
              <span className="sub-title">
                {intl.formatMessage({ id: 'by' })} {item?.created_by?.full_name}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="campaign.approve" defaultMessage="Duyệt" />,
      key: 'approve',
      hideInTable:
        showApproval.campaignAutoApprove ||
        (!showApproval.campaignAutoApprove && !access.canCampaignsApprove),
      align: 'center',
      render: (_, record, index) => [
        <div key={index} className="flex-center">
          {record.status === 2 && access.canCampaignsApprove() && (
            <Button
              style={{ borderRadius: '30px' }}
              type="primary"
              key="approve"
              onClick={() => {
                setCurrentRow(record);
                handleUpdateModalVisible(true);
              }}
            >
              {intl.formatMessage({
                id: 'action.button.accept',
                defaultMessage: 'Chấp nhận',
              })}
            </Button>
          )}
        </div>,
      ],
    },
    {
      title: <FormattedMessage id="account.action" defaultMessage="Thao tác" />,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <div className={styles.styeRowAction}>
              {access.canCampaignsUpdate() && (
                <>
                  <div>
                    <Tooltip
                      placement="top"
                      title={intl.formatMessage({
                        id: 'campaign.tip.title.update',
                        defaultMessage: 'Cập nhật chiến dịch',
                      })}
                    >
                      <Button
                        className="pa-0"
                        type="link"
                        onClick={() => {
                          history.push({
                            pathname: `${'/campaigns/:id/edit'}`.replace(
                              ':id',
                              record.id,
                            ),
                          });
                        }}
                      >
                        <EditOutlined style={{ color: '#8C8C8C' }} />
                      </Button>
                    </Tooltip>
                  </div>
                  <Divider type="vertical" />
                </>
              )}
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
              <Divider type="vertical" />
              {access.canCampaignsCancel() && (
                <div>
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'action.button.cancel.campaign',
                      defaultMessage: 'Hủy chiến dịch',
                    })}
                    description={intl.formatMessage({
                      id: 'campaign.tip.content.cancel',
                      defaultMessage:
                        'Bạn có chắc chắn muốn hủy chiến dịch này không?',
                    })}
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={async () => {
                      await handleCancelCampaign(record?.id);
                      actionRef.current?.reloadAndRest?.();
                    }}
                    okText={intl.formatMessage({
                      id: 'action.ok',
                      defaultMessage: 'Có',
                    })}
                    cancelText={intl.formatMessage({
                      id: 'action.no',
                      defaultMessage: 'Không',
                    })}
                  >
                    <Tooltip
                      placement="top"
                      title={intl.formatMessage({
                        id: 'action.button.cancel.campaign',
                        defaultMessage: 'Hủy chiến dịch',
                      })}
                    >
                      <Button className="pa-0" type="text" danger key="delete">
                        <CloseCircleOutlined style={{ color: 'red' }} />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              )}
            </div>
          );
        }
        //Chờ duyệt
        if (record.status === 2) {
          return (
            <div
              className={
                access.canCampaignsCancel()
                  ? styles.styeRowAction
                  : styles.flex__end
              }
            >
              {access.canCampaignsUpdate() && (
                <>
                  <div>
                    <Tooltip
                      placement="top"
                      title={intl.formatMessage({
                        id: 'campaign.tip.title.update',
                        defaultMessage: 'Cập nhật chiến dịch',
                      })}
                    >
                      <Button
                        className="pa-0"
                        type="link"
                        onClick={() => {
                          history.push({
                            pathname: `${'/campaigns/:id/edit'}`.replace(
                              ':id',
                              record.id,
                            ),
                          });
                        }}
                      >
                        <EditOutlined style={{ color: '#8C8C8C' }} />
                      </Button>
                    </Tooltip>
                  </div>
                  <Divider type="vertical" />
                </>
              )}
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
              {access.canCampaignsCancel() && (
                <>
                  <Divider type="vertical" />
                  <div>
                    <Popconfirm
                      title={intl.formatMessage({
                        id: 'action.button.cancel.campaign',
                        defaultMessage: 'Hủy chiến dịch',
                      })}
                      description={intl.formatMessage({
                        id: 'campaign.tip.content.cancel',
                        defaultMessage:
                          'Bạn có chắc chắn muốn hủy chiến dịch này không?',
                      })}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={async () => {
                        await handleCancelCampaign(record?.id);
                        actionRef.current?.reloadAndRest?.();
                      }}
                      okText={intl.formatMessage({
                        id: 'action.ok',
                        defaultMessage: 'Có',
                      })}
                      cancelText={intl.formatMessage({
                        id: 'action.no',
                        defaultMessage: 'Không',
                      })}
                    >
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({
                          id: 'action.button.cancel.campaign',
                          defaultMessage: 'Hủy chiến dịch',
                        })}
                      >
                        <Button
                          className="pa-0"
                          type="text"
                          danger
                          key="delete"
                        >
                          <CloseCircleOutlined style={{ color: 'red' }} />
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </>
              )}
            </div>
          );
        }
        //Chờ gửi
        if (record.status === 3) {
          return (
            <div
              className={
                access.canCampaignsCancel() &&
                iShowUpdateByTime(record.scheduled_at)
                  ? styles.styeRowAction
                  : styles.flex__end
              }
            >
              {access.canCampaignsUpdate() &&
                iShowUpdateByTime(record.scheduled_at) && (
                  <>
                    <div>
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({
                          id: 'campaign.tip.title.update',
                          defaultMessage: 'Cập nhật chiến dịch',
                        })}
                      >
                        <Button
                          className="pa-0"
                          type="link"
                          onClick={() => {
                            history.push({
                              pathname: `${'/campaigns/:id/edit'}`.replace(
                                ':id',
                                record.id,
                              ),
                            });
                          }}
                        >
                          <EditOutlined style={{ color: '#8C8C8C' }} />
                        </Button>
                      </Tooltip>
                    </div>
                    <Divider type="vertical" />
                  </>
                )}
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
              {access.canCampaignsCancel() && (
                <>
                  <Divider type="vertical" />
                  <div>
                    <Popconfirm
                      title={intl.formatMessage({
                        id: 'action.button.cancel.campaign',
                        defaultMessage: 'Hủy chiến dịch',
                      })}
                      description={intl.formatMessage({
                        id: 'campaign.tip.content.cancel',
                        defaultMessage:
                          'Bạn có chắc chắn muốn hủy chiến dịch này không?',
                      })}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={async () => {
                        await handleCancelCampaign(record?.id);
                        actionRef.current?.reloadAndRest?.();
                      }}
                      okText={intl.formatMessage({
                        id: 'action.ok',
                        defaultMessage: 'Có',
                      })}
                      cancelText={intl.formatMessage({
                        id: 'action.no',
                        defaultMessage: 'Không',
                      })}
                    >
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({
                          id: 'action.button.cancel.campaign',
                          defaultMessage: 'Hủy chiến dịch',
                        })}
                      >
                        <Button
                          className="pa-0"
                          type="text"
                          danger
                          key="delete"
                        >
                          <CloseCircleOutlined style={{ color: 'red' }} />
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </>
              )}
            </div>
          );
        }
        //Đang chạy
        if (record.status === 4) {
          return (
            <div
              className={
                access.canCampaignsCancel()
                  ? styles.styeRowAction
                  : styles.flex__end
              }
              style={{
                paddingLeft: '2rem',
              }}
            >
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
              {access.canCampaignsCancel() && (
                <>
                  <Divider type="vertical" />
                  <div>
                    <Popconfirm
                      title={intl.formatMessage({
                        id: 'action.button.cancel.campaign',
                        defaultMessage: 'Hủy chiến dịch',
                      })}
                      description={intl.formatMessage({
                        id: 'campaign.tip.content.cancel',
                        defaultMessage:
                          'Bạn có chắc chắn muốn hủy chiến dịch này không?',
                      })}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={async () => {
                        await handleCancelCampaign(record?.id);
                        actionRef.current?.reloadAndRest?.();
                      }}
                      okText={intl.formatMessage({
                        id: 'action.ok',
                        defaultMessage: 'Có',
                      })}
                      cancelText={intl.formatMessage({
                        id: 'action.no',
                        defaultMessage: 'Không',
                      })}
                    >
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({
                          id: 'action.button.cancel.campaign',
                          defaultMessage: 'Hủy chiến dịch',
                        })}
                      >
                        <Button
                          className="pa-0"
                          type="text"
                          danger
                          key="delete"
                        >
                          <CloseCircleOutlined style={{ color: 'red' }} />
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </>
              )}
            </div>
          );
        }
        //Hoàn thành
        if (record.status === 5) {
          return (
            <div
              className={
                access.canCampaignsCancel()
                  ? styles.styeRowAction
                  : styles.flex__end
              }
            >
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          );
        }
        //Hủy
        if (record.status === 6) {
          return (
            <div
              className={
                access.canCampaignsCancel()
                  ? styles.styeRowAction
                  : styles.flex__end
              }
            >
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          );
        }
        //Lỗi
        if (record.status === 7) {
          return (
            <div
              className={
                access.canCampaignsCancel()
                  ? styles.styeRowAction
                  : styles.flex__end
              }
            >
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'campaign.tip.title.info',
                    defaultMessage: 'Xem thông tin chiến dịch',
                  })}
                >
                  <Button
                    className="pa-0"
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: `${'/campaigns/:id'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EyeOutlined style={{ color: '#8C8C8C' }} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          );
        }
      },
    },
    {
      title: '',
      key: 'option',
      valueType: 'option',
      align: 'center',
      hideInTable: !access.canCampaignsDestroy,
      render: (_, record) => {
        return (
          <div>
            <RenderActionRemoveCampaign record={record} />
          </div>
        );
      },
    },
  ];

  if (!access.canCampaignsIndex) return <NoPermissionPage />;

  return (
    <>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <NavLink to="/campaigns/list">
                {intl.formatMessage({
                  id: 'campaign.management',
                  defaultMessage: 'Quản lý chiến dịch',
                })}
              </NavLink>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <li>
              <span>
                {intl.formatMessage({
                  id: 'campaign.list',
                  defaultMessage: 'Danh sách chiến dịch',
                })}
              </span>
            </li>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({
                id: 'campaign.list',
                defaultMessage: 'Danh sách chiến dịch',
              })}
            </span>
          </div>
        </div>
      </div>

      <div>
        <FilterForm
          onParamChange={handleParamChange}
          listCampaignStatus={listCampaignStatus}
        />
      </div>

      <div className="ph-24">
        <ProTable<API_CAMPAIGN.CurrentCampaign, API_CAMPAIGN.PageParams>
          columns={columns}
          actionRef={actionRef}
          params={params}
          search={false}
          options={{
            density: false,
          }}
          defaultSize={'small'}
          columnEmptyText={''}
          toolBarRender={() => [
            <>
              {access.canCampaignsStore() ? (
                <Button
                  type="primary"
                  key="primary"
                  onClick={() => {
                    history.push({
                      pathname: `${'/campaigns/create'}`,
                    });
                  }}
                >
                  <PlusOutlined />{' '}
                  <FormattedMessage
                    id="account.btn.add"
                    defaultMessage="Thêm mới"
                  />
                </Button>
              ) : null}
            </>,
          ]}
          request={(params, filter) => fetchAllCampaign(params, filter)}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} of ${total} items`,
          }}
        />

        <ApproveForm
          onSubmit={async value => {
            const param = {
              scheduled_at: value?.scheduled_at,
            };
            const result = await approveCampaignById(param, value?.id);
            if (result.success === true) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
              message.success(
                `${intl.formatMessage({
                  id: 'campaign.message.approve.success',
                })}`,
              );
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
    </>
  );
};

export default TableList;
