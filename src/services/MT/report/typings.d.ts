declare namespace API_MTREPORT {
  type Report = {
    key: string;
    mo_syntax?: string;
    telco?: string;
    date?: string;
    mo_business_number?: string;
    mo_sms_total?: number;
    mo_spam_total?: number;
    mt_sms_total?: number;
    mt_cdr_total?: number;
    amount?: number;
    children?: MTReport[];
  };

  type Params = {
    title?: string;
    business_number?: string;
    from?: Date;
    group_by?: string;
    telcos?: string;
    to?: Date;
  };

  type ResponseReport = {
    success: boolean;
    data?: Report[];
  };
}
