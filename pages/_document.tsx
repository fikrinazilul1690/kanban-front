import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { getInitColorSchemeScript } from '@mui/material';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
        </Head>
        <body>
          {getInitColorSchemeScript()}
          <Main />
          <div id='modal-root' />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
