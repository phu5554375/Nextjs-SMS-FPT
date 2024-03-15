import { useIntl, useModel } from '@umijs/max';
import { Card, Col, Divider, Empty, Row, Typography } from 'antd';

const { Text, Paragraph } = Typography;

export default function PermissionInfo() {
  /** cấu hình language */
  const intl = useIntl();

  const { initialState } = useModel('@@initialState');

  const permissionUser = initialState?.currentUser?.permissions;

  const { permissions } = initialState?.configs || {};

  return (
    <Card title={`${intl.formatMessage({
      id: 'account.decentralization',
      defaultMessage: 'Phân quyền',
    })}`}>
      {permissions && permissionUser.length > 0 ? (
        permissions.map((value: any, index: any) => {
          const hasMatchingPermission = value.permissions.some(
            (permission: any) =>
              Array.isArray(permissionUser)
                ? permissionUser.includes(permission.name)
                : permissionUser === permission.name,
          );

          if (hasMatchingPermission) {
            return (
              <div key={index}>
                <Row gutter={16} className="mb-0">
                  <Col span={8}>
                    <Text className="d-block fw-400">{value.title}</Text>
                  </Col>
                  <Col span={16}>
                    {value.permissions.map((child: any, index: any) => (
                      <div key={index}>
                        {Array.isArray(permissionUser)
                          ? permissionUser.includes(child.name) && (
                              <>
                                <Text className="d-block fw-400">
                                  {child.title}
                                </Text>
                                <Paragraph
                                  style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                                >
                                  {child.description}
                                </Paragraph>
                              </>
                            )
                          : permissionUser === child.name && (
                              <>
                                <Text className="d-block fw-400">
                                  {child.title}
                                </Text>
                                <Paragraph
                                  style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                                >
                                  {child.description}
                                </Paragraph>
                              </>
                            )}
                      </div>
                    ))}
                  </Col>
                  <Divider type="horizontal"></Divider>
                </Row>
              </div>
            );
          }
          return null;
        })
      ) : (
        <Empty /> // Render a message when permissions array is empty
      )}
    </Card>
  );
}
