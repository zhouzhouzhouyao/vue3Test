import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { BASE_URL } from './config';

// 接口类型和方法
interface BaseType {
    baseURL: string;
    getConfigParams(): any;
    interceptors(intstance:AxiosInstance, url:string | number | undefined): any;
    request(options:AxiosRequestConfig): any;
}

interface AxiosRequestType {
    baseURL?: string;
    url?: string | undefined;
    data?: any;
    params?: any;
    method?: string;
    headers?: any;
    timeout?: number;
    value?: any;
    cancelToken?: any;
}

// 取消重复请求
const CancelToken = axios.CancelToken;
// 用于存储每个请求的取消函数记忆对应标识
const sources:any = [];

// 取消函数
const removeSource = (config:any) => {
  for (const item in sources) {
    if (sources[item].umet === config.url + '&' + config.method) {
      sources[item].cancel('已取消重复请求');
      sources.splice(item, 1);
    }
  }
};

class AxiosHttpRequest implements BaseType {
  baseURL: string;
  timeout: number;
  constructor () {
    this.baseURL = BASE_URL;
    this.timeout = 5000;
  }

  getConfigParams () {
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {}
    };
    return config;
  };

  // 拦截设置
  interceptors (instance: AxiosInstance, url: string | number | undefined) {
    // 请求拦截
    instance.interceptors.request.use((config: AxiosRequestType) => {
      // 取消重复请求
      removeSource(config);
      config.cancelToken = new CancelToken(c => {
        // 存储取消函数
        sources.push({ umet: config.url + '&' + config.method, cancel: c });
      });
      config.headers['Content-Type'] = 'application/json;charset=utf-8';
      // get请求映射params参数
      if (config.method === 'get' && config.params) {
        let url = config.url + '?';
        for (const propName of Object.keys(config.params)) {
          const value = config.params[propName];
          const part = encodeURIComponent(propName) + '=';
          if (value !== null && typeof (value) !== 'undefined') {
            if (typeof value === 'object') {
              for (const key of Object.keys(value)) {
                const params = propName + '[' + key + ']';
                const subPart = encodeURIComponent(params) + '=';
                url += subPart + encodeURIComponent(value[key]) + '&';
              }
            } else {
              url += part + encodeURIComponent(value) + '&';
            }
          }
        }
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
      }
      return config;
    }, (error:any) => {
      return Promise.reject(error);
    });

    // 响应拦截
    instance.interceptors.response.use((res:any) => {
      // 取消重复请求
      removeSource(res.config);
      // 未设置状态码则默认成功状态
      const code = res.data.code || 200;
      // 获取错误信息
      let msg = res.data.msg || '';
      switch (code) {
      case '401':
        msg = '认证失败，无法访问系统资源';
        break;
      case '403':
        msg = '当前操作没有权限';
        break;
      case '404':
        msg = '访问资源不存在';
        break;
      case 'default':
        msg = '系统未知错误，请反馈给管理员';
        break;
      default:
        // return '未知错误，请联系管理员';
        break;
      }
      if (code === 200) {
        return Promise.resolve(res.data);
      } else {
        ElMessage.error(msg);
        return Promise.reject(res.data);
      }
    }, (error:any) => {
      console.log('error' + error);
      let { message } = error;
      if (message === 'Network Error') {
        message = '后端接口连接异常';
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时';
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常';
      }
      ElMessage.error({
        message,
        duration: 5 * 1000
      });
      return Promise.reject(error);
    });
  };

  // 外部调用方法：@params options axios请求参数，@returns实例
  request (options: AxiosRequestConfig<any>) {
    const instance = axios.create();
    options = Object.assign(this.getConfigParams(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

// 实例化请求类
const http = new AxiosHttpRequest();

export default http;

// const Axios = axios.create({
//   timeout: 5000,
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/jsonlcharset=UTF-8'
//   }
// });

// // 添加请求拦截器
// Axios.interceptors.request.use(config => {
//   return config;
// });

// // 添加响应拦截器
// Axios.interceptors.response.use(reponse => {
//   return reponse.data;
// }, error => {
//   return Promise.reject(error);
// });

// export default Axios;
