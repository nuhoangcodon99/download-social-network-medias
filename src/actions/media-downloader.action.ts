'use server';

import { GET, POST } from 'src/actions/http-request.action';
import {
  IGetFacebookMediaResponse,
  IGetStoryInstagramApiUrlResponse
} from 'src/types/apis/media-download.type';

export const getInstagramStoryAPIURL = async (body: FormData) => {
  const response = await POST<IGetStoryInstagramApiUrlResponse>(
    `${process.env.WORKER_URL}/${process.env.INSTAGRAM_STORY_API_URL}`,
    body
  );
  return response;
};

export const getFacebookMedia = async (body: FormData) => {
  const response = await POST<IGetFacebookMediaResponse>(
    `${process.env.WORKER_URL}/${process.env.FACEBOOK_MEDIA_API_URL}`,
    body
  );
  return response;
};

export const getDouyinMedia = async (url: string) => {
  const response = await GET<any>(process.env.DOUYIN_MEDIA_API_URL!, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY_FOR_DOUYIN
    },
    params: {
      url
    }
  });
  return response;
};

export const getTiktokMedia = async (url: string) => {
  const response = await GET<any>(process.env.TIKTOK_MEDIA_API_URL!, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY_FOR_TIKTOK
    },
    params: {
      url,
      hd: 1
    }
  });
  return response;
};

export const getYoutubeMedia = async (videoId: string) => {
  const response = await GET<any>(process.env.YOUTUBE_MEDIA_API_URL!, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY_FOR_YOUTUBE
    },
    params: {
      videoId,
      audios: 'true',
      videos: 'true'
    }
  });
  return response;
};
