/* eslint-disable @typescript-eslint/no-unused-vars */
import NoPermissionPage from '@/pages/NoPermisson';
import { getCampaignById } from '@/services/campaign';
import { NavLink, history, useAccess } from '@umijs/max';
import { Col, Row, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useIntl, useParams } from 'umi';
import EditCampaignForm from './EditCampaignForm';
import styles from './index.less';

const PageAccountDetail = (): any => {
  const access = useAccess();
  /** cấu hình language */
  const intl = useIntl();

  const params = useParams();

  const [currentCampaign, setCurrentCampaign] =
    useState<API_CAMPAIGN.CurrentCampaign>();

  useEffect(() => {
    const fetchCampaignById = async () => {
      const result = await getCampaignById(params);
      setCurrentCampaign(result?.data);
    };
    fetchCampaignById().catch(console.error);
  }, []);

  const linkDetailCampaign = `${'/campaigns/'.concat(
    `${currentCampaign?.id}`,
  )}`;

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

  if (!access.canCampaignsUpdate) return <NoPermissionPage />;

  if (
    currentCampaign?.status === 5 ||
    currentCampaign?.status === 6 ||
    currentCampaign?.status === 7 ||
    (currentCampaign?.status === 3 &&
      iShowUpdateByTime(currentCampaign?.scheduled_at) !== true)
  ) {
    message.error(`${intl.formatMessage({ id: 'campaign.cannot.edit' })}`);
    return history.push({
      pathname: `${'/campaigns/'}`.concat(currentCampaign?.id),
    });
  }
  return (
    <div>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <NavLink to={linkDetailCampaign}>
                {intl.formatMessage({
                  id: 'campaign',
                  defaultMessage: 'Chiến dịch',
                })}
              </NavLink>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <li>
              <span>
                <RenderTitle value={currentCampaign?.title} />
              </span>
            </li>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'campaign.update' })}
            </span>
          </div>
        </div>
      </div>

      <div className="pa-24">
        <Row className={styles.my_card}>
          <Col span={24} className="pa-24">
            <Typography.Text strong>
              {intl.formatMessage({
                id: 'campaign.information',
                defaultMessage: 'Thông tin chiến dịch',
              })}
            </Typography.Text>
          </Col>

          {currentCampaign && (
            <Col span={24}>
              <EditCampaignForm
                currentCampaign={currentCampaign}
                setCurrentCampaign={setCurrentCampaign}
              />
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default PageAccountDetail;
