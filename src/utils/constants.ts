export const TELCO_CONFIGS = [
  {
    key: 1,
    telco: 1,
    mt_short_length: 160,
    mt_long_length: 153,
  },
  {
    key: 2,
    telco: 2,
    mt_short_length: 160,
    mt_long_length: 153,
  },
  {
    key: 3,
    telco: 3,
    mt_short_length: 160,
    mt_long_length: 153,
  },
  {
    key: 4,
    telco: 4,
    mt_short_length: 160,
    mt_long_length: 153,
  },
  {
    key: 5,
    telco: 5,
    mt_short_length: 160,
    mt_long_length: 153,
  },
];

export const TELCO_FORMULA = [
  {
    key: 1,
    telco: 1,
    message_lengths: {
      diacritics: {
        '1': { min: 1, max: 70 },
        '2': { min: 71, max: 134 },
        '3': { min: 135, max: 201 },
        '4': { min: 202, max: 268 },
      },
      with_out_diacritics: {
        '1': { min: 1, max: 160 },
        '2': { min: 161, max: 306 },
        '3': { min: 307, max: 459 },
        '4': { min: 460, max: 612 },
        '5': { min: 613, max: 765 },
      },
    },
  },
  {
    key: 2,
    telco: 2,
    message_lengths: {
      diacritics: {
        '1': { min: 1, max: 268 },
        '2': { min: 269, max: 335 },
      },
      with_out_diacritics: {
        '1': { min: 1, max: 459 },
        '2': { min: 460, max: 612 },
      },
    },
  },
  {
    key: 3,
    telco: 3,
    message_lengths: {
      diacritics: {
        '1': { min: 1, max: 70 },
        '2': { min: 71, max: 134 },
        '3': { min: 135, max: 201 },
        '4': { min: 202, max: 268 },
        '5': { min: 269, max: 335 },
      },
      with_out_diacritics: {
        '1': { min: 1, max: 160 },
        '2': { min: 161, max: 306 },
        '3': { min: 307, max: 459 },
        '4': { min: 460, max: 612 },
        '5': { min: 613, max: 765 },
      },
    },
  },
  {
    key: 4,
    telco: 4,
    message_lengths: {
      diacritics: {
        '1': { min: 1, max: 126 },
        '2': { min: 127, max: 272 },
        '3': { min: 273, max: 425 },
      },
      with_out_diacritics: {
        '1': { min: 1, max: 126 },
        '2': { min: 127, max: 272 },
        '3': { min: 273, max: 425 },
      },
    },
  },
  {
    key: 5,
    telco: 5,
    message_lengths: {
      diacritics: {
        '1': { min: 1, max: 160 },
        '2': { min: 161, max: 306 },
        '3': { min: 307, max: 459 },
        '4': { min: 460, max: 612 },
      },
      with_out_diacritics: {
        '1': { min: 1, max: 160 },
        '2': { min: 161, max: 306 },
        '3': { min: 307, max: 459 },
        '4': { min: 460, max: 612 },
      },
    },
  },
];
