import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import 'src/themes/globals.css';
import { sfProDisplayFont } from 'src/assets/fonts';
import AppProvider from 'src/components/providers/AppProvider';

export const metadata: Metadata = {
  title: 'Social Network Downloader',
  description: 'Download media from social networks',
  icons: '/app-logo.png',
  verification: {
    google: '1-e4xuHFiE9l6RtL2wa6rxe3dRuKlwXhFzEUROIVcCg'
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sfProDisplayFont.className} antialiased`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
