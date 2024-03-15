import { history, useIntl } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

export default function ErrorPageEdit() {
  /** cấu hình language */
  const intl = useIntl();
  
    return (
      <Result
        subTitle={`${intl.formatMessage({id:'error.page.edit.account'})}`}
        extra={
          <Button type="primary" onClick={() => history.push('/')}>
            {intl.formatMessage({id:'action.back.home'})}
          </Button>
        }
      />
    );
}

