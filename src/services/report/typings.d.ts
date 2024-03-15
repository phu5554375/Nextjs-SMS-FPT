declare namespace API_BRANDNAME_REPORT {
  type Report = {
    key?: string;
    sms_type?: number;
    messages_delivered_count?: number;
    messages_pending_count?: number;
    messages_succeed_count?: number;
    messages_failed_count?: number;
    subtotal?: number;
    amount?: number;
    delivered_on?: string;
    brandname?: { id?: number; name?: string };
    children?: Report[];
  };

  type Params = {
    from?: string;
    to?: string;
    type?: string;
    brandname_ids?: string;
    telcos?: string;
    sms_types?: string;
  };

  type ResponseReport = {
    success: boolean;
    data?: Report[];
  };
}
