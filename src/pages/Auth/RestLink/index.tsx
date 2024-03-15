import defaultSettings from '@/../config/defaultSettings';
import { LoginForm } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from './index.less';

export default function Page() {
  /** cấu hình language */
  const intl = useIntl();

  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(59);

  const [isRunning] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds => seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes => minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [seconds, minutes, isRunning]);

  return (
    <div className={styles?.background}>
      <div className={styles.speech_bubble}>
        <div className="">
          <LoginForm
            contentStyle={{
              minWidth: 400,
              maxWidth: '90vw',
            }}
            logo={
              <img
                alt="logo"
                src={defaultSettings.logo}
                className={styles?.logo}
              />
            }
            subTitle={`${intl.formatMessage({ id: 'account.reset.pass' })}`}
            actions={''}
            submitter={{
              searchConfig: {
                submitText: `${intl.formatMessage({
                  id: 'account.btn.confirm',
                })}`,
              },
              submitButtonProps: { style: { display: 'none' } },
            }}
          >
            <div className="mb-16">
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'check.email.reset.link',
                })}
              </Typography.Text>
            </div>

            <div className="mb-16">
              <Typography.Text>
                {intl.formatMessage({
                  id: 'content.check.email.reset',
                })}
              </Typography.Text>
            </div>

            <div className="mb-20">
              <p className="sub-title c4 t-al-center">
                <span>
                  {intl.formatMessage({
                    id: 'reset.link.will.become.invalid',
                  })}
                </span>{' '}
                <Typography.Text strong>
                  <span>0{minutes}</span>
                  <span>:</span>
                  <span>
                    {String(seconds).length > 1
                      ? seconds
                      : '0'.concat(`${seconds}`)}
                  </span>
                </Typography.Text>
              </p>
            </div>

            {/* {minutes === 0 && ( */}
            <div className="mb-16 t-al-center">
              <a
                onClick={() => {
                  history.back();
                }}
              >
                {intl.formatMessage({ id: 'email.not.receiving' })}
              </a>
            </div>
            {/* )} */}
          </LoginForm>
        </div>
      </div>
    </div>
  );
}
