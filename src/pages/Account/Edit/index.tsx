/* eslint-disable @typescript-eslint/no-unused-vars */
import NoPermissionPage from '@/pages/NoPermisson';
import { currentAccount as getAccountById } from '@/services/account';
import { useModel } from '@umijs/max';
import { Avatar, Col, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useParams } from 'umi';
import ErrorPageEdit from './ErrorPageEdit';
import UpdateAccountForm from './UpdateAccountForm';
import styles from './index.less';

export default function PageAccountDetail() {
  /** cấu hình language */
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const { id } = initialState?.currentUser || {};

  const params = useParams();

  const [currentAccount, setCurrentAccount] =
    useState<API_ACCOUNT.CurrentAccount>();

  useEffect(() => {
    const fetchAccount = async () => {
      const result = await getAccountById(params);
      setCurrentAccount(result?.data);
    };
    fetchAccount().catch(console.error);
  }, []);

  if (params.id === `${id}`) return <ErrorPageEdit />;
  if (currentAccount?.is_admin === 1) return <NoPermissionPage />;
  return (
    <div>
      <div className={styles.my_container_header}>
        <nav className={styles.my_breadcrumb}>
          <ol>
            <li>
              <a href="/accounts">
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
              <a href="/accounts/list">
                {intl.formatMessage({
                  id: 'account.lable.list',
                  defaultMessage: 'Danh sách tài khoản',
                })}{' '}
              </a>
            </li>
            <li className={styles.my_breadcrumbSeparator} aria-hidden="true">
              /
            </li>
            <li>
              <span>
                {intl.formatMessage({
                  id: 'account.details',
                  defaultMessage: 'Chi tiết tài khoản',
                })}
              </span>
            </li>
          </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'account.details' })}
            </span>
          </div>
        </div>

        <div>
          <Row gutter={[16, 16]} className={styles.my_headerContent}>
            <Col xs={24} sm={12} md={12} lg={12} xl={8}>
              <Row justify="start" align="middle" gutter={[24, 24]}>
                <Col>
                  <Avatar
                    className="mb-10"
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 72, xxl: 72 }}
                    src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                  ></Avatar>
                </Col>
                <Col>
                  <p className="c1 b">
                    {currentAccount && currentAccount?.full_name}
                  </p>
                  <p className="c3 sub-title">
                    {currentAccount && currentAccount?.username}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      <div className="pa-24">
        <Row className={styles.my_card}>
          <Col span={24} className="pa-24">
            <Typography.Text strong>
              {intl.formatMessage({
                id: 'account.info',
                defaultMessage: 'Thông tin tài khoản',
              })}
            </Typography.Text>
          </Col>

          <Col span={24}>
            {currentAccount && (
              <UpdateAccountForm
                currentAccount={currentAccount}
                setCurrentAccount={setCurrentAccount}
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
