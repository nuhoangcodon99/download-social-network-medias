import { z } from 'zod';

export const InstagramDownloadValidationSchema = z.object({
  url: z.string({ coerce: true }).optional(),
  apiUrl: z.string({ coerce: true }).optional(),
  type: z.enum(['story', 'post'], {
    message: 'Vui lòng chọn loại tải lên!'
  }),
  jsonData: z.string({ coerce: true }).trim().min(1, {
    message:
      'Vui lòng copy và paste toàn bộ nội dung của URL đã mở ở trình duyệt!'
  })
});

export const FacebookDownloadValidationSchema = z
  .object({
    url: z.string({ coerce: true }).min(1, 'Vui lòng nhập URL bài viết!'),
    postMode: z.enum(['public', 'private'], {
      message: 'Vui lòng chọn chế độ của bài viết!'
    }),
    sourceCodeUrl: z.string().optional(),
    sourceCode: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.postMode === 'private') {
        return data.sourceCode && data.sourceCode.trim() !== '';
      }
      return true;
    },
    {
      message:
        'Vui lòng copy và paste toàn bộ nội dung của URL đã mở ở trình duyệt!',
      path: ['sourceCode']
    }
  );

export const TiktokDownloadValidationSchema = z.object({
  url: z.string({ coerce: true }).min(1, 'Vui lòng nhập URL của video!')
});
