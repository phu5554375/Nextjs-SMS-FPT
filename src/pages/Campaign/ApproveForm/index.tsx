/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCampaignById } from '@/services/campaign';
import { CheckOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-form';
import { DatePicker, Form, Modal } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export type FormValueType = {
  scheduled_at?: any;
  id?: any;
  title?: string;
  messages_delivered_count?: any;
} & Partial<API_CAMPAIGN.CurrentCampaign>;

export type ApproveFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API_CAMPAIGN.CurrentCampaign>;
  loading: boolean;
};

const ApproveForm: React.FC<ApproveFormProps> = props => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const data = props && props?.values;
  const [selectedDateTime, setSelectedDateTime] = useState<any>(null);

  const [currentCampaign, setCurrentCampaign] = useState<any>();

  useEffect(() => {
    if (props && props?.values && props?.values?.id !== null) {
      const params = { id: data?.id };
      const fetchCampaignById = async () => {
        const result = await getCampaignById(params);
        if (result.success) {
          setCurrentCampaign(result?.data);
        }
      };
      fetchCampaignById().catch(console.error);
    }
  }, [props.values]);

  useEffect(() => {
    setSelectedDateTime(
      dayjs(
        currentCampaign && currentCampaign?.scheduled_at,
        'YYYY-MM-DD HH:mm',
      ),
    );
  }, []);

  const handleCancel = () => {
    setCurrentCampaign(undefined);
    props.onCancel();
  };

  const handleOk = () => {
    if (selectedDateTime !== null) {
      return props.onSubmit(currentCampaign);
    }
    return null;
  };

  const handleChangeDateTime = (e: any) => {
    let new_scheduled_at: any = null;
    if (e !== null) {
      new_scheduled_at = e && dayjs(e?.$d).format('YYYY-MM-DD HH:mm');
    } else {
      new_scheduled_at = null;
    }
    setSelectedDateTime(new_scheduled_at);
    const newData = {
      ...currentCampaign,
      scheduled_at: new_scheduled_at,
    };
    setCurrentCampaign(newData);
  };

  if (!currentCampaign) return null;
  return (
    <>
      <Modal
        width={640}
        maskClosable={false}
        confirmLoading={props?.loading}
        title={intl.formatMessage({
          id: 'campaign.tip.title.accept',
          defaultMessage: 'Duyệt chiến dịch',
        })}
        open={props.updateModalVisible}
        okText={
          <>
            {props?.loading === true ? (
              <>
                <span>{'Loading...'}</span>
              </>
            ) : (
              <>
                <span className="mr-6">
                  <CheckOutlined />
                </span>
                {intl.formatMessage({
                  id: 'campaign.approve',
                  defaultMessage: 'Duyệt',
                })}
              </>
            )}
          </>
        }
        cancelText={`${intl.formatMessage({
          id: 'account.action.cancel',
          defaultMessage: 'Hủy',
        })}`}
        onCancel={handleCancel}
        // footer={null}
        onOk={handleOk}
        destroyOnClose={true}
        afterClose={() => form.resetFields()}
      >
        <Form
          preserve={true}
          layout={'vertical'}
          name="form_in_modal"
          initialValues={{
            id: currentCampaign && currentCampaign?.id,
            title: currentCampaign && currentCampaign?.title,
            messages_count: currentCampaign && currentCampaign?.messages_count,
            scheduled_at: dayjs(
              currentCampaign && currentCampaign?.scheduled_at,
              'YYYY-MM-DD HH:mm',
            ),
          }}
        >
          <Form.Item style={{ display: 'none' }}>
            <ProFormText
              name="id"
              disabled
              label="id"
              style={{ display: 'none' }}
            />
          </Form.Item>

          <Form.Item className="mb-10">
            <ProFormText
              name="title"
              disabled
              label={intl.formatMessage({
                id: 'campaign.name',
                defaultMessage: 'Tên chiến dịch',
              })}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '10px', marginBottom: '10px' }}>
            <ProFormText
              name="messages_count"
              disabled
              label={intl.formatMessage({
                id: 'number.of.messages',
                defaultMessage: 'Số lượng tin',
              })}
            />
          </Form.Item>

          <Form.Item
            name="scheduled_at"
            style={{ marginTop: '10px' }}
            label={intl.formatMessage({
              id: 'campaign.sending.date',
              defaultMessage: 'Thời gian gửi',
            })}
            rules={[
              {
                required: true,
              },
              {
                validator: (
                  rule: any,
                  value: string,
                  cb: (msg?: string) => void,
                ) => {
                  return !dayjs().isSameOrBefore(value, 'minute')
                    ? cb(
                        `${intl.formatMessage({
                          id: 'campaign.required.selet.time',
                        })}`,
                      )
                    : cb();
                },
              },
            ]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              defaultValue={dayjs(
                currentCampaign && currentCampaign?.scheduled_at,
                'YYYY-MM-DD HH:mm',
              )}
              format={'YYYY-MM-DD HH:mm'}
              value={selectedDateTime}
              onChange={e => handleChangeDateTime(e)}
            />
          </Form.Item>

          {/* <Divider></Divider> */}
          {/* <Row className={styles.styeRowAction}>
            <Col>
              <Button type="default" className="mr-10" onClick={handleCancel}>
                {intl.formatMessage({
                  id: 'account.action.cancel',
                  defaultMessage: 'Hủy',
                })}
              </Button>

              <Button type="primary" htmlType="submit" loading={props?.loading}>
                {props?.loading === true ? (
                  <>
                    <span>{'Loading...'}</span>
                  </>
                ) : (
                  <>
                    <span className="mr-6">
                      <CheckOutlined />
                    </span>
                    {intl.formatMessage({
                      id: 'campaign.approve',
                      defaultMessage: 'Duyệt',
                    })}
                  </>
                )}
              </Button>
            </Col>
          </Row> */}
        </Form>
      </Modal>
    </>
  );
};

export default ApproveForm;
