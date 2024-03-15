declare namespace API_LOOKUP {
  type AccountParams = {
    current?: number;
    pageSize?: number;
    sort?: any;
    filter?: any;
  };
  type PageParams = {
    current?: number;
    pageSize?: number;
    q?: any;
  };
 

  type CurrentLookup = {
    id: int;
    title?: string;
    username?: string;
    full_name?: string;
    phone_number?: string;
    email?: string;
    is_admin?: any;
    enabled?: any;
    created_by?: any;
    created_at?: string;
    brandnames?: { id?: any; name?: string }[];
    permissions?: [];
    updated_by?: any;
    updated_at?: any;
    is_cancelled?: any;
    messages_invalid_count?: any;
    sender?: any;
    text?: any;
    campaign?: any;
    delivered_at?: any;
    error?: any;
    
    
  };

  type Params = {
    from?: string;
    to?: string;
    phone_number?: string;
    syntax?: cursor;
    is_charged?: number;
    telcos?: string;
    limit?: number;
    cursor?:any
  };
  
  type ResponseMessage = {
    success: boolean;
    data?: Message[];
    cursor: {
      prev?: string | undefined;
      next?: string | undefined;
    };
  };
}
