import * as React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import {
  Document as MuiDocsDocument,
  createGetInitialProps,
  type DocumentProps,
} from '@mui/internal-core-docs/Document';

export default class MuiDocument extends NextDocument<DocumentProps> {
  static getInitialProps = createGetInitialProps({
    createPlugin: () => {
      const sheet = new ServerStyleSheet();
      return {
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        resolveProps: async (initialProps) => {
          const styles = [sheet.getStyleElement(), ...React.Children.toArray(initialProps.styles)];
          // After `getStyleElement()`, which throws once the sheet is sealed.
          sheet.seal();
          return { ...initialProps, styles };
        },
      };
    },
  });

  render() {
    if (this.props.canonicalAsServer.replace(/\/$/, '').startsWith('/experiments/lumen-')) {
      return (
        <Html lang="zh-CN">
          <Head>
            <link
              rel="icon"
              href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23090909'/%3E%3Cpath d='M11 7v18h12' fill='none' stroke='%23eee' stroke-width='2'/%3E%3C/svg%3E"
            />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
    return <MuiDocsDocument {...this.props} />;
  }
}
