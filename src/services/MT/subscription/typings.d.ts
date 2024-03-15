declare namespace API_SUBSCRIPTION {
  type Subscription = {
    id?: number;
    business_number?: string;
    business_number_format?: string;
    text?: string;
    items?: Subscription[];
  };

  type ResponseSubscription = {
    success: boolean;
    data: Subscription[];
  };
}
