/* eslint-disable @typescript-eslint/no-unused-vars */
import colors from '@/commons/colors';
import { fetchAllBrandname } from '@/services/brandname';
import { updateCampaign } from '@/services/campaign';
import {
  DeleteOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel } from '@umijs/max';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tag,
  TimePicker,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import dayjs from 'dayjs';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useCallback, useEffect, useState } from 'react';

const { Dragger } = Upload;

function EditCampaignForm(props: any) {
  const intl = useIntl();
  const [form] = Form.useForm();

  const { initialState } = useModel('@@initialState');
  const list_sms_type = initialState?.configs.sms_types;
  const list_campaign_type = initialState?.configs.campaign_types;
  const { id, file_import, content } = props && props?.currentCampaign;

  const [isLoading, setIsLoading] = useState(false);

  const [fileInit, setFileInit] = useState(file_import ? file_import : []);

  const [fileHeaders] = useState([]);

  const handleResetFields = () => {
    form.resetFields();
    setFileInit(props?.currentCampaign?.file_import);
  };

  const [valueMessageTypeInit] = useState(
    props && props?.currentCampaign && props?.currentCampaign?.sms_type,
  );

  const [campaignTypeInit, setCampaignTypeInit] = useState(
    props && props?.currentCampaign && props?.currentCampaign?.type,
  );
  const handleChangeCampaignType = (e: any) => {
    setCampaignTypeInit(e);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      let content = values.content;
      fileHeaders.forEach((items: any) => {
        content = content.replace(items.label, items.code);
      });

      const param = {
        brandname_id: values.brandname_id,
        title: values.campaign_name,
        file_import_id: fileInit && fileInit?.id ? fileInit?.id : fileInit,
        scheduled_at: dayjs(form.getFieldValue('date'))
          .format('YYYY-MM-DD')
          .concat(' ')
          .concat(dayjs(form.getFieldValue('hour_minute')).format('HH:mm')),
        type: values.type,
        sms_type: valueMessageTypeInit && valueMessageTypeInit,
        content,
      };
      setIsLoading(true);
      const campaign = await updateCampaign(param, id);

      if (campaign.success === true) {
        message.success(
          `${intl.formatMessage({
            id: 'action.update.successful',
            defaultMessage: 'Cập nhật thành công!',
          })}`,
        );
        history.push('/campaigns/'.concat(`${id}`));
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const DownloadFileSample = useCallback(() => {}, []);

  const [, setlengthContent] = useState(
    content && content.length ? content.length : 0,
  );

  const handleChangeContent = () => {
    let str = form.getFieldValue('content').length;
    if (str > 0) {
      setlengthContent(100 - str);
    } else setlengthContent(0);
  };

  const handleBlurContent = () => {
    form.getFieldValue('content');
  };

  const handleRemove = () => {
    setFileInit([]);
  };

  const [listBrandname, setListBrandname] = useState([]);

  useEffect(() => {
    const fetchBrandname = async () => {
      const result = await fetchAllBrandname();
      if (result.success) {
        setListBrandname(
          result?.data.map((item: { id: any; name: any }) => ({
            value: item?.id,
            label: item?.name,
          })),
        );
      }
    };
    fetchBrandname().catch(console.error);
  }, []);

  const tagRender = (props: CustomTagProps) => {
    const { label } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={'blue'}
        onMouseDown={onPreventMouseDown}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <div>
      <Form
        className="form-edit-campaign"
        form={form}
        initialValues={{
          campaign_name:
            props && props?.currentCampaign && props?.currentCampaign?.title,
          brandname_id:
            props &&
            props?.currentCampaign &&
            props?.currentCampaign?.brandname?.id,
          type: campaignTypeInit,
          sms_type: `${intl.formatMessage({
            id: 'sms.type.'.concat(`${valueMessageTypeInit}`),
          })}`,
          content:
            props && props?.currentCampaign && props?.currentCampaign?.content,
        }}
        onFinish={handleFormSubmit}
      >
        <div className="t-al-center">
          <Row className="mb-10">
            <Col offset={7} className={''}>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'campaign.name',
                  defaultMessage: 'Tên chiến dịch',
                })}
              </Typography.Text>
              <span className="ml-6" style={{ color: '#8C8C8C' }}>
                <Tooltip title="Hệ thống sẽ tự tạo tên chiến dịch nếu để trống">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            </Col>
          </Row>
          <Row className="mb-10">
            <Col span={7}></Col>
            <Col span={12} className="w-100-p">
              <Form.Item
                name="campaign_name"
                rules={[
                  {
                    min: 5,
                    message: `${intl.formatMessage({
                      id: 'required.length.campaign.name',
                      defaultMessage:
                        ' Tên chiến dịch phải từ 5 đến 255 ký tự.',
                    })}`,
                  },
                  {
                    max: 255,
                    message: `${intl.formatMessage({
                      id: 'required.length.campaign.name',
                      defaultMessage: 'Tên chiến dịch phải từ 5 đến 255 ký tự.',
                    })}`,
                  },
                ]}
              >
                <Input
                  maxLength={255}
                  placeholder={intl.formatMessage({
                    id: 'campaign.name',
                    defaultMessage: 'Tên chiến dịch',
                  })}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-10">
            <Col offset={7} className={''}>
              <Typography.Text strong>
                <span style={{ color: 'red' }}>* </span>Brandname
              </Typography.Text>
            </Col>
          </Row>
          <Row className="mb-10">
            <Col offset={7} className="w-50-p t-al-left">
              <Form.Item>
                <Select
                  mode="multiple"
                  disabled
                  tagRender={tagRender}
                  defaultValue={
                    props &&
                    props?.currentCampaign &&
                    props?.currentCampaign?.brandname?.id
                  }
                  style={{ width: '100%' }}
                  options={listBrandname && listBrandname}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={7}></Col>
            <Col span={12} className="t-al-left">
              <Row>
                <Col span={16}>
                  <Row>
                    <Col span={24} className="mb-10">
                      <Typography.Text strong>
                        <span style={{ color: 'red' }}>* </span>
                        {intl.formatMessage({
                          id: 'campaign.type',
                          defaultMessage: 'Loại chiến dịch',
                        })}
                      </Typography.Text>
                    </Col>
                    <Col span={24} className="mb-10">
                      <Form.Item name="type">
                        <Select
                          disabled
                          options={list_campaign_type.map((item: any) => ({
                            value: item.value,
                            label: `${intl.formatMessage({
                              id: 'campaign.type.'.concat(item.label),
                            })}`,
                          }))}
                          onChange={handleChangeCampaignType}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={24} className="pl-16 mb-10">
                      <Typography.Text strong>
                        {intl.formatMessage({
                          id: 'type.of.message',
                          defaultMessage: 'Kiểu tin nhắn',
                        })}
                      </Typography.Text>
                    </Col>
                    <Col span={24} className="pl-16 mb-10">
                      {/* <Form.Item name="sms_type">
                        <Select
                          disabled
                          options={[...list_sms_type].map((item: any) => ({
                            value: item.value,
                            label: `${intl.formatMessage({
                              id: 'sms.type.'.concat(item.label),
                            })}`,
                          }))}
                        />
                      </Form.Item> */}

                      <Form.Item>
                        <ProFormSelect
                          name="sms_type"
                          disabled
                          // fieldProps={{
                          //   mode: 'multiple',
                          //   onChange: value => {
                          //     setChangeBrandname(true);
                          //     console.log('onchang', value);
                          //   },
                          // }}
                          // rules={[
                          //   {
                          //     required: true,
                          //     type: 'array',
                          //   },
                          // ]}
                          request={async () => {
                            let data: any = [...list_sms_type];
                            return data
                              ? data.map((item: any) => ({
                                  value: `${item?.value}`,
                                  label: `${intl.formatMessage({
                                    id: 'sms.type.'.concat(`${item.value}`),
                                  })}`,
                                }))
                              : [];
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col offset={7} className="mb-10">
              <Typography.Text strong>
                <span style={{ color: 'red' }}>* </span>
                {intl.formatMessage({
                  id: 'campaign.sending.time',
                  defaultMessage: 'Thời gian gửi',
                })}
              </Typography.Text>
            </Col>
          </Row>
          <Row className="mb-10">
            <Col span={7}></Col>
            <Col span={8} className="t-al-left">
              <Form.Item
                name="date"
                initialValue={dayjs(
                  props?.currentCampaign?.scheduled_at.slice(0, 11),
                  'YYYY-MM-DD',
                )}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'campaign.required.selet.time',
                      defaultMessage:
                        'Vui lòng chọn thời gian lớn hơn hoặc bằng hiện tại',
                    })}`,
                  },
                ]}
              >
                <DatePicker
                  className="w-100-p"
                  placeholder={intl.formatMessage({
                    id: 'campaign.sending.time',
                    defaultMessage: 'Thời gian gửi',
                  })}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={4} className="t-al-left pl-16">
              <Form.Item
                initialValue={dayjs(
                  props?.currentCampaign?.scheduled_at.slice(11),
                  'HH:mm',
                )}
                name="hour_minute"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'campaign.required.selet.time',
                      defaultMessage:
                        'Vui lòng chọn thời gian lớn hơn hoặc bằng hiện tại',
                    })}`,
                  },
                ]}
              >
                <TimePicker className="w-100-p" allowClear format={'HH:mm'} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col offset={7} className="mb-10">
              {campaignTypeInit === 1 ? (
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>
                  {intl.formatMessage({
                    id: 'account.phoneNumber',
                    defaultMessage: 'Số điện thoại',
                  })}
                </Typography.Text>
              ) : (
                <Typography.Text strong>
                  <span style={{ color: 'red' }}>* </span>
                  {intl.formatMessage({
                    id: 'message.configuration',
                    defaultMessage: 'Cấu hình tin nhắn',
                  })}
                </Typography.Text>
              )}
            </Col>
          </Row>
          {!fileInit?.id && (
            <Row>
              <Col offset={7} className="t-al-left w-50-p">
                <Form.Item
                  name="file_import_id"
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'no.file.upload',
                        defaultMessage: 'Chưa có file đẩy lên',
                      })}`,
                    },
                  ]}
                >
                  <Dragger {...propss}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      {' '}
                      {intl.formatMessage({ id: 'click.or.drag.file' })}
                    </p>
                    <p className="ant-upload-hint">
                      {intl.formatMessage({ id: 'file.upload.xlsx' })}
                    </p>
                  </Dragger>
                </Form.Item>
                <p className="c3">
                  <a
                    onClick={DownloadFileSample}
                    href={
                      'https://drive.google.com/u/0/uc?id=1z9waPH7wRm0Jb4w0zmOVSCstcoAtGuoW&export=download'
                    }
                    className="c3 link u"
                  >
                    {intl.formatMessage({
                      id: 'download.file.tem.xlsx',
                      defaultMessage: 'Tải về file mẫu .xlsx',
                    })}
                  </a>{' '}
                </p>
              </Col>
            </Row>
          )}
          {fileInit?.id && (
            <>
              <Row>
                <Col offset={7}></Col>
              </Row>
              <Row className="">
                <Col span={7}></Col>
                <Col span={8} className="t-al-left">
                  <p>
                    <PaperClipOutlined />
                    <span style={{ color: colors.GREEN, marginLeft: '6px' }}>
                      {fileInit && fileInit?.name}
                    </span>
                    <span>
                      {props?.currentCampaign &&
                      props?.currentCampaign?.messages_invalid_count > 0 ? (
                        <span className="ml-6" style={{ color: '#8C8C8C' }}>
                          <Tooltip
                            placement="top"
                            title={intl.formatMessage({
                              id: 'campaign.tip.title.file.error',
                              defaultMessage: 'Lỗi tập tin',
                            })}
                          >
                            <InfoCircleOutlined />
                          </Tooltip>
                        </span>
                      ) : null}
                    </span>
                  </p>
                </Col>

                <Col span={4} className="t-al-right">
                  <span
                    style={{ color: colors.GRAY, display: 'none' }}
                    onClick={handleRemove}
                  >
                    <DeleteOutlined />
                  </span>
                </Col>
              </Row>
            </>
          )}

          <Row className="mb-10">
            <Col offset={7}>
              <Typography.Text strong>
                <span style={{ color: 'red' }}>* </span>{' '}
                {intl.formatMessage({ id: 'message.content' })}
              </Typography.Text>
            </Col>
          </Row>
          <Row className="mb-10">
            <Col span={7}></Col>
            <Col span={12} className="">
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'campaign.required.content',
                      defaultMessage: 'Nội dung không được để trống',
                    })}`,
                  },
                ]}
              >
                <Input.TextArea
                  rows={5}
                  placeholder={intl.formatMessage({ id: 'input.content' })}
                  allowClear
                  onChange={handleChangeContent}
                  onBlur={handleBlurContent}
                  disabled
                />
              </Form.Item>
              <span className="c3 sub-title float-r"></span>
            </Col>
          </Row>
        </div>

        <Row className="mb-24">
          <Col span={7}></Col>
          <Col span={11} className="">
            <Button
              disabled={isLoading}
              loading={isLoading}
              className="mr-8"
              type="primary"
              key="submit"
              htmlType="submit"
            >
              <FormattedMessage
                id="account.action.update"
                defaultMessage="Cập nhật"
              />
            </Button>
            <Button
              type="default"
              key="rest"
              onClick={() => handleResetFields()}
            >
              <FormattedMessage
                id="account.action.cancel"
                defaultMessage="Hủy"
              />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default EditCampaignForm;
