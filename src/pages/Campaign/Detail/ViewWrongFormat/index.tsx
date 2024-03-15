/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import useMaskedPhone from '@/hooks/useMaskedPhone';
import { getCampaignInvalidMessagesById } from '@/services/campaign';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage } from '@umijs/max';
import { Tooltip } from 'antd';
import { Fragment, useRef, useState } from 'react';

function ViewInvalidMessages(props: any) {
  const actionRef = useRef<ActionType>();

  const [params] = useState(undefined);

  const columns: ProColumns<API_CAMPAIGN.CurrentCampaignInvalidMesages>[] = [
    {
      title: 'STT',
      key: 'row',
      width: 60,
      // fixed: 'left',
      render: (dom, item) => {
        return item.row;
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
      width: 110,
      // fixed: 'left',
      render: (dom, item) => {
        return <div>{useMaskedPhone(`${item.recipent}`)}</div>;
      },
    },

    {
      title: (
        <FormattedMessage id="campaign.detail" defaultMessage="Chi tiết" />
      ),
      key: 'errors ',
      // width: 400,
      // fixed: 'left',
      render(dom, item) {
        return <div>{item && item?.errors}</div>;
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
        if (replaced.length > 50) {
          return (
            <div className="">
              <Tooltip placement="top" title={`${str}`}>
                {replaced.slice(0, 50).concat('...')}
              </Tooltip>
            </div>
          );
        } else {
          return <div>{replaced}</div>;
        }
      },
    },
  ];

  return (
    <Fragment>
      <ProTable<
        API_CAMPAIGN.CurrentCampaignInvalidMesages,
        API_CAMPAIGN.PageParams
      >
        columns={columns}
        actionRef={actionRef}
        rowKey={record => String(record.id)}
        params={params}
        search={false}
        options={false}
        request={async (params = {}) => {
          return await getCampaignInvalidMessagesById({
            current: params.current,
            pageSize: params.pageSize,
            id: props?.id_campaign,
          });
        }}
        // scroll={{ y:600}}
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

export default ViewInvalidMessages;
