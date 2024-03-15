import { useFormatNumber as formatNumber } from '@/hooks/useFormatNumber';
import NoPermissionPage from '@/pages/NoPermisson';
import { fetchAllBusinessNumber } from '@/services/MT/subscription';
import {
  ActionType,
  PageContainer,
  ProColumns,
} from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Fragment, useEffect, useRef, useState } from 'react';
import Date from './Date';
import Syntax from './Syntax';

export default function Page() {
  const access = useAccess();

  const { initialState } = useModel('@@initialState');

  const LIST_TELCO = initialState?.configs.telcos;

  const [listBussinessNumber, setListBussinessNumber] = useState<any>([]);

  const [activeKey, setActiveKey] = useState('date');

  const actionRef = useRef<ActionType>();

  const fetchAllBusinessNumberFormat = async () => {
    try {
      const response = await fetchAllBusinessNumber();
      if (response.success) {
        const transformedData = response.data.map((item: any) => ({
          label: item.text,
          value: item.items.map((subItem: any) => subItem.id).toString(),
        }));
        transformedData.unshift({
          label: 'All',
          value: '',
        });
        setListBussinessNumber(transformedData);
      }
    } catch (error) {
      console.log('Error fetching telco data:', error);
    }
  };

  const columns: ProColumns<API_MTREPORT.Report>[] = [
    {
      title: 'Nhà mạng',
      dataIndex: 'telco',
      key: 'telco',
      valueType: 'text',
      align: 'left',
      render: telco => (
        <span style={{ color: '#1890FF' }}>
          {LIST_TELCO.find((item: any) => item.value === telco)?.label}
        </span>
      ),
    },
    {
      title: 'Đầu số',
      // dataIndex: 'mo_business_number',
      key: 'business_number',
      valueType: 'text',
      align: 'left',
      render: (dom, item) => <span>{item?.mo_business_number}</span>,
    },

    {
      title: 'MO',
      dataIndex: 'mo_sms_count',
      key: 'mo_sms_count',
      valueType: 'text',
      align: 'right',
      render: value => formatNumber(value),
    },

    {
      title: 'CDR',
      dataIndex: 'mt_cdr_count',
      key: 'mt_cdr_count',
      valueType: 'text',
      align: 'right',
      render: value => formatNumber(value),
    },

    {
      title: 'MT',
      dataIndex: 'mt_sms_count',
      key: 'mt_sms_count',
      valueType: 'text',
      align: 'right',
      render: value => formatNumber(value),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      valueType: 'text',
      align: 'right',
      render: value => formatNumber(value),
    },
  ];

  if (activeKey === 'date') {
    columns.unshift({
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      valueType: 'text',
      align: 'left',
      render: (text, record) => {
        if (!record.children) {
          return '';
        } else {
          return text;
        }
      },
    });
  } else {
    columns.unshift({
      title: 'Cú pháp',
      dataIndex: 'mo_syntax',
      key: 'mo_syntax',
      valueType: 'text',
      align: 'left',
      render: (text, record) => {
        if (!record.children) {
          return ' ';
        } else {
          return text;
        }
      },
    });
  }

  useEffect(() => {
    fetchAllBusinessNumberFormat();
  }, []);

  if (!access.canMtReportsIndex) return <NoPermissionPage />;

  return (
    <Fragment>
      <PageContainer
        onTabChange={function (activeKey) {
          setActiveKey(activeKey);
        }}
        tabList={[
          {
            tab: 'Theo ngày',
            key: 'date',
          },
          {
            tab: 'Theo cú pháp',
            key: 'mo_syntax',
          },
        ]}
      >
        {activeKey === 'date' ? (
          <Date
            actionRef={actionRef}
            columns={columns}
            listBussinessNumber={listBussinessNumber}
            activeKey={activeKey}
          />
        ) : (
          <Syntax
            actionRef={actionRef}
            columns={columns}
            listBussinessNumber={listBussinessNumber}
            activeKey={activeKey}
          />
        )}
      </PageContainer>
    </Fragment>
  );
}
