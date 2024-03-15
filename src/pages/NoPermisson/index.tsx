import { history, useIntl } from '@umijs/max';
import { Button, Result } from 'antd';

export default function NoPermissionPage() {
  /** cấu hình language */
  const intl = useIntl();

  return (
    <Result
      status="403"
      title="403"
      subTitle={`${intl.formatMessage({ id: 'menu.exception.403' })}`}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({ id: 'action.back.home' })}
        </Button>
      }
    />
  );
}
