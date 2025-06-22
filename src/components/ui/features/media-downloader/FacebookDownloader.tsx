'use client';

import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Controller, useForm } from 'react-hook-form';

import { getFacebookMedia } from 'src/actions/media-downloader.action';
import { TickIcon } from 'src/assets/icons';
import MediaItem from 'src/components/ui/features/media-downloader/MediaItem';
import Input from 'src/components/ui/shared/Input';
import RadioSelect from 'src/components/ui/shared/RadioSelect';
import Textarea from 'src/components/ui/shared/TextArea';
import { useShowToast } from 'src/hooks/useShowToast';
import { TFacebookDownloadForm } from 'src/types/form.type';
import { TMedia } from 'src/types/media.type';
import { delay } from 'src/utils/common.util';
import { formatFacebookMediaData } from 'src/utils/download-media.util';
import { FacebookDownloadValidationSchema } from 'src/utils/validations/form.validation';

const FacebookDownloader = () => {
  const { showToast } = useShowToast();
  const [isCopyingSourceUrl, setIsCopyingSourceUrl] = useState<boolean>(false);
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<TMedia[]>([]);

  const { control, getValues, handleSubmit, setValue, watch } =
    useForm<TFacebookDownloadForm>({
      resolver: zodResolver(FacebookDownloadValidationSchema),
      defaultValues: {
        url: '',
        postMode: undefined,
        sourceCodeUrl: '',
        sourceCode: ''
      }
    });

  const handleCopy = async (_text: string, isCopied: boolean) => {
    setIsCopyingSourceUrl(isCopied);
    await delay(1500);
    setIsCopyingSourceUrl((prev) => !prev);
  };

  const onSubmitForm = async (formValues: TFacebookDownloadForm) => {
    try {
      console.log(formValues);

      setIsGettingData(true);
      const body = new FormData();
      body.append('q', formValues.url);
      body.append('html', formValues.sourceCode || '');
      const response = await getFacebookMedia(body);
      if (response.mess) {
        throw new Error('Đã xảy ra lỗi trong quá trình lấy dữ liệu!');
      }
      setMediaList([formatFacebookMediaData(response.data)]);
      showToast('success', 'Lấy dữ liệu thành công!');
    } catch (error) {
      showToast('error', 'Đã xảy ra lỗi trong quá trình lấy dữ liệu!');
    } finally {
      setIsGettingData(false);
    }
  };

  const [postMode, sourceCodeUrl, url] = watch([
    'postMode',
    'sourceCodeUrl',
    'url'
  ]);

  useEffect(() => {
    if (postMode === 'private' && url) {
      setValue('sourceCodeUrl', `view-source:${url.trim()}`);
    }
  }, [postMode, url, setValue]);

  useEffect(() => {
    setValue('sourceCode', '');
  }, [postMode, setValue]);

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Alert status="warning" borderRadius={10} mb={2}>
        <AlertIcon />
        Tính năng này áp dụng cho video/reels. Hãy đảm bảo rằng bạn đã đăng nhập
        Facebook trên trình duyệt!
      </Alert>
      <Controller
        control={control}
        name="url"
        render={({ field: { ref, ...otherFields }, fieldState: { error } }) => (
          <Input
            label="Bước 1: Dán đường link video/reels vào đây. Hãy đảm bảo đường dẫn là hợp lệ"
            placeholder="Link video/reels"
            {...otherFields}
            errorText={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="postMode"
        render={({ field: { ref, ...otherFields }, fieldState: { error } }) => (
          <RadioSelect
            label="Chọn chế độ của video/reels"
            options={[
              { label: 'Công khai', value: 'public' },
              {
                label: 'Bạn bè, riêng tư,...',
                value: 'private'
              }
            ]}
            errorText={error?.message}
            {...otherFields}
          />
        )}
      />
      {postMode === 'private' && (
        <>
          <Box display="flex" gap={2}>
            <Controller
              control={control}
              name="sourceCodeUrl"
              render={({ field: { ref, ...otherFields } }) => (
                <Input
                  label="Bước 2: Sao chép đường link dưới đây và mở nó trong tab mới"
                  isDisabled
                  {...otherFields}
                />
              )}
            />
            <CopyToClipboard text={sourceCodeUrl || ''} onCopy={handleCopy}>
              <Button
                colorScheme="teal"
                isDisabled={!sourceCodeUrl}
                alignSelf="flex-end"
                {...(isCopyingSourceUrl
                  ? { leftIcon: <TickIcon className="size-5 text-white" /> }
                  : {})}
              >
                {isCopyingSourceUrl ? 'Đã sao chép' : 'Sao chép'}
              </Button>
            </CopyToClipboard>
          </Box>
          <Controller
            control={control}
            name="sourceCode"
            render={({
              field: { ref, ...otherFields },
              fieldState: { error }
            }) => (
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
        </>
      )}
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

export default FacebookDownloader;
