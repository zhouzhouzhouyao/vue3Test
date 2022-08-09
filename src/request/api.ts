import http from './request';

export const getDrives = (data: string) => {
  return http.request({
    url: data,
    method: 'get'
  });
};
