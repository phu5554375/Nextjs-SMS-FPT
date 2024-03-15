import { fetchAllBrandname } from '@/services/brandname';
import { createCampaign } from '@/services/campaign';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { FormattedMessage, history, useModel } from '@umijs/max';
import { Button, Col, Form, Input, Row, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useState } from 'react';
import TabSwitcher from './TabSwitcher';
import TabContentsCMSN from './Tabs/TabContentsCMSN';
import TabContentsQC from './Tabs/TabContentsQC';
import TabContentsSMS from './Tabs/TabContentsSMS';
import TabContentsSSMS from './Tabs/TabContentsSSMS';
dayjs.extend(isSameOrBefore);

const CreateForm = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const { initialState } = useModel('@@initialState');

  const {
    campaign_types: LIST_CAMPAIGN_TYPE,
    sms_types: LIST_SMS_TYPE,
    telcos: LIST_TELCO,
  } = initialState?.configs;

  const [activeTab, setActiveTab] = useState<any>('sms');

  const selectDateTime = (value: any) => {
    if (value.time && value.date) {
      const selectedDate = dayjs(value.date);
      const selectedTime = dayjs(value.time);

      const combinedDateTime = selectedDate
        .set('hour', selectedTime.hour())
        .set('minute', selectedTime.minute())
        .format('YYYY-MM-DD HH:mm');

      form.setFieldValue('scheduled_at', combinedDateTime);
    }
  };

  return (
    <>
      <Form
        layout="horizontal"
        form={form}
        className="form-create-campaign w-800px"
        initialValues={{
          type: 1,
          sms_type: 1,
        }}
        onFinish={async (values: any) => {
          try {
            setLoading(true);
            const campaign = await createCampaign(values);
            if (campaign.success) {
              message.success(
                <FormattedMessage
                  id={'campaign.create.successful'}
                  defaultMessage="Tạo chiến dịch thành công!"
                />,
              );
              history.push('/campaigns/list');
            } else {
              message.error(
                <FormattedMessage
                  id={'campaign.create.failed'}
                  defaultMessage="Tạo chiến dịch thất bại!"
                />,
              );
            }
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        }}
      >
        <Form.Item
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          name="title"
          label={
            <div>
              <FormattedMessage
                id={'campaign.name'}
                defaultMessage="Tên chiến dịch"
              />{' '}
              <Tooltip
                style={{ color: 'gray' }}
                title="Hệ thống sẽ tự tạo tên chiến dịch nếu để trống"
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
          }
          rules={[
            {
              min: 5,
              message: (
                <FormattedMessage
                  id={'required.length.campaign.name'}
                  defaultMessage="Tên chiến dịch phải từ 5 đến 255 ký tự."
                />
              ),
            },
            {
              max: 255,
              message: (
                <FormattedMessage
                  id={'required.length.campaign.name'}
                  defaultMessage="Tên chiến dịch phải từ 5 đến 255 ký tự."
                />
              ),
            },
          ]}
        >
          <Input placeholder={'Tên chiến dịch'} />
        </Form.Item>

        <ProFormSelect
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          showSearch
          label="Brandname"
          name="brandname_id"
          placeholder="Brandname"
          request={async () => {
            const { data } = await fetchAllBrandname();
            const result = data
              ? data.map((item: { id: any; name: any }) => ({
                  value: item?.id,
                  label: item?.name,
                }))
              : [];
            return result;
          }}
          fieldProps={{
            optionLabelProp: 'label',
          }}
          rules={[{ required: true }]}
        />

        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          campaign_types={LIST_CAMPAIGN_TYPE}
        >
          <TabContentsSMS
            onDateTimeChange={selectDateTime}
            form={form}
            sms_types={LIST_SMS_TYPE}
            telcos={LIST_TELCO}
            campaign_types={LIST_CAMPAIGN_TYPE}
            tabKey="sms"
          />
          <TabContentsQC
            onDateTimeChange={selectDateTime}
            form={form}
            sms_types={LIST_SMS_TYPE}
            telcos={LIST_TELCO}
            campaign_types={LIST_CAMPAIGN_TYPE}
            tabKey="qc"
          />
          <TabContentsCMSN
            form={form}
            sms_types={LIST_SMS_TYPE}
            telcos={LIST_TELCO}
            campaign_types={LIST_CAMPAIGN_TYPE}
            tabKey="cmsn"
          />
          <TabContentsSSMS
            onDateTimeChange={selectDateTime}
            form={form}
            sms_types={LIST_SMS_TYPE}
            telcos={LIST_TELCO}
            campaign_types={LIST_CAMPAIGN_TYPE}
            tabKey="ssms"
          />
        </TabSwitcher>

        <Form.Item>
          <Row>
            <Col span={6}></Col>
            <Col span={18}>
              <Button
                htmlType="submit"
                className="mr-8"
                key="confirm"
                type="primary"
                loading={loading}
              >
                {loading ? 'Loading...' : 'Lưu chiến dịch'}
              </Button>

              <Button htmlType="reset" onClick={() => setActiveTab('sms')}>
                Huỷ
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateForm;
