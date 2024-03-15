import { history, useIntl } from '@umijs/max';
import { Button, Result } from 'antd';

export default function NotPermissionPage() {
  /** cấu hình language */
  const intl = useIntl();

  return (
    <Result
      subTitle={`${intl.formatMessage({ id: 'error.page.edit.account' })}`}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({ id: 'action.back.home' })}
        </Button>
      }
    />
  );
}
