declare namespace API_MTMESSAGE {
  type Message = {
    id?: string;
    telco?: string;
    mo_business_number?: string;
    mo_syntax?: string;
    phone_number?: string;
    delivered_at?: string;
    is_delivered?: number;
    is_charged?: number;
    is_sent?: number;
    error?: number;
  };

  type Params = {
    from?: string;
    to?: string;
    phone_number?: string;
    syntax?: string;
    is_charged?: number;
    telcos?: string;
    limit?: number;
    cursor?: any;
  };

  type ResponseMessage = {
    success: boolean;
    data?: Message[];
    cursor: {
      prev?: string | undefined;
      next?: string | undefined;
    };
  };

  //   ?page=1&limit=20&telcos=3,4&from=2019-02-12&to=2023-07-12
}
