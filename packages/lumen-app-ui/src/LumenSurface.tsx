'use client';

import * as React from 'react';
import createLensMap from './lensMap';
import type { LumenShape } from './appearance';
import styles from './materials.module.css';

export interface LumenSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  material?: 'glass' | 'frost' | undefined;
  elevation?: 'base' | 'overlay' | undefined;
  glassStrength?: number | undefined;
  interactive?: boolean | undefined;
  shape?: LumenShape | undefined;
}

export default function LumenSurface({
  material = 'glass',
  elevation = 'base',
  glassStrength = 65,
  interactive = false,
  shape,
  className = '',
  children,
  ...props
}: LumenSurfaceProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const id = `lumen-lens-${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [map, setMap] = React.useState('');
  React.useEffect(() => {
    const element = root.current;
    // URL backdrop filters are currently rendered reliably by Chromium. Other
    // engines retain the deliberately styled CSS frost surface.
    if (
      !element ||
      material !== 'glass' ||
      !/Chrome|Chromium|Edg\//.test(navigator.userAgent) ||
      !CSS.supports('backdrop-filter', `url(#${id})`)
    ) {
      return undefined;
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        if (bounds.width && bounds.height) {
          setMap(
            createLensMap(
              bounds.width,
              bounds.height,
              parseFloat(getComputedStyle(element).borderRadius) || 16,
            ),
          );
        }
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [id, material]);
  const lensStyle =
    map && glassStrength > 0
      ? { backdropFilter: `url(#${id}) blur(${0.12 + glassStrength * 0.002}rem)` }
      : undefined;
  return (
    <div
      {...props}
      ref={root}
      className={`${styles.surface} ${className}`}
      data-material={material}
      data-elevation={elevation}
      data-interactive={interactive}
      data-shape={shape}
      data-lens={map && glassStrength > 0 ? 'refractive' : 'frost'}
    >
      {map && (
        <svg className={styles.filter} aria-hidden="true" focusable="false">
          <defs>
            <filter
              id={id}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={map}
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="lens"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lens"
                scale={glassStrength * 0.65}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}
      <div className={styles.glass} style={lensStyle} aria-hidden="true" />
      <div className={styles.surfaceContent}>{children}</div>
    </div>
  );
}
