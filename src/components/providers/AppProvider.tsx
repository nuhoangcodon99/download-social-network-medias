'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { chakraTheme } from 'src/themes/chakra.theme';

const AppProvider = ({ children }: PropsWithChildren) => {
  return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>;
};

export default AppProvider;
