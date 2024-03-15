import { useFormatNumber as formatNumber } from '@/hooks/useFormatNumber';
import { useIntl } from '@umijs/max';
import { Card, Col, Row } from 'antd';
import styles from './index.less';

const Summary = ({ items }: any) => {
  const intl = useIntl();

  const summary = items?.summary || {};
  const transformedColumns = Object.entries(summary).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <>
      {transformedColumns.length > 0 ? (
        <Card className="mb-24">
          <Row gutter={[10, 10]} className={styles.spacesumary}>
            {transformedColumns.map((column, index) => (
              <Col key={index} className="">
                <span className={styles.title}>
                  {intl.formatMessage({
                    id: `report.${column.key}`,
                    defaultMessage: column.key,
                  })}
                </span>
                <br />
                <span className={styles.value}>
                  {formatNumber(column.value)}
                </span>
              </Col>
            ))}
          </Row>
        </Card>
      ) : null}
    </>
  );
};

export default Summary;
