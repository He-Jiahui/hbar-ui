import * as React from 'react';
import Head from 'next/head';
import EmptyStateGallery from 'docs/src/modules/lumen-gallery/EmptyStateGallery';

export default function LumenAppUiPage() {
  return (
    <React.Fragment>
      <Head>
        <title>墨光 · Lumen 组合组件</title>
      </Head>
      <EmptyStateGallery />
    </React.Fragment>
  );
}
