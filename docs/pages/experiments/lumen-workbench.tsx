import * as React from 'react';
import Head from 'next/head';
import LumenDemo from 'docs/src/modules/lumen-workbench/LumenDemo';

export default function LumenWorkbenchPage() {
  return (
    <React.Fragment>
      <Head>
        <title>墨光 · Lumen — Monochrome workspace</title>
        <meta
          name="description"
          content="An interactive monochrome workspace with refractive glass and state-driven light."
        />
      </Head>
      <LumenDemo />
    </React.Fragment>
  );
}
