import { useToast } from '@chakra-ui/react';

import { TToastType } from 'src/types/toast.type';

export const useShowToast = () => {
  const toast = useToast();
  const showToast = (type: TToastType, message: string) => {
    toast({
      title: message,
      status: type,
      position: 'top-right',
      isClosable: true
    });
  };
  return { showToast };
};
