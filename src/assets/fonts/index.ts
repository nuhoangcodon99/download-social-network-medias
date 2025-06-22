import localFont from 'next/font/local';

export const sfProDisplayFont = localFont({
  src: [
    { path: './SF-Pro-Display-Regular.otf', style: 'normal', weight: '400' },
    { path: './SF-Pro-Display-Medium.otf', style: 'normal', weight: '500' },
    { path: './SF-Pro-Display-Semibold.otf', style: 'normal', weight: '600' },
    { path: './SF-Pro-Display-Bold.otf', style: 'normal', weight: '700' },
    { path: './SF-Pro-Display-Heavy.otf', style: 'normal', weight: '800' }
  ],
  variable: '--font-sf-pro-display-sans'
});
