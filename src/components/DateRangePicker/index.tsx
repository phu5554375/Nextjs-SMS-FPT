import { ProFormDateRangePicker } from '@ant-design/pro-components';

const DateRangePicker = () => {
  return (
    <ProFormDateRangePicker
      name="dateRange"
      fieldProps={{
        format: value => value.format('YYYY-MM-DD'),
        // disabledDate: date => {
        //     const currentDate = new Date();
        //     const minDate = new Date(currentDate);
        //     minDate.setDate(currentDate.getDate() - 45);
        //     currentDate.setHours(0, 0, 0, 0);
        //     return date.valueOf() < minDate.valueOf();
        // },
      }}
    />
  );
};

export default DateRangePicker;
