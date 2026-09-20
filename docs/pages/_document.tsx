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
    if (this.props.canonicalAsServer.replace(/\/$/, '') === '/experiments/lumen-workbench') {
      return (
        <Html lang="zh-CN">
          <Head />
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
