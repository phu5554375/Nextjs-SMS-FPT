/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/componeemaints/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/login',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './Auth/Login',
      },
    ],
  },
  {
    path: '/forgot-password',
    layout: false,
    routes: [
      {
        name: 'forgot-password',
        path: '/forgot-password',
        component: './Auth/Forgot',
      },
    ],
  },

  {
    path: '/forgot-password-link',
    layout: false,
    routes: [
      {
        name: 'forgot-password-link',
        path: '/forgot-password-link',
        component: './Auth/RestLink',
      },
    ],
  },

  {
    path: '/towfactor',
    layout: false,
    routes: [
      {
        name: 'towfactor',
        path: '/towfactor',
        component: './Auth/Towfactor',
      },
    ],
  },
  {
    path: '/reset-password',
    layout: false,
    routes: [
      {
        name: 'reset-password',
        path: '/reset-password',
        component: './Auth/CreateNewPassword',
      },
    ],
  },
  {
    path: '/profile',
    routes: [
      {
        name: 'Profile',
        path: '/profile/detail',
        component: './Auth/Profile',
      },
      {
        name: 'Update Profile',
        path: '/profile/edit',
        component: './Auth/Profile/Edit',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'DashboardOutlined',
    component: './Dashboard',
    access: 'canDashboardIndex',
  },
  {
    path: '/accounts',
    name: 'Quản lý tài khoản',
    icon: 'UsergroupAddOutlined',
    access: 'canManageUsers',
    routes: [
      {
        path: '/accounts/list',
        name: 'Danh sách tài khoản',
        component: './Account',
      },
      {
        path: '/accounts/create',
        name: 'Tạo tài khoản con',
        component: './Account/SubAccount',
      },
      {
        path: '/accounts/:id',
        hideInMenu: true,
        name: 'Chi tiết tài khoản',
        component: './Account/Detail',
      },
      {
        path: '/accounts/:id/edit',
        hideInMenu: true,
        name: 'Cập nhật thông tin tài khoản',
        component: './Account/Edit',
      },
    ],
  },
  {
    path: '/momt',
    name: 'Dịch vụ MOMT',
    icon: 'FileMarkdownOutlined',
    routes: [
      {
        path: '/momt/reports',
        name: 'Báo cáo sản lượng',
        icon: 'smile',
        component: './MOMT/Report',
        access: 'canMtReportsIndex',
      },
      {
        path: '/momt/messages',
        name: 'Tra cứu tin nhắn',
        icon: 'message',
        component: './MOMT/Message',
        access: 'canMtMessagesIndex',
      },
    ],
  },
  {
    path: '/brandname',
    name: 'Dịch vụ Brandname',
    icon: 'FileSearchOutlined',
    routes: [
      {
        path: '/brandname/reports',
        name: 'Báo cáo sản lượng',
        component: './Brandname/Report',
        access: 'canReportsIndex',
      },
      {
        path: '/brandname/messages',
        name: 'Tra cứu tin nhắn',
        component: './Brandname/Lookup',
        access: 'canMessagesIndex',
      },
    ],
  },
  {
    path: '/campaigns',
    name: 'Quản lý chiến dịch',
    icon: 'RocketOutlined',
    access: 'canCampaignsIndex',
    routes: [
      {
        path: '/campaigns/list',
        name: 'Danh sách chiến dịch',
        component: './Campaign',
        access: 'canCampaignsIndex',
      },
      {
        path: '/campaigns/create',
        name: 'Thêm chiến dịch',
        component: './Campaign/Create',
        access: 'canCampaignsStore',
      },
      {
        path: '/campaigns/:id',
        hideInMenu: true,
        name: 'Chi tiết chiến dịch',
        component: './Campaign/Detail',
      },
      {
        path: '/campaigns/:id/edit',
        hideInMenu: true,
        name: 'Cập nhật chiến dịch',
        access: 'canCampaignsUpdate',
        component: './Campaign/Edit',
      },
    ],
  },
  {
    path: '/exports/list',
    name: 'Quản lý Export',
    icon: 'SearchOutlined',
    component: './Export',
  },

  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
  {
    path: '*',
    layout: false,
    component: './403',
  },
];
