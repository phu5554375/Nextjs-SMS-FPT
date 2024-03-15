import { useIntl } from '@umijs/max';
import { Col, DatePicker, Form, Row, TimePicker } from 'antd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useState } from 'react';
dayjs.extend(isSameOrBefore);

const DateTimePicker = ({ onDateTimeChange }: any) => {
  const intl = useIntl();

  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);

  useEffect(() => {
    const now = dayjs();
    setSelectedDate(dayjs());
    setSelectedTime(dayjs());
    if (onDateTimeChange) {
      onDateTimeChange({
        date: now,
        time: now,
      });
    }
  }, []);

  const handleDateChange = (value: any) => {
    setSelectedDate(value);
    if (onDateTimeChange) {
      onDateTimeChange({
        date: value,
        time: selectedTime,
      });
    }
  };

  const handleTimeChange = (value: any) => {
    setSelectedTime(value);
    if (onDateTimeChange) {
      onDateTimeChange({
        date: selectedDate,
        time: value,
      });
    }
  };

  return (
    <Form.Item
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      label={intl.formatMessage({
        id: 'campaign.sending.date',
        defaultMessage: 'Thời gian gửi',
      })}
      name="scheduled_at"
      rules={[
        {
          required: true,
        },
        {
          validator: (rule: any, value: string, cb: (msg?: string) => void) => {
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
      <Row gutter={16}>
        <Col span={16}>
          <DatePicker
            placeholder={intl.formatMessage({
              id: 'campaign.sending.time',
              defaultMessage: 'Thời gian gửi',
            })}
            onChange={handleDateChange}
            className="w-100-p"
            value={selectedDate}
          />
        </Col>
        <Col span={8}>
          <TimePicker
            onChange={handleTimeChange}
            format={'HH:mm'}
            className="w-100-p"
            value={selectedTime}
          />
        </Col>
      </Row>
    </Form.Item>
  );
};

export default DateTimePicker;
