import colors from '@/commons/colors';
import FormattedDateTime from '@/components/Common/FormattedDateTime';
import {
  DeleteFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
  QuestionCircleOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, NavLink, useIntl, useModel } from '@umijs/max';
import { Badge, Button, Popconfirm, Row, Tooltip, message } from 'antd';
import cls from 'classnames';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  deleteExportFile,
  downloadExportFile,
  fetchAllFileExport,
} from '../../services/file';
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
  const { initialState } = useModel('@@initialState');
  const { is_admin } = initialState?.currentUser || {};

  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [params, setParams] = useState(undefined);
  const handleParamChange = (newValue: any) => {
    setParams(newValue);
  };

  const handleDownload = async (record: any) => {
    try {
      const result = await downloadExportFile(record?.path_hash);
      if (result.success === true) {
        let url = result?.data?.download_link;
        let a = document.createElement('a');
        let name = record?.name.replaceAll(' ', '_');
        a.href = url;
        a.download = name;
        a.click();
      } else {
        message.error(`${intl.formatMessage({ id: 'error.file.download' })}`);
      }
    } catch (error) {
      message.error(`${intl.formatMessage({ id: 'error.file.download' })}`);
    }
  };

  const handleRemove = async (record: any) => {
    if (!record?.path_hash) return true;
    try {
      await waitTime(1000);
      const result = await deleteExportFile(record?.path_hash);
      if (result.success) {
        message.success(
          `${intl.formatMessage({ id: 'lookup.action.delete.success' })}`,
        );
        return true;
      }
    } catch (error) {
      message.error(
        `${intl.formatMessage({ id: 'lookup.action.delete.fail' })}`,
      );
      return false;
    }
  };

  const getTimeAgo = (time: any) => {
    const momentTime = moment(time);
    const now = moment();

    let interval = momentTime.diff(now, 'days');
    if (interval > 0) {
      return `${intl.formatMessage({ id: 'expires.later' })}`
        .concat(' ')
        .concat(`${Math.floor(interval)}`)
        .concat(' ')
        .concat(`${intl.formatMessage({ id: 'date of storage' })}`);
    }
  };

  const columns: ProColumns<API_FILES.CurrentFile>[] = [
    {
      title: <FormattedMessage id="name.file" defaultMessage="Tên file" />,
      key: 'name',
      render: (_, item) => {
        let name: any = item?.name;
        if (name?.length > 70) {
          return name.slice(0, 70).concat('...');
        } else {
          return item?.name;
        }
      },
    },
    {
      title: <FormattedMessage id="export.data" defaultMessage="Dữ liệu" />,
      key: 'export_data',
      render: (_, item) => {
        return (
          <div>
            {intl.formatMessage({ id: 'export.date.from' })} {item.from}{' '}
            {intl.formatMessage({ id: 'export.date.to.d' })} {item.to}
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="export.service" defaultMessage="Dịch vụ" />,
      key: 'module',
      dataIndex: 'module',
      render: dom => {
        return <div>{dom}</div>;
      },
    },
    {
      title: (
        <FormattedMessage id="account.status" defaultMessage="Trạng thái" />
      ),
      key: 'status',
      render(_, item) {
        let export_statuses: any = item.status;
        if (export_statuses === 0) {
          return (
            <div className="">
              <Badge className="mr-6" color={colors.GREEN} />
              {intl.formatMessage({
                id: 'export_status.0',
              })}
            </div>
          );
        }
        if (export_statuses === 1) {
          return (
            <div className="">
              <span className="mr-6">
                {' '}
                <LoadingOutlined style={{ color: colors.BLUE }} />
              </span>
              {intl.formatMessage({
                id: 'export_status.1',
              })}
            </div>
          );
        }
        if (export_statuses === 2) {
          return (
            <div className="">
              <Badge className="mr-6" color={colors.GREEN} />
              {intl.formatMessage({
                id: 'export_status.2',
              })}
              <p className={cls(styles.txtNowrap, 'sub-title mb-0')}>
                {getTimeAgo(item?.expired_at)}
              </p>
            </div>
          );
        }

        if (export_statuses === 3) {
          return (
            <div className="">
              <Badge className="mr-6" color={colors.RED} />
              <span style={{ color: 'black' }}>
                {intl.formatMessage({ id: 'export_status.3' })}
              </span>
            </div>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="export.date" defaultMessage="Ngày export" />,
      dataIndex: 'created_at',
      key: 'created_at',
      render(_, item) {
        return (
          <div>
            <p className="mb-0">{FormattedDateTime(item?.created_at)}</p>
            {is_admin === 1 && (
              <p className="c4 mb-0">
                <span className="sub-title">
                  {intl.formatMessage({ id: 'by' })} {item?.creator?.full_name}
                </span>
              </p>
            )}
          </div>
        );
      },
    },

    {
      title: <FormattedMessage id="account.action" defaultMessage="Thao tác" />,
      key: 'option',
      align: 'right',
      render: (_, record, index) => [
        <Row key={index} justify="space-between" className="float-r">
          {record.status === 2 && (
            <Button
              style={{ borderRadius: '30px' }}
              type="primary"
              onClick={() => handleDownload(record)}
            >
              <VerticalAlignBottomOutlined />
              {intl.formatMessage({
                id: 'download',
                defaultMessage: 'Tải về',
              })}
            </Button>
          )}

          <div>
            <Popconfirm
              title={intl.formatMessage({
                id: 'export.tip.title.delete',
                defaultMessage: 'Xóa file',
              })}
              description={intl.formatMessage({
                id: 'export.tip.content.delete',
                defaultMessage: 'Bạn có chắc chắn xóa file này không?',
              })}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={async () => {
                await handleRemove(record);
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
                  id: 'export.tip.title.delete',
                  defaultMessage: 'Xóa file',
                })}
              >
                <Button
                  style={{
                    paddingTop: 0,
                    paddingRight: 0,
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
        </Row>,
      ],
    },
  ];

  return (
    <div>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <NavLink to="#">
                {intl.formatMessage({
                  id: 'manage.export',
                  defaultMessage: 'Quản lý Export',
                })}
              </NavLink>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <li>
              <span>Export</span>
            </li>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'export' })}
            </span>
            <span style={{ color: 'darkgray', marginTop: '3px' }}>
              <Tooltip
                placement="top"
                title={intl.formatMessage({
                  id: 'tooltip.label.file.save.30',
                  defaultMessage:
                    'Chúng tôi lưu trữ file này trong 30 ngày, sau 30 ngày hệ thống tự động xóa',
                })}
              >
                <ExclamationCircleFilled />
              </Tooltip>
            </span>
          </div>
        </div>
      </div>

      <div>
        <FilterForm onParamChange={handleParamChange} />
      </div>

      <div className="ph-24">
        <ProTable<API_FILES.CurrentFile, API_FILES.PageParams>
          headerTitle={
            <>
              {intl.formatMessage({
                id: 'export.list',
                defaultMessage: 'dữ liệu được tìm thấy',
              })}
            </>
          }
          columns={columns}
          actionRef={actionRef}
          rowKey={record => String(record.id)}
          params={params}
          search={false}
          options={false}
          request={(params, filter) => fetchAllFileExport(params, filter)}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} of ${total} items`,
          }}
        />
      </div>
    </div>
  );
};

export default TableList;
