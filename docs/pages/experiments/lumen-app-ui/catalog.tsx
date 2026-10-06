import * as React from 'react';
import Head from 'next/head';
import LumenCatalog from 'docs/src/modules/lumen-gallery/LumenCatalog';

export default function LumenAppUiCatalogPage() {
  return (
    <React.Fragment>
      <Head>
        <title>墨光 · Application UI 目录</title>
      </Head>
      <LumenCatalog />
    </React.Fragment>
  );
}
