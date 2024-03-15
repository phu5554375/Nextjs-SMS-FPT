const useMaskedPhone = (phone: string | undefined) => {
  return phone ? phone.replace(/(\d{2})\d+(\d{3})/, '$1*****$2') : phone;
};

export default useMaskedPhone;
