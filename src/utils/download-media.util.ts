import { load } from 'cheerio';

import { TMedia } from 'src/types/media.type';

export const getInstagramPostAPIURL = (url: string) => {
  const regex = /\/(p|reel)\/([A-Za-z0-9-_]+)/;
  const match = url.match(regex);
  if (match && match.length >= 3) {
    return `https://www.instagram.com/p/${match[2]}/?__a=1&__d=dis`;
  }
  return '';
};

const convertToBlobFile = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
};

export const getUnBlockedInstagramMediaUrl = (originUrl: string) => {
  const newUrl = new URL(originUrl);
  newUrl.hostname = 'scontent.cdninstagram.com';
  return `${process.env.WORKER_URL}/${newUrl.toString()}`;
};

export const getImageMedia = async (originUrl: string): Promise<TMedia> => {
  const downloadURL = URL.createObjectURL(await convertToBlobFile(originUrl));
  return {
    type: 'image',
    image: {
      previewURL: originUrl,
      downloadURL
    }
  };
};

export const formatInstagramMediaData = async (
  type: 'post' | 'story',
  data: any
): Promise<TMedia[]> => {
  let results: TMedia[] = [];
  if (type === 'post') {
    const targetData = data.items[0];
    if (
      !targetData.carousel_media &&
      !targetData.image_versions2.candidates[0].url &&
      !targetData.video_versions[0].url
    ) {
      throw new Error('Can not find media');
    }
    //Nếu bài viết có từ 2 ảnh/video trở lên
    if (targetData.carousel_media) {
      results = await Promise.all(
        targetData.carousel_media.map((mediaItem: any) => {
          const type = mediaItem.media_type === 1 ? 'image' : 'video';
          const thumbnail = getUnBlockedInstagramMediaUrl(
            mediaItem.image_versions2.candidates[0].url
          );
          if (type === 'image') {
            return getImageMedia(thumbnail);
          }
          return {
            type,
            video: {
              previewURL: thumbnail,
              downloadURL: mediaItem.video_versions[0].url
            }
          };
        })
      );
    } else {
      const type = targetData.media_type === 1 ? 'image' : 'video';
      const thumbnail = getUnBlockedInstagramMediaUrl(
        targetData.image_versions2.candidates[0].url
      );
      if (type === 'image') {
        results = [await getImageMedia(thumbnail)];
      } else {
        results = [
          {
            type,
            video: {
              previewURL: thumbnail,
              downloadURL: targetData.video_versions[0].url
            }
          }
        ];
      }
    }
  } else {
    const storyMediaList = data?.data?.reels_media[0]?.items;
    if (!storyMediaList) {
      throw new Error('Can not find media');
    }
    results = await Promise.all(
      storyMediaList.map((mediaItem: any) => {
        const type = mediaItem.is_video ? 'video' : 'image';
        const thumbnail = getUnBlockedInstagramMediaUrl(mediaItem.display_url);
        if (type === 'image') {
          return getImageMedia(thumbnail);
        }
        return {
          type,
          video: {
            previewURL: thumbnail,
            downloadURL: mediaItem.video_resources[0].src
          }
        };
      })
    );
  }
  return results;
};

export const formatFacebookMediaData = (data: string): TMedia => {
  const JSONFormat = JSON.stringify(data);
  const decodeHTML = JSON.parse(JSONFormat);
  const $ = load(decodeHTML);

  const thumbnail =
    $($('video')).attr('poster')?.replaceAll('&amp;', '&') || '';
  const videoURL = $($('video')).attr('src')?.replaceAll('&amp;', '&') || '';
  const audioURL =
    $($('input#audioUrl')[0]).attr('value')?.replaceAll('&amp;', '&') || '';

  let audio = undefined;
  if (audioURL) {
    audio = {
      downloadURL: audioURL
    };
  }
  return {
    type: 'video',
    video: { previewURL: thumbnail, downloadURL: videoURL },
    audio
  };
};

export const getDouyinURL = (originURL: string) => {
  const regex = /(https:\/\/[^\s]+)/;
  const match = originURL.match(regex);
  return match?.[0] || '';
};

export const formatDouyinMediaData = (data: any): TMedia[] => {
  const videoHDUrl =
    data.download_links.find((item: any) => item.label.includes('HD'))?.url ||
    data.download_links[0]?.url;
  const results: TMedia[] = [
    {
      type: 'video',
      video: {
        previewURL: data.thumbnail,
        downloadURL: videoHDUrl
      },
      audio: {
        downloadURL: data.download_links.pop().url
      }
    }
  ];
  return results;
};

export const formatTiktokMediaData = (data: any): TMedia => {
  const thumbnail: string = data.origin_cover;
  const videoURL: string = data.hdplay || data.wmplay || data.play;
  const audioURL: string = data.music;
  return {
    type: 'video',
    video: { previewURL: thumbnail, downloadURL: videoURL },
    audio: { downloadURL: audioURL }
  };
};

export const formatYoutubeMediaData = (data: any): TMedia => {
  const thumbnail = data.thumbnails.pop().url;
  const videoURLList: any[] = data.videos.items;
  let highestQualityVideo = videoURLList[0];
  for (let i = 1; i < videoURLList.length; i++) {
    if (videoURLList[i].height > highestQualityVideo.height) {
      highestQualityVideo = videoURLList[i];
    }
  }
  const audioURL = data.audios.items[0].url;
  return {
    type: 'video',
    video: { previewURL: thumbnail, downloadURL: highestQualityVideo.url },
    audio: { downloadURL: audioURL }
  };
};
