const useTruncatedString = (string: any) => {
  const max_length = 25;
  const truncateString = (str: any) => {
    if (str.length <= max_length) {
      return str;
    } else {
      return str.slice(0, max_length) + '...';
    }
  };

  const truncatedStr = string ? truncateString(string) : string;

  return truncatedStr;
};

export default useTruncatedString;
