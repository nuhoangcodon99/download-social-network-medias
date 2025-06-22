'use server';
import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create();

export const GET = async <T>(
  endPoint: string,
  configs?: AxiosRequestConfig
) => {
  try {
    const { data } = await axiosInstance.get<T>(endPoint, {
      ...configs
    });
    return data;
  } catch (error) {
    throw new Error('Failed request');
  }
};

export const POST = async <T>(
  endPoint: string,
  data: any,
  configs?: AxiosRequestConfig
) => {
  try {
    const { data: responseData } = await axiosInstance.post<T>(endPoint, data, {
      ...configs
    });
    return responseData;
  } catch (error) {
    throw new Error('Failed request');
  }
};
