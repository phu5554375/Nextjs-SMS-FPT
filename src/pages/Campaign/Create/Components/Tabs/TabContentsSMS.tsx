import DateTimePicker from '@/components/DatetimePicker';
import FileUploader from '@/components/FileUploader';
import { importFile } from '@/services/file';
import { TELCO_CONFIGS } from '@/utils/constants';
import SmsCounter from '@/utils/sms-counter';
import { InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Form, Table, Tooltip, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import { UploadProps } from 'antd/lib/upload';
import { useState } from 'react';
import counter from '../../functions';
import SMSTypeInput from '../Input/SMSTypeInput';

const MAX_UPLOADS = 5;

const MAX_FILE_SIZE = 40 * 1024 * 1024;

const TabContentsSMS = ({
  tabKey,
  sms_types,
  telcos,
  campaign_types,
  form,
  onDateTimeChange,
}: any) => {
  const [content, setContent] = useState('');

  const [smsType, setSmsType] = useState(null);

  const intl = useIntl();

  const onChangeSmsType = (value: any) => {
    setSmsType(value);
  };

  const props: UploadProps = {
    name: 'file',
    accept: '.xlsx',
    maxCount: 1,
    async customRequest({ file, onSuccess, onError }: any) {
      try {
        const campaignTypeInfo = campaign_types.find(
          (items: any) => items.label === tabKey,
        );
        const response = await importFile({
          file,
          campaign_type: campaignTypeInfo.value,
        });

        form.setFieldValue('file_import_id', response?.data.id);
        onSuccess(response);
      } catch (error) {
        console.error('Upload error:', error);
        form.setFieldValue('file_import_id', null);
        onError(error);
      }
    },
    beforeUpload(file, FileList) {
      const isLtSize = file.size <= MAX_FILE_SIZE;
      if (!isLtSize) {
        message.error(`Kích thước tệp không được vượt quá 10MB`);
      }
      const isLtCount = FileList.length < MAX_UPLOADS;
      if (!isLtCount) {
        message.error(`Chỉ được tải lên tối đa ${MAX_UPLOADS} tệp`);
      }
      return isLtSize && isLtCount;
    },
    onChange(info) {
      console.log('Upload status:', info.file.status);
    },
    onDrop(e) {
      console.log('Dropped files:', e.dataTransfer.files);
    },
    onRemove(e) {
      form.setFieldValue('file_import_id', null);
      console.log('Remove files:', e);
    },
  };

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: 'Nhà mạng',
      dataIndex: 'telco',
      render: (value: any) =>
        telcos.find((item: any) => item.value === value)?.label,
    },
    {
      title: 'Số lượng tin nhắn',
      dataIndex: 'mt',
      align: 'right',
      render: (value: any, record: any) => {
        return smsType === 2
          ? counter(content, record.telco)
          : SmsCounter.count(content).messages;
      },
    },
  ];

  return (
    <div>
      <SMSTypeInput sms_types={sms_types} onChangeSmsType={onChangeSmsType} />

      <DateTimePicker onDateTimeChange={onDateTimeChange} />

      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label={
          <FormattedMessage
            id={'campaign.phone'}
            defaultMessage="Số điện thoại"
          />
        }
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
        <FileUploader props={props} />
      </Form.Item>

      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        name="content"
        label={
          <FormattedMessage
            id={'message.content'}
            defaultMessage="Nội dung tin nhắn"
          />
        }
        rules={[{ required: true, min: 3, max: 1000 }]}
      >
        <TextArea
          value={content}
          rows={5}
          minLength={3}
          maxLength={1000}
          onChange={e => setContent(e.target.value)}
          showCount={{
            formatter: (args: {
              value: string;
              count: number;
              maxLength?: number;
            }) => {
              return SmsCounter.count(args.value).length;
            },
          }}
          placeholder={intl.formatMessage({
            id: 'message.content',
            defaultMessage: 'Nội dung tin nhắn',
          })}
        />
      </Form.Item>

      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label={
          <div>
            {'Thông tin'}{' '}
            <Tooltip style={{ color: 'gray' }} title="">
              <InfoCircleOutlined />
            </Tooltip>
          </div>
        }
      >
        <Table
          columns={columns}
          rowKey="key"
          pagination={false}
          dataSource={TELCO_CONFIGS}
        />
      </Form.Item>
    </div>
  );
};

export default TabContentsSMS;
