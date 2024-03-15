/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

export default function access(
  initialState: { currentUser?: API_AUTH.User; configs: any } | undefined,
) {
  const { currentUser, configs } = initialState ?? {};

  const hasPermission = (val: string): boolean => {
    return (
      currentUser?.is_admin === 1 || currentUser?.permissions.includes(val)
    );
  };

  return {
    canDashboardIndex: () => hasPermission('dashboard.index'),
    canCampaignsIndex: () => configs?.modules?.Brandname === true,
    canCampaignsStore: () => hasPermission('campaigns.store'),
    canCampaignsUpdate: () => hasPermission('campaigns.update'),
    canCampaignsDestroy: () => hasPermission('campaigns.destroy'),
    canCampaignsApprove: () => hasPermission('campaigns.approve'),
    canCampaignsCancel: () => hasPermission('campaigns.cancel'),
    canMessagesIndex: () => hasPermission('messages.index'),
    canReportsIndex: () => hasPermission('reports.index'),
    canMtMessagesIndex: () => hasPermission('mt_messages.index'),
    canMtReportsIndex: () => hasPermission('mt_reports.index'),
    canViewSMSText: () => hasPermission('sms_text.view'),
    canManageUsers: () => hasPermission('users.*'),
    canExport: () => hasPermission('exports.*'),
  };
}
