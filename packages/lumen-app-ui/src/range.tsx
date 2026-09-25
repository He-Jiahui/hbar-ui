'use client';

import * as React from 'react';
import { LumenInput, type LumenInputProps } from './forms';
import './range.css';

export interface LumenRangeProps extends Omit<LumenInputProps, 'type' | 'variant'> {}

/** Native single-value slider, for controls whose visible track is also the input. */
export const LumenRange = React.forwardRef<HTMLInputElement, LumenRangeProps>(function LumenRange(
  { className, ...props },
  ref,
) {
  return (
    <LumenInput
      {...props}
      ref={ref}
      className={['lumen-range', className].filter(Boolean).join(' ')}
      type="range"
      variant="plain"
    />
  );
});
