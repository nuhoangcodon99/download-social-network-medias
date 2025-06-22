'use client';

import { Box, Button } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getDouyinMedia } from 'src/actions/media-downloader.action';
import MediaItem from 'src/components/ui/features/media-downloader/MediaItem';
import Input from 'src/components/ui/shared/Input';
import { useShowToast } from 'src/hooks/useShowToast';
import { TTiktokDownloadForm } from 'src/types/form.type';
import { TMedia } from 'src/types/media.type';
import {
  formatDouyinMediaData,
  getDouyinURL
} from 'src/utils/download-media.util';
import { TiktokDownloadValidationSchema } from 'src/utils/validations/form.validation';

const DouyinDownloader = () => {
  const { showToast } = useShowToast();
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<TMedia[]>([]);

  const { control, handleSubmit } = useForm<TTiktokDownloadForm>({
    resolver: zodResolver(TiktokDownloadValidationSchema),
    defaultValues: {
      url: ''
    }
  });

  const onSubmitForm = async (formValues: TTiktokDownloadForm) => {
    const targetUrl = getDouyinURL(formValues.url);
    try {
      setIsGettingData(true);
      const data = await getDouyinMedia(targetUrl);
      const mediaItems = formatDouyinMediaData(data.data);
      setMediaList(mediaItems);
      showToast('success', 'Lấy dữ liệu thành công!');
    } catch (error) {
      showToast('error', 'Đã xảy ra lỗi trong quá trình lấy dữ liệu!');
    } finally {
      setIsGettingData(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Controller
        control={control}
        name="url"
        render={({ field: { ref, ...otherFields }, fieldState: { error } }) => (
          <Input
            label="Dán đường link douyin cần tải vào đây. Hãy đảm bảo đường link là hợp lệ"
            placeholder="Link douyin cần tải"
            {...otherFields}
            errorText={error?.message}
          />
        )}
      />
      <Button
        colorScheme="purple"
        onClick={handleSubmit(onSubmitForm)}
        isLoading={isGettingData}
        loadingText="Đang lấy dữ liệu"
      >
        Lấy dữ liệu
      </Button>
      <Box
        display="flex"
        gap={3}
        mt={3}
        flexWrap="wrap"
        justifyContent="space-evenly"
      >
        {mediaList.map((item, index) => (
          <MediaItem mediaItem={item} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default DouyinDownloader;
