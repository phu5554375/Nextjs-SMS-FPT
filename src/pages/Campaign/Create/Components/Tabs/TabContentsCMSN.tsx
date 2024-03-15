import FileUploader from '@/components/FileUploader';
import { importFile } from '@/services/file';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Form, UploadProps, message } from 'antd';
import { useState } from 'react';
import MenstionContent from '../Input/MentionContent';

const MAX_UPLOADS = 5;

const MAX_FILE_SIZE = 40 * 1024 * 1024;

const TabContentsCMSN = ({ tabKey, campaign_types, form }: any) => {
  const intl = useIntl();

  const [fileHeaders, setFileHeaders] = useState([]);

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

        if (response.success) {
          setFileHeaders(response?.data.headings);
          form.setFieldValue('file_import_id', response?.data.id);
        }

        onSuccess(response);
      } catch (error) {
        console.error('Upload error:', error);
        form.setFieldValue('file_import_id', null);
        setFileHeaders([]);
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
      setFileHeaders([]);
      console.log('Remove files:', e);
    },
  };

  return (
    <div>
      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label={
          <FormattedMessage
            id={'campaign.config'}
            defaultMessage="Cấu hình tin nhắn"
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

      <MenstionContent form={form} fileHeaders={fileHeaders} />
    </div>
  );
};

export default TabContentsCMSN;
