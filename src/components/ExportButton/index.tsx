import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ExportButton = ({ onExportAction }: any) => {
  return (
    <div key="export">
      <Button
        style={{
          backgroundColor: 'rgb(56, 158, 13)',
          color: '#FFFFFF',
          borderRadius: '2px',
          marginRight: '8px',
        }}
        onClick={onExportAction}
        icon={<DownloadOutlined />}
      >
        Export
      </Button>
    </div>
  );
};

export default ExportButton;
