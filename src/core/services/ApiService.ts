import type { App } from 'vue';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import VueAxios from 'vue-axios';
import JwtService from '@/core/services/JwtService';
import Swal from 'sweetalert2/dist/sweetalert2.js';

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
    /**
     * @description property to share vue instance
     */
    public static vueInstance: App;

    /**
     * @description initialize vue axios
     */
    public static init(app: App<Element>) {
        ApiService.vueInstance = app;
        ApiService.vueInstance.use(VueAxios, axios);
        ApiService.vueInstance.axios.defaults.baseURL =
            import.meta.env.VITE_APP_API_URL;

        ApiService.vueInstance.axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                const messages = error.response.data.message;
                if (typeof messages == 'object') {
                    messages.forEach((msg: string) => {
                        Swal.fire({
                            text: msg as string,
                            icon: 'error',
                            buttonsStyling: false,
                            confirmButtonText: 'Try again!',
                            heightAuto: false,
                            customClass: {
                                confirmButton:
                                    'btn fw-semobold btn-light-danger',
                            },
                        });
                    });
                } else {
                    Swal.fire({
                        text: messages as string,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Try again!',
                        heightAuto: false,
                        customClass: {
                            confirmButton: 'btn fw-semobold btn-light-danger',
                        },
                    });
                }

                return Promise.reject(messages);
            },
        );
    }

    /**
     * @description set the default HTTP request headers
     */
    public static setHeader(): void {        
        ApiService.vueInstance.axios.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${JwtService.getToken()}`;
        ApiService.vueInstance.axios.defaults.headers.common['Accept'] =
            'application/json, text/plain, */*';
    }

    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static query(resource: string, params: any): Promise<AxiosResponse> {
        ApiService.setHeader();
        return ApiService.vueInstance.axios.get(resource, params);
    }

    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param slug: string
     * @returns Promise<AxiosResponse>
     */
    public static get(
        resource: string,
        slug = '' as string,
    ): Promise<AxiosResponse> {
        ApiService.setHeader();
        return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
    }

    /**
     * @description set the POST HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static post(resource: string, params: any): Promise<AxiosResponse> {
        ApiService.setHeader();
        return ApiService.vueInstance.axios.post(`${resource}`, params);
    }

    /**
     * @description send the UPDATE HTTP request
     * @param resource: string
     * @param slug: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static update(
        resource: string,
        params: any,
    ): Promise<AxiosResponse> {
        ApiService.setHeader();
        return ApiService.vueInstance.axios.put(`${resource}`, params);
    }

    /**
     * @description Send the PUT HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static put(resource: string, params: any): Promise<AxiosResponse> {
        ApiService.setHeader();
        return ApiService.vueInstance.axios.put(`${resource}`, params);
    }

    /**
     * @description Send the DELETE HTTP request
     * @param resource: string
     * @returns Promise<AxiosResponse>
     */
    public static delete(resource: string): Promise<AxiosResponse> {
        ApiService.setHeader();
        return ApiService.vueInstance.axios.delete(resource);
    }
}

export default ApiService;
