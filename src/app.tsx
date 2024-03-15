import { AvatarDropdown, AvatarName, Footer, SelectLang } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/auth';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { requestConfig } from './requestConfig';
import { fetchAllConfig } from './services/config';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API_AUTH.User;
  configs?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API_AUTH.User | undefined>;
  fetchConfig?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchConfig = async () => {
    try {
      const response = await fetchAllConfig({
        skipErrorHandler: true,
      });

      if (response.data && response.data.telcos) {
        const transformedTelco = response?.data?.telcos.map((items: any) => {
          return {
            label: items.label.charAt(0).toUpperCase() + items.label.slice(1),
            value: items.value,
          };
        });
        const transformedMoMtTelco = response?.data['mo-mt-telcos']?.map(
          (items: any) => {
            return {
              label: items.label.charAt(0).toUpperCase() + items.label.slice(1),
              value: items.value,
            };
          },
        );
        return {
          ...response.data,
          telcos: transformedTelco,
          'mo-mt-telcos': transformedMoMtTelco,
        };
      }
      return response.data;
    } catch (error) {
      console.log('Error fetching config data:', error);
    }
    return undefined;
  };

  if (localStorage.getItem('isLogged')) {
    const currentUser = await fetchUserInfo();
    const configs = await fetchConfig();
    return {
      fetchConfig,
      fetchUserInfo,
      currentUser,
      configs,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    fetchConfig,
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [<SelectLang key="SelectLang" />],
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>;
      },
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },

    breadcrumbRender: (routers = []) => {
      const transformRoute = routers.map((item) => {
        return {
          ...item,
          linkPath: undefined,
        }
      });
      return transformRoute;
    },
    links: [],
    menuHeaderRender: undefined,

    childrenRender: children => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={settings => {
                setInitialState(preInitialState => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request = {
  ...requestConfig,
};
