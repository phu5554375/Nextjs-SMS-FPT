// import TagSelectGroup from '@/components/TagSelectGroup';
// import {
//   PageContainer,
//   ProFormDateRangePicker,
// } from '@ant-design/pro-components';
// import { useModel } from '@umijs/max';
// import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
// import dayjs from 'dayjs';

// import { Fragment } from 'react';

// export default function Page() {
//   const { initialState } = useModel('@@initialState');

//   const LIST_TELCO = initialState?.configs.telcos;

//   const [form] = Form.useForm();

//   const onSelectionChange = (value: any) => {
//     console.log(value);
//   };

//   return (
//     <Fragment>
//       <PageContainer>
//         <Card className="mb-24">
//           <Form
//             form={form}
//             labelAlign="left"
//             // onFinish={ }
//             initialValues={{
//               phone_number: '',
//               syntax: '',
//               is_charged: '',
//               dateRange: [dayjs().subtract(45, 'day'), dayjs()],
//             }}
//             autoComplete="off"
//           >
//             <Row gutter={16} className="mb-5">
//               <Col span={24}>
//                 <Form.Item
//                   label="Nhà mạng"
//                   labelAlign="left"
//                   className="label-bold"
//                 >
//                   <TagSelectGroup
//                     defaultSelectedAll
//                     items={LIST_TELCO}
//                     onSelectionChange={onSelectionChange}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16} className="mb-16">
//               <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
//                 <Form.Item
//                   label="Số điện thoại"
//                   labelAlign="left"
//                   className="label-bold"
//                   name="phone_number"
//                 >
//                   <Input placeholder="Số điện thoại" />
//                 </Form.Item>
//               </Col>
//               <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
//                 <Form.Item
//                   label="Chiến dịch"
//                   name="syntax"
//                   labelAlign="left"
//                   className="label-bold"
//                 >
//                   <Select
//                     showSearch
//                     // filterOption={(input, option) =>
//                     //     (option?.label ?? '')
//                     //         .toLowerCase()
//                     //         .includes(input.toLowerCase())
//                     // }
//                     placeholder="MO"
//                     options={[]}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
//                 <Form.Item
//                   label="Trạng thái"
//                   name="is_charged"
//                   labelAlign="left"
//                   className="label-bold"
//                 >
//                   <Select
//                     placeholder="Trạng thái"
//                     options={[
//                       { label: 'All', value: '' },
//                       { label: 'Tính phí', value: 1 },
//                       { label: 'Không tính phí', value: 0 },
//                     ]}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col xs={24} sm={12} md={12} lg={6} className="col-form-custom">
//                 <Form.Item
//                   label="Thời gian"
//                   labelAlign="left"
//                   className="label-bold date-range-custom"
//                 >
//                   <ProFormDateRangePicker
//                     style={{ width: '100%' }}
//                     name="dateRange"
//                     fieldProps={{
//                       format: value => value.format('YYYY-MM-DD'),
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={24} className="col-form-custom t-al-right">
//                 <Button type="primary" htmlType="submit">
//                   Tìm kiếm
//                 </Button>
//                 <Button type="default" className="ml-8" htmlType="reset">
//                   Làm lại
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>
//       </PageContainer>
//     </Fragment>
//   );
// }
