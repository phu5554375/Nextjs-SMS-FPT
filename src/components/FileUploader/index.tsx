import { InboxOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useIntl } from 'umi';

const { Dragger } = Upload;

const FileUploader = ({ props, sample_file }: any) => {
  console.log(sample_file);

  const intl = useIntl();
  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {intl.formatMessage({ id: 'click.or.drag.file' })}
        </p>
        <p className="ant-upload-hint">
          {intl.formatMessage({ id: 'file.upload.xlsx' })}
        </p>
      </Dragger>
      <Button type="link" className="pa-0">
        {intl.formatMessage({
          id: 'download.file.tem.xlsx',
          defaultMessage: 'Tải về file mẫu.xlsx',
        })}
      </Button>
    </div>
  );
};

export default FileUploader;
