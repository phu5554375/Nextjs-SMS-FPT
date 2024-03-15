import { TELCO_FORMULA } from '@/utils/constants';
import SmsCounter from '@/utils/sms-counter';

const counter = (content: any, telco: any) => {
  const regex =
    /[áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/;
  const isVietnameseText = regex.test(content) || false;

  const length = SmsCounter.count(content).length;

  const hasAccentVietnameseText: any = isVietnameseText
    ? 'diacritics'
    : 'with_out_diacritics';

  const telcoInfo: any = TELCO_FORMULA.find(item => item.telco === telco);

  const lengthRanges = telcoInfo?.message_lengths[hasAccentVietnameseText];

  let lastKey: any = 0;

  for (const key in lengthRanges) {
    if (lengthRanges.hasOwnProperty(key)) {
      if (length >= lengthRanges[key].min && length <= lengthRanges[key].max) {
        return key;
      }
      lastKey = key;
    }
  }

  return length > 0 ? lastKey : 0;
};

export default counter;
