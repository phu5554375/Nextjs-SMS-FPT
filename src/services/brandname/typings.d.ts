declare namespace API_BRANDNAME {
  type BrandnameItem = {
    id?: any;
    name?: string;
  };

  type BrandnameList = {
    success?: boolean;
    data?: BrandnameItem[];    
  };
}