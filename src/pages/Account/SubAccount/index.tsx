/* eslint-disable @typescript-eslint/no-unused-vars */
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Typography } from 'antd';
import { useIntl } from 'umi';
import CreateSubAccountForm from './CreateSubAccountForm';
import styles from './index.less';

export default function PageCreateSubAccount() {
  const intl = useIntl();

  return (
    <div>
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
                      id: 'account.create.child',
                      defaultMessage: 'Tạo tài khoản con',
                    })}
                  </span>
                </li>
              </ol>
        </nav>
        <div className={styles.my_headerHeading}>
          <div className={styles.my_headerHeadingLeft}>
            <span className={styles.my_headerHeadingTitle}>
              {intl.formatMessage({ id: 'account.create.child' })}
            </span>
          </div>
        </div>
      </div>

      <div className="pa-24">
        <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card>
                <div className="pb-24">
                  <Typography.Text strong>
                    {intl.formatMessage({
                      id: 'account.info',
                      defaultMessage: 'Thông tin tài khoản',
                    })}
                  </Typography.Text>
                </div>
                <CreateSubAccountForm />
              </Card>
            </Col>
            {/* <Col  xs={24} sm={24} md={6} lg ={6} xl={6}>
                        <Card>
                            <div className='pb-24'>
                                <Typography.Text strong>Avatar</Typography.Text>
                            </div>
                            <div className='t-al-center'>
                                <Avatar
                                    size={{ xs: 32, sm: 40, md: 60, lg: 100, xl: 160, xxl: 160 }}
                                    src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                                ></Avatar>
                            </div>
                            <Divider></Divider>
                            <Row justify='center'>
                                <Col>
                                <Button type='primary'> <UploadOutlined /> Tải ảnh lên</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col> */}
        </Row>
      </div>
    </div>
  );
}
