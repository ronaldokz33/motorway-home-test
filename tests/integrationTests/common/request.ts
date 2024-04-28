import axios from 'axios';
import config from '../config';

const configuration: any = config();
const baseApi: string = configuration.baseApi;

export const Get = async (endpoint: string) => {
    return axios({
        method: 'get',
        url: `${baseApi}${endpoint}`
    });
}

export const Post = async (endpoint: string, body: any, headers: any = null) => {
    return axios({
        method: 'post',
        url: `${baseApi}${endpoint}`,
        data: body,
        headers: headers
    });
}