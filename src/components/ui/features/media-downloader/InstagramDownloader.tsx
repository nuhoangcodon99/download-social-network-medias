'use client';
import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getInstagramStoryAPIURL } from 'src/actions/media-downloader.action';
import MediaItem from 'src/components/ui/features/media-downloader/MediaItem';
import Input from 'src/components/ui/shared/Input';
import RadioSelect from 'src/components/ui/shared/RadioSelect';
import Textarea from 'src/components/ui/shared/TextArea';
import { useShowToast } from 'src/hooks/useShowToast';
import { TInstagramDownloadForm } from 'src/types/form.type';
import { TMedia } from 'src/types/media.type';
import {
  formatInstagramMediaData,
  getInstagramPostAPIURL
} from 'src/utils/download-media.util';
import { InstagramDownloadValidationSchema } from 'src/utils/validations/form.validation';

const InstagramDownloader = () => {
  const { showToast } = useShowToast();
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const [isGettingAPIURL, setIsGettingAPIURL] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<TMedia[]>([]);

  const { control, getValues, handleSubmit, setValue, watch } =
    useForm<TInstagramDownloadForm>({
      resolver: zodResolver(InstagramDownloadValidationSchema),
      defaultValues: {
        url: '',
        apiUrl: '',
        type: undefined,
        jsonData: ''
      }
    });

  const handleBlurURL = async () => {
    const url = getValues('url');

    if (!url || !url.includes('instagram.com')) {
      return;
    }

    try {
      setIsGettingAPIURL(true);
      if (url.includes('stories') && !url.includes('highlights')) {
        const body = new FormData();
        body.append('l', url);
        const { data } = await getInstagramStoryAPIURL(body);
        setValue('apiUrl', data);
      } else {
        setValue('apiUrl', getInstagramPostAPIURL(url));
      }
    } catch (error) {
    } finally {
      setIsGettingAPIURL(false);
    }
  };

  const onSubmitForm = async (formValues: TInstagramDownloadForm) => {
    try {
      setIsGettingData(true);
      const { jsonData, type } = formValues;
      const data = JSON.parse(jsonData);
      const mediaItems = await formatInstagramMediaData(type, data);
      setMediaList(mediaItems);
      showToast('success', 'Lấy dữ liệu thành công!');
    } catch (error) {
      showToast('error', 'Lấy dữ liệu thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setIsGettingData(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Alert status="warning" borderRadius={10} mb={2}>
        <AlertIcon />
        Tính năng chỉ áp dụng cho bài viết và story. Hãy đảm bảo rằng bạn đã
        đăng nhập tài khoản Instgram trên trình duyệt!
      </Alert>
      <Controller
        control={control}
        name="url"
        render={({ field: { ref, ...otherFields } }) => (
          <Input
            label="Bước 1: Dán đường link bài viết/story vào đây. Hãy đảm bảo đường dẫn là hợp lệ!"
            placeholder="Link bài viết/story"
            {...otherFields}
            onBlur={handleBlurURL}
          />
        )}
      />
      <Controller
        control={control}
        name="type"
        render={({ field: { ref, ...otherFields }, fieldState: { error } }) => (
          <RadioSelect
            label="Loại:"
            options={[
              { label: 'Bài viết', value: 'post' },
              { label: 'Story', value: 'story' }
            ]}
            errorText={error?.message}
            {...otherFields}
          />
        )}
      />
      <Box display="flex" gap={2}>
        <Controller
          control={control}
          name="apiUrl"
          render={({ field: { ref, ...otherFields } }) => (
            <Input
              label="Bước 2: Mở đường link dưới đây"
              isDisabled
              {...otherFields}
            />
          )}
        />
        <Button
          colorScheme="teal"
          onClick={() => window.open(getValues('apiUrl'), '_blank')}
          isLoading={isGettingAPIURL}
          isDisabled={!watch('apiUrl') || isGettingAPIURL}
          alignSelf="flex-end"
          loadingText="Đang lấy link"
        >
          Mở
        </Button>
      </Box>
      <Controller
        control={control}
        name="jsonData"
        render={({ field: { ref, ...otherFields }, fieldState: { error } }) => (
          <Textarea
            label="Bước 3: Dán toàn bộ nội dung của link vừa mở vào đây. Hãy đảm bảo dán đầy đủ tất cả nội dung từ link đó!"
            placeholder="Dán nội dung vào đây"
            resize="none"
            height={150}
            errorText={error?.message}
            {...otherFields}
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

export default InstagramDownloader;
