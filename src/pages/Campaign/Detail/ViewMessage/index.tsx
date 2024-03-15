/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import colors from '@/commons/colors';
import FormattedDateTime from '@/components/Common/FormattedDateTime';
import useMaskedPhone from '@/hooks/useMaskedPhone';
import { getCampaignMessagesById } from '@/services/campaign';
import { CheckOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from '@umijs/max';
import { Badge, Tooltip } from 'antd';
import { Fragment, useRef, useState } from 'react';
import { FormattedMessage, useAccess, useIntl } from 'umi';

function ViewMessages(props: any) {
  const access = useAccess();

  //init state
  const { initialState } = useModel('@@initialState');
  //list sms status
  const listSmsStatus = initialState?.configs?.sms_status;

  const actionRef = useRef<ActionType>();

  /** cấu hình language */
  const intl = useIntl();

  const [params, setParams] = useState(undefined);
  const handleParamChange = (newValue: any) => {
    setParams(newValue);
  };

  const [totalListCampaign, setTotalListCampaign] = useState<any>();

  const columns: ProColumns<API_CAMPAIGN.CurrentCampaignMesages>[] = [
    {
      title: 'STT',
      key: 'index',
      hideInSearch: true,
      width: '5%',
      render: (_id, _record, index) => {
        return index + 1;
      },
    },

    {
      title: (
        <FormattedMessage
          id="account.phoneNumber"
          defaultMessage="Số điện thoại"
        />
      ),
      key: 'recipent',
      width: '10%',
      render: (dom, item) => {
        return <div>{useMaskedPhone(item.recipent)}</div>;
      },
    },
    {
      title: (
        <FormattedMessage id="campaign.status" defaultMessage="Trạng thái" />
      ),
      key: 'status',
      dataIndex: 'status',
      width: '10%',
      filters: listSmsStatus?.map((item: any) => {
        return {
          text: `${intl.formatMessage({
            id: 'sms.status.'.concat(item.value),
          })}`,
          value: item.value,
        };
      }),
      onFilter: true,
      render(dom, item) {
        if (item.status === 1) {
          return (
            <div className="">
              <Badge className="mr-6" color={colors.PURPLE} />
              {intl.formatMessage({
                id: 'sms.status.1',
              })}
            </div>
          );
        }
        if (item.status === 2) {
          return (
            <div className="">
              <Badge className="mr-6" color={colors.BLUE} />
              {intl.formatMessage({
                id: 'sms.status.2',
              })}
            </div>
          );
        }
        if (item.status === 3) {
          return (
            <div className="">
              {/* <Badge className="mr-6" color={colors.GREEN} />
              {intl.formatMessage({
                id: 'sms.status.3',
              })} */}
              <span style={{ color: colors.GREEN }}>
                <CheckOutlined />
              </span>{' '}
              {intl.formatMessage({
                id: 'sms.status.3',
                defaultMessage: 'Hoàn thành',
              })}
            </div>
          );
        }
        if (item.status === 4) {
          return (
            <div className="">
              <Badge className="mr-6" color={colors.GRAY} />
              {intl.formatMessage({
                id: 'sms.status.4',
              })}
            </div>
          );
        }
      },
    },

    {
      title: <FormattedMessage id="label.telco'" defaultMessage="Nhà mạng" />,
      key: 'telco',
      width: '10%',
      render(dom, item) {
        return (
          <div>
            {intl.formatMessage({ id: 'telco.'.concat(`${item.telco}`) })}
          </div>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="message.content"
          defaultMessage="Nội dung tin nhắn"
        />
      ),
      dataIndex: 'text',
      key: 'text',
      render(dom, item) {
        let str: any = item && item?.text;
        let replaced = str.replace(/[0-9]/g, '*');
        if (replaced.length > 90) {
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              <Tooltip placement="top" title={`${str}`}>
                {replaced.slice(0, 90).concat('...')}
              </Tooltip>
            </div>
          );
        } else {
          return <div>{replaced}</div>;
        }
      },
    },

    {
      title: (
        <FormattedMessage
          id="campaign.sending.time"
          defaultMessage="Thời gian gửi"
        />
      ),
      dataIndex: 'delivered_at',
      key: 'delivered_at',
      align: 'right',
      width: '10%',
      render(dom, item) {
        return (
          <div>
            {item &&
              item?.delivered_at &&
              FormattedDateTime(item?.delivered_at)}
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <ProTable<API_CAMPAIGN.CurrentCampaignMesages, API_CAMPAIGN.PageParams>
        columns={columns}
        actionRef={actionRef}
        rowKey={record => String(record.id)}
        params={params}
        search={false}
        options={false}
        request={async (params = {}) => {
          return await getCampaignMessagesById({
            current: params.current,
            pageSize: params.pageSize,
            id: props?.id_campaign,
          });
        }}
        pagination={{
          responsive: true,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
        }}
      />
    </Fragment>
  );
}

export default ViewMessages;
