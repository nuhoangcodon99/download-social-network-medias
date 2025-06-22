import { Box, Button } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TMedia } from 'src/types/media.type';

interface IMediaItemProps {
  mediaItem: TMedia;
}

const MediaItem: React.FC<IMediaItemProps> = ({ mediaItem }) => {
  const haveAudio = mediaItem.audio;
  const previewURL =
    mediaItem.image?.previewURL || mediaItem.video?.previewURL || '';
  const downloadURL =
    mediaItem.image?.downloadURL || mediaItem.video?.downloadURL || '';
  const audioDownloadURL = mediaItem.audio?.downloadURL || '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 360,
        borderWidth: 1,
        borderColor: 'blackAlpha.400',
        borderRadius: 16,
        overflow: 'hidden'
      }}
    >
      <Image
        width={360}
        height={360}
        src={previewURL}
        objectFit="cover"
        alt="Media preview"
      />

      <Box padding={3} display="flex" gap={2}>
        <Link
          href={downloadURL}
          target="_blank"
          download={uuidv4()}
          rel="noreferrer"
          style={{ flex: 1 }}
        >
          <Button width="100%" colorScheme="blue">{`Tải ${
            mediaItem.type === 'image' ? 'ảnh' : 'video'
          }`}</Button>
        </Link>
        {haveAudio && (
          <Link
            href={audioDownloadURL}
            target="_blank"
            download={uuidv4()}
            rel="noreferrer"
            style={{ flex: 1 }}
          >
            <Button width="100%" colorScheme="blue">
              Tải MP3
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default MediaItem;
