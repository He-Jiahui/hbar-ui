import { describe, expect, it } from 'vitest';
import * as LumenUi from '@lumen/app-ui/ui';

describe('Lumen UI public entry', () => {
  it('exposes the shared primitives used by every application variant', () => {
    const requiredExports = [
      'LumenProvider',
      'LumenSurface',
      'LumenField',
      'LumenIndicator',
      'LumenButton',
      'LumenIconButton',
      'LumenNavigationButton',
      'LumenText',
      'LumenStatus',
      'LumenInput',
      'LumenTextarea',
      'LumenSelect',
      'LumenCheckBox',
      'LumenComboBox',
      'LumenDialog',
      'LumenLink',
      'LumenTabs',
      'LumenMenu',
      'LumenPopover',
      'LumenPanel',
      'LumenToolbar',
      'LumenList',
      'LumenDataTable',
      'LumenPagination',
      'LumenTree',
      'LumenStepper',
      'LumenTimeline',
      'LumenMetric',
      'LumenChart',
      'LumenCalendar',
      'LumenCodeBlock',
      'LumenDiffView',
    ] as const;

    for (const name of requiredExports) {
      expect(LumenUi[name]).toBeDefined();
    }
  });
});
