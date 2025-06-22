import { z } from 'zod';

import {
  FacebookDownloadValidationSchema,
  InstagramDownloadValidationSchema,
  TiktokDownloadValidationSchema
} from 'src/utils/validations/form.validation';

export type TInstagramDownloadForm = z.infer<
  typeof InstagramDownloadValidationSchema
>;

export type TFacebookDownloadForm = z.infer<
  typeof FacebookDownloadValidationSchema
>;

export type TTiktokDownloadForm = z.infer<
  typeof TiktokDownloadValidationSchema
>;
