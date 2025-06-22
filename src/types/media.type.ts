export type TMediaDetail = {
  previewURL: string;
  downloadURL: string;
};

export type TMediaType = 'image' | 'video';
export type TMedia = {
  type: TMediaType;
  image?: TMediaDetail;
  video?: TMediaDetail;
  audio?: Pick<TMediaDetail, 'downloadURL'>;
};
