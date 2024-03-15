import colors from '@/commons/colors';
import FormattedDateTime from '@/components/Common/FormattedDateTime';
import FptIcon from '@/components/FptIcon';
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, history, useIntl } from '@umijs/max';
import { Button, Divider, Popconfirm, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import React, { Fragment, useRef, useState } from 'react';
import { fetchAllAccounts, removeAccount } from '../../services/account';
import FilterForm from './FilterForm';
import styles from './index.less';

const TableList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [params, setParams] = useState(undefined);

  const handleParamChange = (newValue: any) => {
    setParams(newValue);
  };

  const handleRemove = async (_record?: number) => {
    if (!_record) return true;
    try {
      await removeAccount({
        key: _record,
      });
      message.success(
        `${intl.formatMessage({ id: 'account.action.delete.success' })}`,
      );
      return true;
    } catch (error) {
      message.error(
        `${intl.formatMessage({ id: 'account.action.delete.fail' })}`,
      );
      return false;
    }
  };

  const columns: ProColumns<API_ACCOUNT.CurrentAccount>[] = [
    {
      title: (
        <FormattedMessage id="account.login" defaultMessage="Tên đăng nhập" />
      ),
      key: 'username',
      dataIndex: 'username',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              history.push({
                pathname: '/accounts/'.concat(`${entity.id}`)
              });
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="account.display.name"
          defaultMessage="Tên hiển thị"
        />
      ),
      key: 'full_name',
      dataIndex: 'full_name',
    },
    {
      title: (
        <FormattedMessage id="account.type" defaultMessage="Loại tài khoản" />
      ),
      dataIndex: 'is_admin',
      key: 'is_admin',
      valueEnum: {
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
      },
    },
    {
      title: (
        <FormattedMessage id="account.status" defaultMessage="Trạng thái" />
      ),
      dataIndex: 'enabled',
      key: 'enabled',
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="account.status.inactive"
              defaultMessage="Chưa kích hoạt"
            />
          ),
          status: '0',
          color: 'rgb(128, 128, 128)',
        },
        1: {
          text: (
            <FormattedMessage
              id="account.status.active"
              defaultMessage="Đã kích hoạt"
            />
          ),
          status: '1',
          color: 'rgb(115, 202, 57)',
        },
      },
    },
    {
      title: <FormattedMessage id="account.phoneNumber" defaultMessage="SĐT" />,
      key: 'phone_number',
      dataIndex: 'phone_number',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="account.email" defaultMessage="Email" />,
      key: 'email',
      dataIndex: 'email',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage id="account.brandnames" defaultMessage="Brandnames" />
      ),
      key: 'brandnames',
      hideInSearch: true,
      hideInTable: true,
      render(dom, item) {
        return (
          <div>
            {item &&
              item.brandnames &&
              item.brandnames.map((el, index) => {
                return (
                  <Tag color="green" key={index}>
                    <span>{el?.name}</span>
                  </Tag>
                );
              })}
          </div>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="account.permissions"
          defaultMessage="Permissions"
        />
      ),
      key: 'permissions',
      hideInSearch: true,
      hideInTable: true,
      render(dom, item) {
        return (
          <div>
            {item &&
              item.permissions &&
              item.permissions.map((el, index) => {
                return (
                  <Tag color="green" key={index} className="mb-6">
                    <span>{el}</span>
                  </Tag>
                );
              })}
          </div>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="account.createdAt"
          defaultMessage="Thời gian tạo"
        />
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      hideInSearch: true,
      hideInTable: false,
      hideInForm: true,
      defaultSortOrder: 'descend',
      width: 160,
      render(dom, item) {
        return FormattedDateTime(item.created_at);
      },
    },
    {
      title: (
        <FormattedMessage
          id="account.createdAt"
          defaultMessage="Thời gian tạo"
        />
      ),
      key: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: [
          `${intl.formatMessage({ id: 'account.from.date' })}`,
          `${intl.formatMessage({ id: 'account.to.date' })}`,
        ],
      },
      search: {
        transform: value => {
          return {
            from: moment(value[0]).format('YY-MM-DD'),
            to: moment(value[1]).format('YY-MM-DD'),
          };
        },
      },
    },
    {
      title: <FormattedMessage id="account.action" defaultMessage="Thao tác" />,
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: 120,
      render: (_, record, index) => [
        <div key={index} className={styles.styeRowAction}>
          {record?.is_admin === 0 && (
            <>
              <div>
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'account.tip.title.update',
                    defaultMessage: 'Cập nhật tài khoản',
                  })}
                >
                  <Button
                    style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 4 }}
                    type="link"
                    disabled={record?.is_admin === 1}
                    onClick={() => {
                      history.push({
                        pathname: `${'/accounts/:id/edit'}`.replace(
                          ':id',
                          record.id,
                        ),
                      });
                    }}
                  >
                    <EditOutlined
                      style={{
                        color: record?.is_admin === 1 ? colors.GRAY : '#8C8C8C',
                      }}
                    />
                  </Button>
                </Tooltip>
              </div>
              <Divider type="vertical" />
            </>
          )}
          <div style={{ paddingLeft: record?.is_admin === 0 ? '' : '2.45rem' }}>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'account.tip.title.info',
                defaultMessage: 'Xem thông tin tài khoản',
              })}
            >
              <Button
                style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 4 }}
                type="link"
                onClick={() => {
                  history.push({
                    pathname: `${'/accounts/:id'}`.replace(':id', record.id),
                  });
                }}
              >
                <EyeOutlined style={{ color: '#8C8C8C' }} />
              </Button>
            </Tooltip>
          </div>
          {record?.is_admin === 0 && (
            <>
              <Divider type="vertical" />
              <div>
                <Popconfirm
                  disabled={record?.is_admin === 1}
                  title={intl.formatMessage({
                    id: 'account.tip.title.delete',
                    defaultMessage: 'Xóa tài khoản',
                  })}
                  description={intl.formatMessage({
                    id: 'account.tip.content.delete',
                    defaultMessage: 'Bạn có chắc chắn xóa tài khoản này không?',
                  })}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={async () => {
                    await handleRemove(record?.id);
                    actionRef.current?.reloadAndRest?.();
                  }}
                  okText={intl.formatMessage({
                    id: 'account.action.ok',
                    defaultMessage: 'Có',
                  })}
                  cancelText={intl.formatMessage({
                    id: 'account.action.no',
                    defaultMessage: 'Không',
                  })}
                >
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                      id: 'account.tip.title.delete',
                      defaultMessage: 'Xóa tài khoản',
                    })}
                  >
                    <Button
                      style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 4 }}
                      type="text"
                      danger
                      key="delete"
                      disabled={record?.is_admin === 1}
                    >
                      <FptIcon
                        icon="zt_delete"
                        size={15}
                        color={
                          record?.is_admin === 1 ? colors.GRAY : colors.RED
                        }
                      />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </div>
            </>
          )}
        </div>,
      ],
    },
  ];

  return (
    <>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <a href="/accounts/list">
                {intl.formatMessage({
                  id: 'account',
                  defaultMessage: 'Tài khoản',
                })}
              </a>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <li>
              <span>
                {intl.formatMessage({
                  id: 'account.lable.list',
                  defaultMessage: 'Danh sách tài khoản',
                })}
              </span>
            </li>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'account.lable.list' })}
            </span>
          </div>
        </div>
      </div>

      <div>
        <FilterForm onParamChange={handleParamChange} />
      </div>

      <div className="ph-24">
        <Fragment>
          <ProTable<API_ACCOUNT.CurrentAccount, API_ACCOUNT.PageParams>
            columns={columns}
            actionRef={actionRef}
            rowKey={record => String(record.id)}
            params={params}
            search={false}
            options={{
              density: false,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  history.push({
                    pathname: `${'/accounts/create'}`,
                  });
                  // handleModalVisible(true);
                }}
              >
                <PlusOutlined />{' '}
                <FormattedMessage
                  id="account.btn.add"
                  defaultMessage="Thêm mới"
                />
              </Button>,
            ]}
            request={(params, filter) => fetchAllAccounts(params, filter)}
            pagination={{
              responsive: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]} - ${range[1]} of ${total} items`,
            }}
          />
        </Fragment>
      </div>
    </>
  );
};

export default TableList;
