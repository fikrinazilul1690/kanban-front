import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import createEmotionCache from '../utils/createEmotionCache';
import darkThemeOptions from '../theme/darkThemeOptions';
import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
const darkTheme = createTheme(darkThemeOptions);

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}

export default MyApp;
