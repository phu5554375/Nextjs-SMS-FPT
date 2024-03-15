import NoPermissionPage from '@/pages/NoPermisson';
import { PageContainer } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Fragment, useState } from 'react';
import Campaign from './Campaign';
import Date from './Date';
import Month from './Month';
import OutOfCampaign from './OutOfCampaign';
import Telco from './Telco';

const TAB_LIST = [
  {
    tab: 'Theo nhà mạng',
    key: 'detail',
  },
  {
    tab: 'Theo ngày',
    key: 'date',
  },
  {
    tab: 'Theo tháng',
    key: 'month',
  },
  {
    tab: 'Chiến dịch',
    key: 'campaign',
  },
  {
    tab: 'Ngoài chiến dịch',
    key: 'out_of_campaign',
  },
];

const Page = () => {
  const access = useAccess();

  const [activeTabKey, setActiveTabKey] = useState('detail');

  const handleTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  const renderContent = () => {
    switch (activeTabKey) {
      case 'detail':
        return <Telco />;
      case 'date':
        return <Date />;
      case 'month':
        return <Month />;
      case 'campaign':
        return <Campaign />;
      case 'out_of_campaign':
        return <OutOfCampaign />;
      default:
        return <Telco />;
    }
  };

  if (!access.canReportsIndex) return <NoPermissionPage />;

  return (
    <Fragment>
      <PageContainer
        onTabChange={handleTabChange}
        tabList={TAB_LIST}
      >
        {renderContent()}
      </PageContainer>
    </Fragment>
  );
};

export default Page;
