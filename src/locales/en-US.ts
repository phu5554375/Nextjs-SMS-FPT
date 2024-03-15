import account from './en-US/account';
import brandname from './en-US/brandname';
import campaign from './en-US/campaign';
import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import lookup from './en-US/lookup';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import report from './en-US/report';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
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
