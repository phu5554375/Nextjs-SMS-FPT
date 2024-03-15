declare namespace API_FILES {

  type PageParams = {
    current?: number;
    pageSize?: number;
    q?: any;
  };

  type CurrentFile = {
    id: int;
    creator?: {
      id?: number;
      username?: string;
      email?: string;
      full_name?: string;
    };
    name?: string;
    path_hash?: string;
    size?: any;
    from?: any;
    to?: any;
    module?: string;
    status?: int;
    created_at?: any;
    updated_at?: any;
    expired_at?:any
  };


  type FileList = {
    success: boolean;
    data?: CurrentFile[];
    total?: number;
    page?:any
  };

}
