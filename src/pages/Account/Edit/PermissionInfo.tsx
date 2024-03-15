/* eslint-disable @typescript-eslint/no-unused-vars */
import CheckboxCustom from '@/components/CheckboxCustom';
import { fetchAllPermission } from '@/services/permission';
import { Checkbox, Col, Collapse, Divider, Row } from 'antd';
import React, { useEffect, useState } from 'react'

export default function PermissionInfo(props :any) {

    const [permission, setPermission] = useState<any>();

    let current_permission:any = props?.currentAccount?.permissions;

    let dataPermission = {
      "success": true,
      "data": [
        {
          "idComponentModule": 1,
          "nameModule": "dashboard",
          "permission": [
            {
              "id": 1.1,
              "enabled": true,
              "name": "dashboard.index",
              "title": "Dashboard",
              "description": "Dashboard"
            }
          ]
        },
        {
          "idComponentModule": 2,
          "nameModule": "user",
          "permission": [
            {
              "id": 2.1,
              "enabled": true,
              "name": "users.all",
              "title": "Quản trị tài khoản",
              "description": "Có quyền truy cập tất cả tài khoản, thêm, xoá, sửa."
            }
          ]
        },
        {
          "idComponentModule": 3,
          "nameModule": "campaign",
          "permission": [
            {
              "id": 3.1,
              "enabled": true,
              "name": "campaigns.store",
              "title": "Tạo chiến dịch",
              "description": "Tạo chiến dịch"
            },
            {
              "id": 3.2,
              "enabled": true,
              "name": "campaigns.update",
              "title": "Cập nhật chiến dịch",
              "description": "Cập nhật chiến dịch"
            },
            {
              "id": 3.3,
              "enabled": true,
              "name": "campaigns.destroy",
              "title": "Xoá chiến dịch",
              "description": "Xoá chiến dịch"
            },
            {
              "id": 3.4,
              "enabled": true,
              "name": "Duyệt chiến dịch",
              "description": "Duyệt chiến dịch trước khi chạy"
            }
          ]
        },
        {
          "idComponentModule": 4,
          "nameModule": "report",
          "permission": [
            {
              "id": 4.1,
              "enabled": true,
              "name": "reports.index",
              "title": "Truy cập báo cáo",
              "description": "Truy cập báo cáo theo các chiến dịch Brandname theo ngày, tháng, ..."
            },
            {
              "id": 4.2,
              "enabled": true,
              "name": "reports.export",
              "title": "Xuất báo cáo",
              "description": "Xuất excel báo cáo theo các chiến dịch Brandname theo ngày, tháng, ..."
            }
          ]
        },
        {
          "idComponentModule": 5,
          "nameModule": "message",
          "permission": [
            {
              "id": 5.1,
              "enabled": true,
              "name": "messages.index",
              "title": "Tra cứu tin nhắn",
              "description": "Tra cứu tin nhắn đã gửi của các chiến dịch Brandname"
            },
            {
              "id": 5.2,
              "enabled": true,
              "name": "messages.export",
              "title": "Xuất tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            }
          ]
        },
        {
          "idComponentModule": 6,
          "nameModule": "template",
          "permission": [
            {
              "id": 6.1,
              "enabled": true,
              "name": "temaplates.index",
              "title": "Xem danh sách mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            },
            {
              "id": 6.2,
              "enabled": true,
              "name": "temaplates.store",
              "title": "Tạo mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            },
            {
              "id": 6.3,
              "enabled": true,
              "name": "temaplates.update",
              "title": "Tạo mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            },
            {
              "id": 6.4,
              "enabled": true,
              "name": "temaplates.destroy",
              "title": "Tạo mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            }
          ]
        },
        {
          "idComponentModule": 7,
          "nameModule": "mt_report",
          "permission": [
            {
              "id": 7.1,
              "enabled": true,
              "name": "mt_reports.index",
              "description": "Truy cập báo cáo sản lượng tin nhắn MO - MT"
            },
            {
              "id": 7.2,
              "enabled": true,
              "name": "mt_reports.export",
              "title": "Tạo mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            }
          ]
        },
        {
          "idComponentModule": 8,
          "nameModule": "mt_message",
          "permission": [
            {
              "id": 8.1,
              "enabled": true,
              "name": "mt_messages.index",
              "title": "Tạo mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            },
            {
              "id": 8.2,
              "enabled": true,
              "name": "mt_messages.export",
              "title": "Tạo mẫu nội dung tin nhắn",
              "description": "Xuất excel các tin nhắn đã gửi của các chiến dịch Brandname"
            }
          ]
        }
      ]
    };

    useEffect(() => {
        const fetchAccount = async () => {
        // const result = await fetchAllPermission();

        const result = dataPermission;

        

        setPermission(result.data);
        console.log('permission',result.data)
        let listRole:any = [];

   
        };
        fetchAccount().catch(console.error);
    },[]);

    if (!permission) {
      return null;
    }
  
    return (
      <>
          
          {permission &&
            permission.map((e:any) => (
              <>
                <Collapse defaultActiveKey={[`${e.idComponentModule}`]} className="mt-16">
                  <Collapse.Panel
                    header={<p className="c3 b">{e?.nameModule}</p>}
                    showArrow={true}
                    key={`${e.idComponentModule}`}
                    forceRender={true}
                  >
                    {e.permission.map((itm:any, index:any) =>(
                          <>
                            <Row className="mb-16" gutter={16} key={itm.id}>
                              <Col xs={8} sm={12} md={6} lg={6} xl={6} xxl={6}>
                                  {itm?.name}
                              </Col>
                              <Col xs={16} sm={12} md={18} lg={18} xl={18} xxl={18}>
                                <Row gutter={16}>
                                  <Col span={2}>
                                    {current_permission?.find((e:any) => e === itm.name) ? (
                                      <>
                                        <Checkbox  checked={e}/>
                                      </>
                                    ): <Checkbox  />}
                                  </Col>
                                  <Row gutter={16}>
                                    <Col span={24} className='pb-12'>{itm?.title ? itm.title : itm?.description}</Col>
                                    <Col span={24} className='sub-title'>Mô tả: {itm?.description}</Col>
                                  </Row>
                                </Row>
                              </Col>
                            </Row>
                            <Divider/>
                          </>
                        ))}

                  </Collapse.Panel>
                </Collapse>
              </>
            ))}
      </>
    );
}