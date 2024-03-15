import { Modal as AntModal, Button, Col, Row } from 'antd';
import { Fragment } from 'react';

const Modal = ({ visible, onClose, onConfirm, loading, children }: any) => {
  return (
    <Fragment>
      <AntModal
        title={
          <Row>
            <Col span={2}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g>
                  <path
                    d="M12 0C5.37321 0 0 5.37321 0 12C0 18.6268 5.37321 24 12 24C18.6268 24 24 18.6268 24 12C24 5.37321 18.6268 0 12 0ZM12 21.9643C6.49821 21.9643 2.03571 17.5018 2.03571 12C2.03571 6.49821 6.49821 2.03571 12 2.03571C17.5018 2.03571 21.9643 6.49821 21.9643 12C21.9643 17.5018 17.5018 21.9643 12 21.9643Z"
                    fill="#1890FF"
                  />
                  <path
                    d="M10.7139 16.7143C10.7139 17.0553 10.8493 17.3823 11.0904 17.6234C11.3316 17.8645 11.6586 18 11.9996 18C12.3406 18 12.6676 17.8645 12.9087 17.6234C13.1498 17.3823 13.2853 17.0553 13.2853 16.7143C13.2853 16.3733 13.1498 16.0463 12.9087 15.8051C12.6676 15.564 12.3406 15.4286 11.9996 15.4286C11.6586 15.4286 11.3316 15.564 11.0904 15.8051C10.8493 16.0463 10.7139 16.3733 10.7139 16.7143ZM11.3567 13.7143H12.6424C12.7603 13.7143 12.8567 13.6179 12.8567 13.5V6.21429C12.8567 6.09643 12.7603 6 12.6424 6H11.3567C11.2389 6 11.1424 6.09643 11.1424 6.21429V13.5C11.1424 13.6179 11.2389 13.7143 11.3567 13.7143Z"
                    fill="#1890FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1351_126171">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Col>
            <Col span={22}>
              Export
              <br />
              <small style={{ fontWeight: 400, fontSize: '14px' }}>
                Hệ thống sẽ tự tạo tên file nếu để trống
              </small>
            </Col>
          </Row>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Huỷ
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={loading}
            onClick={onConfirm}
          >
            {loading ? 'Loading...' : 'OK'}
          </Button>,
        ]}
      >
        {children}
      </AntModal>
    </Fragment>
  );
};

export default Modal;
