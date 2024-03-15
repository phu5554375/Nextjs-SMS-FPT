import { history, useIntl } from '@umijs/max';
import { Button, Result } from 'antd';

export default function NoFoundPage() {
  /** cấu hình language */
  const intl = useIntl();

  return (
    <Result
      status="403"
      title="403"
      subTitle={`${intl.formatMessage({ id: 'app.not.access.page' })}`}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({ id: 'action.back.home' })}
        </Button>
      }
    />
  );
}
