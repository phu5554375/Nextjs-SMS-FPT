import FormattedDateTime from '@/components/Common/FormattedDateTime';
import useMaskedPhone from '@/hooks/useMaskedPhone';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl, useModel } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Tag,
  Typography,
} from 'antd';
import PermissionInfo from './PermissionInfo';

const { Title, Text } = Typography;

export default function Page() {
  /** cấu hình language */
  const intl = useIntl();

  const { initialState } = useModel('@@initialState');

  const {
    username,
    full_name,
    brandnames,
    enabled,
    email,
    phone_number,
    created_by,
    updated_by,
    created_at,
    updated_at,
    is_admin,
  } = initialState?.currentUser || {};

  return (
    <PageContainer
      header={{
        style: {
          display: 'none',
        },
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={8} xs={24} xl={8}>
          <Card className="t-al-center" style={{ padding: '16px 46px' }}>
            <Avatar
              size={{ xs: 100, sm: 100, md: 130, lg: 130, xl: 128, xxl: 130 }}
              className="mb-20"
              style={{ backgroundColor: '#E6F7FF', color: '#034EA2' }}
            >
              <span className="fw-600" style={{ fontSize: '48px' }}>
                NT
              </span>
            </Avatar>
            <Title level={5}>{full_name}</Title>
            <Text type="secondary" className="mb-24">
              {username}
            </Text>
            <Divider type="horizontal" className="mb-16" dashed></Divider>
            <div className="">
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.phoneNumber',
                    defaultMessage: 'Số điện thoại',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  {useMaskedPhone(phone_number)}
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  Email
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left ellipsis">
                  {email}
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.type',
                    defaultMessage: 'Loại tài khoản',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  {is_admin === 0 ? '	Sub account' : 'Main account'}
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.status',
                    defaultMessage: 'Trạng thái',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  {enabled ? (
                    <Badge
                      key="green"
                      color="green"
                      text={`${intl.formatMessage({
                        id: 'account.activate',
                        defaultMessage: 'Kích hoạt',
                      })}`}
                    />
                  ) : (
                    <Badge
                      text={`${intl.formatMessage({
                        id: 'account.inactive',
                        defaultMessage: 'Chưa kích hoạt',
                      })}`}
                    />
                  )}
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  Brandname
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  {brandnames?.map((value, index) => (
                    <Tag key={index} color="blue" className="mb-6">
                      {value.name}
                    </Tag>
                  ))}
                </Col>
              </Row>
            </div>
            <Divider type="horizontal" className="mb-16" dashed></Divider>
            <div className="p-0">
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.creator',
                    defaultMessage: 'Người tạo',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  <Text style={{ color: '#034EA2' }}>
                    {created_by?.username}
                  </Text>
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.createdAt',
                    defaultMessage: 'Ngày tạo',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  {FormattedDateTime(created_at)}
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.updater',
                    defaultMessage: 'Người cập nhật',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  <Text style={{ color: '#034EA2' }}>
                    {updated_by?.username}
                  </Text>
                </Col>
              </Row>
              <Row className="mb-16 p-0" gutter={12}>
                <Col span={10} className="t-al-left fw-600">
                  {intl.formatMessage({
                    id: 'account.updated.date',
                    defaultMessage: 'Ngày cập nhật',
                  })}
                </Col>
                <Col span={2} className="t-al-right">
                  :
                </Col>
                <Col span={12} className="t-al-left">
                  {FormattedDateTime(updated_at)}
                </Col>
              </Row>
            </div>
            <Divider type="horizontal" className="mb-16" dashed></Divider>
            <Row>
              <Button
                type="primary"
                onClick={() => {
                  history.push({
                    pathname: `${'/profile/edit'}`,
                  });
                }}
              >
                {intl.formatMessage({
                  id: 'account.action.edit',
                  defaultMessage: 'Chỉnh sửa',
                })}
              </Button>
            </Row>
          </Card>
        </Col>
        <Col span={16} xs={24} xl={16}>
          <PermissionInfo />
        </Col>
      </Row>
    </PageContainer>
  );
}
