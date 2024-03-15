import dayjs from 'dayjs';

const FormattedDateTime = (value: any) => {
  return dayjs(value).format('DD/MM/YYYY hh:mm');
};

export default FormattedDateTime;
