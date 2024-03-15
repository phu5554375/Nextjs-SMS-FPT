import account from './vi-VN/account';
import brandname from './vi-VN/brandname';
import campaign from './vi-VN/campaign';
import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import lookup from './vi-VN/lookup';
import menu from './vi-VN/menu';
import pages from './vi-VN/pages';
import pwa from './vi-VN/pwa';
import report from './vi-VN/report';
import settingDrawer from './vi-VN/settingDrawer';
import settings from './vi-VN/settings';

export default {
  'navBar.lang': 'Ngôn ngữ',
  'layout.user.link.help': 'Trợ giúp',
  'layout.user.link.privacy': 'Chính sách bảo mật',
  'layout.user.link.terms': 'Điều kiện',
  'app.copyright.produced': 'Produced by FPT Telecom',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list':
    'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...account,
  ...campaign,
  ...lookup,
  ...report,
  ...brandname,
};
