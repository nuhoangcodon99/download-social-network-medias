'use client';
import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { GithubLogo } from 'src/assets/icons';

const ContactMe = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
      <Text fontWeight="bold">❤ Made by @nuhoangcodon99</Text>
      <Link
        href="https://github.com/nuhoangcodon99/"
        target="_blank"
        rel="noreferrer"
      >
        <GithubLogo height={18} width={18} />
      </Link>
    </Box>
  );
};

export default ContactMe;
