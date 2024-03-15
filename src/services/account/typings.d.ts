declare namespace API_ACCOUNT {
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

  type CurrentAccount = {
    id: int;
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
  };

  // type AccountItem ={
  //   success: boolean;
  //   data?: CurrentAccount;
  // }

  type AccountList = {
    success: boolean;
    data?: CurrentAccount[];
    total?: number;
  };

  type UpdateAccoutResult = {
    success: boolean;
    data?: CurrentAccount;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    total?: number;
    success?: boolean;
  };
}
