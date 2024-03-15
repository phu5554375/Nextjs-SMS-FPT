export const jwt = {
  set: (token: string) => localStorage.setItem('token', token),
  get: () => localStorage.getItem('token') || Date.now().toString(),
  remove: () => localStorage.removeItem('token'),
};

// import Cookies from 'js-cookie';

// const accessTokenKey = 'access_token';

// const objCookies = {
//   expires: 30,
//   domain: process.env.COOKIE_DOMAIN || 'localhost:8000',
// };

// export const jwt = {
//   set: (token: string) => {
//     if (token) {
//       Cookies.set(accessTokenKey, token, {
//         ...objCookies,
//       });
//     } else {
//       Cookies.remove(accessTokenKey, {
//         ...objCookies,
//         path: '/',
//         domain: process.env.COOKIE_DOMAIN || 'localhost:8000',
//       });
//     }
//   },
//   get: () => {
//     return Cookies.get(accessTokenKey);
//   },
//   remove: () => {
//     const access_token = Cookies.get(accessTokenKey);
//     if (access_token) {
//       Cookies.remove(accessTokenKey, {
//         ...objCookies,
//         path: '/',
//         domain: process.env.COOKIE_DOMAIN || 'localhost:8000',
//       });
//     }
//   },
// };
