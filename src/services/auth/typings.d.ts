declare namespace API_AUTH {
  type ChangePassword = {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  };

  type User = {
    id: int;
    username?: string;
    full_name?: string;
    email?: string;
    phone_number?: string;
    is_admin?: number;
    enabled?: number;
    old_password?: string;
    new_password?: string;
    confirm_new_password?: string;
    brandnames?: { id?: number; name?: string }[];
    permissions?: any;
    created_by?: {
      id?: number;
      email?: string;
      full_name?: string;
      username?: string;
    };
    updated_by?: {
      id?: number;
      email?: string;
      full_name?: string;
      username?: string;
    };
    updated_at?: string;
    created_at?: string;
  };

  type LoginResult = {
    success: boolean;
    data: {
      is_required_TFA: boolean,
      access_token: string;
      token_type: string;
      expires_in: number;
    };
  };

  type LoginParams = {
    username: string;
    password: string;
    code?: string;
    rememberMe?: boolean;
  };

  type ForgotPassParams = {
    email?: string;
  };

  type ResetPassParams = {
    password?: string;
    password_confirmation?: string;
    token?: string;
    email?: string;
  };
}
