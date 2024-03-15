class SmsCounter {
  static gsm7bitChars =
    '@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';

  static gsm7bitExChar = '\\^{}\\\\\\[~\\]|€';

  static gsm7bitRegExp = RegExp('^[' + SmsCounter.gsm7bitChars + ']*$');

  static gsm7bitExRegExp = RegExp(
    '^[' + SmsCounter.gsm7bitChars + SmsCounter.gsm7bitExChar + ']*$',
  );

  static gsm7bitExOnlyRegExp = RegExp(
    '^[\\' + SmsCounter.gsm7bitExChar + ']*$',
  );

  static GSM_7BIT = 'GSM_7BIT';

  static GSM_7BIT_EX = 'GSM_7BIT_EX';

  static UTF16 = 'UTF16';

  static messageLength: any = {
    GSM_7BIT: 160,
    GSM_7BIT_EX: 160,
    UTF16: 70,
  };

  static multiMessageLength: any = {
    GSM_7BIT: 153,
    GSM_7BIT_EX: 153,
    UTF16: 67,
  };

  static count(text: string) {
    let encoding: string,
      length: number,
      messages: number,
      per_message: number,
      remaining: number;
    encoding = SmsCounter.detectEncoding(text);
    length = text.length;

    if (encoding === SmsCounter.GSM_7BIT_EX) {
      length += SmsCounter.countGsm7bitEx(text);
    }

    per_message = SmsCounter.messageLength[encoding];

    if (length > per_message) {
      per_message = SmsCounter.multiMessageLength[encoding];
    }

    messages = Math.ceil(length / per_message);

    remaining = per_message * messages - length;

    if (remaining === 0 && messages === 0) {
      remaining = per_message;
    }

    return {
      encoding: encoding,
      length: length,
      per_message: per_message,
      remaining: remaining,
      messages: messages,
    };
  }

  static detectEncoding(text: string) {
    if (text.match(SmsCounter.gsm7bitRegExp)) {
      return SmsCounter.GSM_7BIT;
    } else if (text.match(SmsCounter.gsm7bitExRegExp)) {
      return SmsCounter.GSM_7BIT_EX;
    } else {
      return SmsCounter.UTF16;
    }
  }

  static countGsm7bitEx(text: string) {
    let char2: string;
    const chars: string[] = [];

    for (let _i = 0, _len = text.length; _i < _len; _i++) {
      char2 = text[_i];

      if (char2.match(SmsCounter.gsm7bitExOnlyRegExp)) {
        chars.push(char2);
      }
    }

    return chars.length;
  }
}

export default SmsCounter;
