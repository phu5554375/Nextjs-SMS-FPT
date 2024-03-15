declare namespace API_CONFIG {
  type Telco = {
    label?: string;
    value?: number;
  };

  type Permission = {
    title?: string;
    enabled?: boolean;
    name?: string;
    description?: string;
    permissions?: Permission[];
  };

  type ResponseConfig = {
    success: boolean;
    data: {
      telcos?: Telco[];
      permissions?: Permission[];
      campaign_statuses?: CampaignStatuses[];
      sms_types?: SmsType[];
      campaign_types?: CampaignTypes[];
      'mo-mt-telcos'?: Telco[];
    };
  };

  type CampaignStatuses = {
    label?: string;
    value?: number;
  };

  type SmsType = {
    label?: string;
    value?: number;
  };

  type CampaignTypes = {
    label?: string;
    value?: number;
  };
}
