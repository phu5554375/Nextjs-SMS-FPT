import {
  DownCircleOutlined,
  InfoCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Col, Input, Row, message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { Fragment, useEffect, useState } from 'react';
import ChangeViewTable from '../ChangeViewTable';
import ExportButton from '../ExportButton';
import Modal from '../Modal';

type ViewTableProps = {
  columns: any;
  keyTable: string;
  pagination?: boolean;
  actionRef: any;
  search?: boolean;
  headerTitle?: string;
  rowKey: string;
  rowSelection?: any;
  params: any;
  scroll: any;
  isExpanded?: boolean;
  sendData?: (values: any) => void;
  requestData: (
    params: any,
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<any>;
  handleExport: (
    params: any,
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<any>;
};

const ViewTable: React.FC<ViewTableProps> = ({
  columns,
  keyTable,
  pagination = false,
  actionRef,
  search = false,
  headerTitle = '',
  rowKey,
  rowSelection = null,
  params,
  isExpanded = false,
  scroll,
  sendData,
  requestData,
  handleExport,
}: any) => {
  const [data, setData] = useState<any | undefined>([]);

  const [expandRowKey, setExpandRowKey] = useState<any>([]);

  const [isExpandBy, setIsExpandBy] = useState<string>('list');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [fileName, setFileName] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsLoading(false);
  };

  const handleRequestExport = async () => {
    try {
      const response = await handleExport(fileName);

      if (response.success) {
        if (response.data.redirect) {
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

          setFileName('');
        }
      }
    } catch (error) {
      message.error('Export failed');
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

  useEffect(() => {
    if (isExpandBy === 'list') {
      const expandKey: any = data?.map((items: any) => items.key);
      setExpandRowKey(expandKey);
    } else {
      setExpandRowKey([]);
    }
  }, [isExpandBy]);

  const onSelectRow = (record: any) => {
    const rowKey = record.key;
    const newExpandedRowKeys = [...expandRowKey];
    const index = newExpandedRowKeys.indexOf(rowKey);
    if (index === -1) {
      newExpandedRowKeys.push(rowKey);
    } else {
      newExpandedRowKeys.splice(index, 1);
    }
    setExpandRowKey(newExpandedRowKeys);
  };

  const onSelectionChange = (value: any) => {
    setIsExpandBy(value);
  };

  const onExportAction = () => {
    handleOpenModal();
  };

  const handleRequest = async (
    params: any,
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>,
  ) => {
    const response = await requestData(params, sort, filter);

    if (response && response.success) {
      if (sendData && typeof sendData === 'function') {
        sendData(response.data);
      }

      if (Array.isArray(response.data)) {
        setData(response.data);
        return { data: response.data };
      } else {
        setData(response.data.items);
        return { data: response.data.items };
      }
    }
    return { data: [] };
  };

  return (
    <Fragment>
      <ProTable<any>
        key={keyTable}
        headerTitle={headerTitle}
        columns={columns}
        search={search}
        actionRef={actionRef}
        pagination={pagination}
        params={params}
        rowKey={rowKey}
        request={async (
          params: any,
          sort: Record<string, SortOrder>,
          filter: Record<string, (string | number)[] | null>,
        ) => handleRequest(params, sort, filter)}
        rowSelection={
          rowSelection === false
            ? rowSelection
            : {
              ...rowSelection,
              getCheckboxProps: record => ({
                disabled: !record.children,
                style: { display: record.children ? '' : 'none' },
              }),
            }
        }
        scroll={scroll}
        expandable={{
          defaultExpandAllRows: true,
          expandRowByClick: true,
          expandedRowKeys: expandRowKey,
          expandIcon: ({ expanded, onExpand, record }) => {
            const hasChildren = record.children && record.children.length > 0;
            return hasChildren ? (
              expanded ? (
                <DownCircleOutlined
                  className="mr-24"
                  onClick={e => onExpand(record, e)}
                />
              ) : (
                <RightCircleOutlined
                  className="mr-24"
                  onClick={e => onExpand(record, e)}
                />
              )
            ) : (
              <span className="mr-24"></span>
            );
          },
        }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          <ExportButton key="button" onExportAction={onExportAction} />,
          isExpanded ? (
            <ChangeViewTable
              key="select"
              onSelectionChange={onSelectionChange}
            />
          ) : (
            ''
          ),
        ]}
        rowClassName={(record: any) => {
          if (!isExpanded) {
            return 'table-row-light';
          } else {
            return record.children ? 'table-row-light' : 'table-row-blue';
          }
        }}
        tableAlertRender={false}
        tableAlertOptionRender={() => null}
        onRow={record => ({
          onClick: () => onSelectRow(record),
        })}
      />
      <Modal
        icons={<InfoCircleOutlined />}
        visible={isModalOpen}
        onClose={handleCloseModal}
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
  );
};

export default ViewTable;
