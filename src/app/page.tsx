'use client';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';

import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo
} from 'src/assets/icons';
import DouyinDownloader from 'src/components/ui/features/media-downloader/DouyinDownloader';
import FacebookDownloader from 'src/components/ui/features/media-downloader/FacebookDownloader';
import InstagramDownloader from 'src/components/ui/features/media-downloader/InstagramDownloader';
import TiktokDownloader from 'src/components/ui/features/media-downloader/TiktokDownloader';
import YoutubeDownloader from 'src/components/ui/features/media-downloader/YoutubeDownloader';
import ContactMe from 'src/components/ui/shared/ContactMe';

const tabsConfig = [
  {
    label: 'Instagram',
    logo: InstagramLogo,
    component: <InstagramDownloader />
  },
  {
    label: 'Facebook',
    logo: FacebookLogo,
    component: <FacebookDownloader />
  },
  {
    label: 'Douyin',
    logo: TiktokLogo,
    component: <DouyinDownloader />
  },
  {
    label: 'Tiktok',
    logo: TiktokLogo,
    component: <TiktokDownloader />
  },
  {
    label: 'Youtube',
    logo: YoutubeLogo,
    component: <YoutubeDownloader />
  }
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1200px',
        margin: 'auto',
        paddingTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 30
      }}
    >
      <Text textAlign="center" fontSize="5xl" fontWeight="extrabold">
        Trình tải xuống ảnh, video
      </Text>
      <Tabs isFitted variant="soft-rounded" colorScheme="gray" mt={2}>
        <TabList>
          {tabsConfig.map(({ label, logo: Logo }, index) => (
            <Tab key={index} display="flex" gap={3} alignItems="center">
              <Logo width={20} height={20} />
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabsConfig.map(({ component }, index) => (
            <TabPanel key={index}>{component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <ContactMe />
    </Box>
  );
}
