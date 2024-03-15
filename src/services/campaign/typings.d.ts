declare namespace API_CAMPAIGN {
  type PageParams = {
    current?: number;
    pageSize?: number;
    q?: any;
  };

  type Campaign = {
    brandname_id: int;
    title: string;
    file_import_id: int;
    scheduled_at: string;
    type: int;
    sms_type: int;
    content: string;
  };

  type CurrentCampaign = {
    id: int;
    brandname?: any;
    title?: string;
    type?: number;
    sms_type?: float;
    messages_count?: float;
    messages_delivered_count?: float;
    messages_failed_count?: float;
    messages_invalid_count?: float;
    messages_succeed_count?: float;
    status: number;
    is_approved?: number;
    is_cancelled?: number;
    approved_at?: string;
    cancelled_at?: any;
    scheduled_at?: any;
    created_at?: any;
    updated_at?: any;
    percentage_of_process: number;
    invalid_percentage_of_process: number;
    code?: any;
    template_id?: any;
    brandname_id?: any;
    file_import_id?: any;
    file?: any;
    percentage_of_process?: any;
    code?: any;
    created_by?: any;
  };

  type CampaignList = {
    success: boolean;
    data?: CurrentCampaign[];
    total?: number;
  };

  type UpdateCampaignResult = {
    success: boolean;
    data?: CurrentCampaign;
  };

  type CurrentCampaignMesages = {
    id: int;
    recipent?: string;
    status?: any;
    telco?: any;
    text?: string;
    delivered_at?: any;
  };

  type CurrentCampaignInvalidMesages = {
    id: int;
    row?: any;
    recipent?: any;
    text?: string;
    errors?: string;
  };
}
