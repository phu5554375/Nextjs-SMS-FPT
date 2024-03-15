import colors from '@/commons/colors';
import useMaskedPhone from '@/hooks/useMaskedPhone';
import { currentAccount as getAccountById } from '@/services/account';
// import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Row,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useParams } from 'umi';
import PermissionInfo from './PermissionInfo1';
import styles from './index.less';
import FormattedDateTime from '@/components/Common/FormattedDateTime';

export default function PageAccountDetail() {
  /** cấu hình language */
  const intl = useIntl();

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
            {currentAccount && currentAccount?.is_admin === 0 && (
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={8}
                className="t-al-right"
              >
                <Button
                  type="primary"
                  onClick={() => {
                    history.push({
                      pathname: '/accounts/'
                        .concat(`${params.id}`)
                        .concat('/edit'),
                    });
                  }}
                >
                  {intl.formatMessage({
                    id: 'account.action.update',
                    defaultMessage: 'Cập nhật',
                  })}
                </Button>
              </Col>
            )}
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
            <Row className={styles.my_info}>
              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                <Typography.Text strong>
                  {intl.formatMessage({
                    id: 'account.status',
                    defaultMessage: 'Trạng thái',
                  })}
                </Typography.Text>
                <span className="c3 b">{' :  '}</span>
                <Badge
                  className="ml-6 mr-6"
                  color={
                    currentAccount && currentAccount?.enabled === 1
                      ? colors.GREEN
                      : colors.GRAY
                  }
                />
                <Typography.Text className="ml-3">
                  {currentAccount && currentAccount?.enabled === 0
                    ? `${intl.formatMessage({
                        id: 'account.inactive',
                        defaultMessage: 'Chưa kích hoạt',
                      })}`
                    : `${intl.formatMessage({
                        id: 'account.activate',
                        defaultMessage: 'Kích hoạt',
                      })}`}
                </Typography.Text>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                <Typography.Text strong>
                  {intl.formatMessage({
                    id: 'account.phoneNumber',
                    defaultMessage: 'Số điện thoại',
                  })}
                </Typography.Text>
                <span className="c3 b">{' :  '}</span>
                <Typography.Text>
                  {useMaskedPhone(currentAccount?.phone_number)}
                </Typography.Text>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                <Typography.Text strong>Email</Typography.Text>
                <span className="c3 b">{' :  '}</span>
                <Typography.Text>{currentAccount?.email}</Typography.Text>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                <Typography.Text strong>
                  {intl.formatMessage({
                    id: 'account.type',
                    defaultMessage: 'Loại tài khoản',
                  })}
                </Typography.Text>
                <span className="c3 b">{' :  '}</span>

                <Typography.Text>
                  {currentAccount && currentAccount?.is_admin === 0
                    ? '	Sub account'
                    : 'Main account'}
                </Typography.Text>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="pb-16">
                <Typography.Text strong>Brandname</Typography.Text>
                <span className="c3 b">
                  <span className="c3 b">{' :  '}</span>
                </span>
                <Typography.Text>
                  {currentAccount &&
                    currentAccount?.brandnames &&
                    currentAccount?.brandnames.map((el: any, index: number) => {
                      return (
                        <Tag
                          color={colors.BLUE_TAG}
                          style={{
                            color: '#034EA2',
                            // fontFamily: 'Roboto',
                            fontSize: '12px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '20px',
                          }}
                          key={index}
                        >
                          <span>{el?.name}</span>
                        </Tag>
                      );
                    })}
                </Typography.Text>
              </Col>

              <Divider></Divider>

              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                <Row>
                  <Col span={24} className="pb-16">
                    <Typography.Text strong>
                      {intl.formatMessage({
                        id: 'account.creator',
                        defaultMessage: 'Người tạo',
                      })}
                    </Typography.Text>
                    <span className="c3 b">{' :  '}</span>
                    <Typography.Link>
                      {currentAccount?.created_by?.full_name}
                    </Typography.Link>
                  </Col>
                  <Col span={24} className="pb-16">
                    <Typography.Text strong>
                      {intl.formatMessage({
                        id: 'account.createdAt',
                        defaultMessage: 'Ngày tạo',
                      })}
                    </Typography.Text>
                    <span className="c3 b">{' :  '}</span>
                    <Typography.Text>
                      {FormattedDateTime(currentAccount?.created_at)}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                <Row>
                  <Col span={24} className="pb-16">
                    <Typography.Text strong>
                      {intl.formatMessage({
                        id: 'account.updater',
                        defaultMessage: 'Người cập nhật',
                      })}
                    </Typography.Text>
                    <span className="c3 b">{' :  '}</span>
                    <Typography.Link>
                      {' '}
                      {currentAccount?.updated_by?.full_name}
                    </Typography.Link>
                  </Col>

                  <Col span={24} className="pb-16">
                    <Typography.Text strong>
                      {intl.formatMessage({
                        id: 'account.updated.date',
                        defaultMessage: 'Ngày cập nhật',
                      })}
                    </Typography.Text>
                    <span className="c3 b">{' :  '}</span>
                    <Typography.Text>
                      {FormattedDateTime(currentAccount?.updated_at)}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Divider></Divider>

          <Col span={24} className="ph-24">
            {currentAccount && (
              <PermissionInfo currentAccount={currentAccount} />
            )}
          </Col>
        </Row>
      </div>
      {/* </PageContainer> */}
    </div>
  );
}
