import { logout } from '@/services/auth';
import { jwt } from '@/utils/jwt';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { Spin } from 'antd';
// import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.full_name}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  children,
}) => {
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const { initialState, setInitialState } = useModel('@@initialState');

  const handleLogout = async () => {
    await logout();

    jwt.remove();
    localStorage.removeItem('isLogged');

    localStorage.setItem('href_before', history.location.pathname);

    if (window.location.pathname !== '/login') {
      history.replace({
        pathname: '/login',
        // search: stringify({ redirect: history.location.pathname }),
      });
    }

    flushSync(() => {
      setInitialState(s => ({ ...s, currentUser: undefined }));
    });
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;

      switch (key) {
        case 'logout':
          handleLogout();
          break;
        case 'profile':
          history.push(`/${key}/detail`);
          break;
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.full_name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Thông tin tài khoản',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
