import { useAccess } from '@umijs/max';
import NoPermissionPage from '../NoPermisson';
import styles from './index.less';

export default function Page() {
  const access = useAccess();

  if (!access.canDashboardIndex) return <NoPermissionPage />;

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
