import axios, {
    AxiosError,
    // AxiosPromise,
    // AxiosRequestConfig,
    // AxiosResponse,
  } from "axios";
//   import { ElMessage } from "element-plus";
  
  const request = axios.create({
    baseURL: import.meta.env.VITE_BE_HOST as string + '/api',
  });
  
  request.interceptors.response.use(
    function (response) {
      return response;
    },
    // function (error: AxiosError) {
    //   ElMessage({
    //     dangerouslyUseHTMLString: true,
    //     message: `${error.message}<br/>${error.config.method} ${error.config.baseURL}${error.config.url}`,
    //     type: "error",
    //   });
  
    //   return Promise.reject(error);
    // }
  );
  
  export interface CommonResponse {
    code: number;
    msg: string;
    data: any;
  }
  
  export default request;