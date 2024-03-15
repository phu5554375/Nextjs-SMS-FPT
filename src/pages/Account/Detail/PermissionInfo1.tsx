/* eslint-disable @typescript-eslint/no-unused-vars */
import { useIntl, useModel } from '@umijs/max';
import { Col, Divider, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import colors from '@/commons/colors';

export default function PermissionInfo(props: any) {
  const { initialState } = useModel('@@initialState');

  const permissions = initialState?.configs?.permissions;

  const [data, setData] = useState<any>();

  let current_permission: any = props?.currentAccount?.permissions;

  /** cấu hình language */
  const intl = useIntl();

  useEffect(() => {
    const fetchAccount = async () => {
      let result = permissions;

      let new_items: any = [];
      for (let i = 0; i < result?.length; i++) {
        new_items[i] = {
          title: result[i].title,
          enabled: result[i].enabled,
          permissions: result[i]?.permissions,
          policys: [],
        };
        for (let j = 0; j < result[i]?.permissions?.length; j++) {
          for (let k = 0; k < current_permission?.length; k++) {
            if (result[i]?.permissions[j]?.name === current_permission[k]) {
              new_items[i].policys.push({
                item: current_permission[k],
              });
            }
          }
        }
      }
      setData(new_items);
    };
    fetchAccount().catch(console.error);
  }, []);

  if (!data) {
    return null;
  }

  return (
    <>
      {current_permission && current_permission?.length > 0 ? (
        <Typography.Text strong>
          {intl.formatMessage({
            id: 'account.decentralization',
            defaultMessage: 'Phân quyền',
          })}
        </Typography.Text>
      ) : null}
      <Row className={styles.my_info}>
        {data &&
          data?.length > 0 &&
          data.map((e: any) => (
            <>
              {e && e?.policys?.length > 0 ? (
                <>
                  <Col xs={24} sm={12} md={12} lg={8} xl={8} className="">
                    {e?.title}
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={16} xl={16} className="">
                    {e &&
                      e?.permissions?.map((itm: any, index: any) => (
                        <>
                          {current_permission?.find(
                            (el: any) =>
                              el === itm.name && itm.enabled === true,
                          ) ? (
                            <>
                              <Row gutter={16} className="mb-16" key={index}>
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={24}
                                  xl={24}
                                  xxl={24}
                                >
                                  <Row gutter={16} className="">
                                    <Col span={24} className="pb-8">
                                      {itm?.title
                                        ? itm.title
                                        : itm?.description}
                                    </Col>
                                    <Col span={24} style={{ color: colors.GRAY }}>
                                      {itm?.description}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </>
                          ) : null}
                        </>
                      ))}
                  </Col>
                  <Divider style={{ marginTop: 0 }} />
                </>
              ) : null}
            </>
          ))}
      </Row>
    </>
  );
}
