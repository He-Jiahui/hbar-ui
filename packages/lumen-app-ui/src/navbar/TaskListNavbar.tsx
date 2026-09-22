'use client';

import * as React from 'react';
import { LumenButton } from '../primitives';
import { LumenMenu, LumenPopover } from '../ui-controls';
import { Filter, Grid2X2, House, MoreHorizontal, SlidersHorizontal, UserPlus } from './glyphs';
import type { LumenNavbarTaskListContent } from './content';
import { uniqueLumenNavbarItems } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export default function TaskListNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarTaskListContent;
}) {
  const rows = uniqueLumenNavbarItems(content.rows);
  const [openMenu, setOpenMenu] = React.useState<'invite' | 'filter' | 'sort' | 'more' | null>(
    null,
  );
  const [filterId, setFilterId] = React.useState<string | null>(null);
  const [sortId, setSortId] = React.useState(content.sortOptions[0]?.id ?? null);
  const choose = (kind: 'filter' | 'sort' | 'more', id: string) => {
    if (kind === 'filter') {
      setFilterId(id);
    } else if (kind === 'sort') {
      setSortId(id);
    }
    reportNavbarAction(onAction, spec, kind, id);
    setOpenMenu(null);
  };
  const selectedSort = content.sortOptions.find((item) => item.id === sortId);
  return (
    <NavbarFrame spec={spec} className="hbar-app-ui-navbar-task-list">
      <header className="hbar-app-ui-navbar-task-header">
        <nav aria-label={content.labels.breadcrumbLabel(content.breadcrumbs)}>
          {content.breadcrumbs.map((item, index) => (
            <span
              className={index === content.breadcrumbs.length - 1 ? 'is-current' : ''}
              key={`${index}-${item}`}
            >
              <NavbarGlyph icon={index === 0 ? House : Grid2X2} tier="xs" />
              <span>{item}</span>
              {index < content.breadcrumbs.length - 1 && <i>{content.labels.metadataSeparator}</i>}
            </span>
          ))}
        </nav>
        <div className="hbar-app-ui-navbar-task-people">
          {content.avatars.map((avatar, index) => (
            <span key={`${index}-${avatar}`}>{avatar}</span>
          ))}
          <small>{content.extraAvatarLabel}</small>
        </div>
        <NavbarButton
          className="hbar-app-ui-navbar-task-invite"
          variant="outlined"
          aria-expanded={openMenu === 'invite'}
          onClick={() => {
            setOpenMenu((current) => (current === 'invite' ? null : 'invite'));
            reportNavbarAction(onAction, spec, 'invite');
          }}
        >
          <NavbarGlyph icon={UserPlus} tier="sm" />
          <span>{content.labels.invite}</span>
        </NavbarButton>
        <NavbarIconOnly
          label={content.labels.filter}
          icon={Filter}
          tier="sm"
          aria-expanded={openMenu === 'filter'}
          onClick={() => setOpenMenu((current) => (current === 'filter' ? null : 'filter'))}
        />
        <NavbarIconOnly
          label={content.labels.sort}
          icon={SlidersHorizontal}
          tier="sm"
          aria-expanded={openMenu === 'sort'}
          onClick={() => setOpenMenu((current) => (current === 'sort' ? null : 'sort'))}
        />
        <NavbarIconOnly
          label={content.labels.more}
          icon={MoreHorizontal}
          tier="sm"
          aria-expanded={openMenu === 'more'}
          onClick={() => setOpenMenu((current) => (current === 'more' ? null : 'more'))}
        />
        <LumenPopover
          open={openMenu === 'invite'}
          label={content.labels.inviteTitle}
          className="hbar-app-ui-navbar-task-invite-popover"
        >
          {content.members.map((member) => (
            <LumenButton
              variant="text"
              key={member.id}
              onClick={() => {
                reportNavbarAction(onAction, spec, 'invite-member', member.id);
                setOpenMenu(null);
              }}
            >
              <span>
                <strong>{member.name}</strong>
                <small>{member.detail}</small>
              </span>
            </LumenButton>
          ))}
        </LumenPopover>
        <LumenMenu
          open={openMenu === 'filter'}
          label={content.labels.filter}
          items={content.filterOptions}
          empty={content.labels.emptyMenu}
          selectedId={filterId}
          onSelect={(id) => choose('filter', id)}
          className="hbar-app-ui-navbar-task-filter-menu"
        />
        <LumenMenu
          open={openMenu === 'sort'}
          label={content.labels.sort}
          items={content.sortOptions}
          empty={content.labels.emptyMenu}
          selectedId={sortId}
          onSelect={(id) => choose('sort', id)}
          className="hbar-app-ui-navbar-task-sort-menu"
        />
        <LumenMenu
          open={openMenu === 'more'}
          label={content.labels.more}
          items={content.moreActions}
          empty={content.labels.emptyMenu}
          onSelect={(id) => choose('more', id)}
          className="hbar-app-ui-navbar-task-more-menu"
        />
      </header>
      <main
        className="hbar-app-ui-navbar-task-main"
        data-hbar-app-ui-list-strategy={content.listStrategy.kind}
        data-hbar-app-ui-expected-maximum={content.listStrategy.expectedMaximum}
      >
        <p>{selectedSort?.label ?? content.labels.sortedBy}</p>
        <ol>
          {rows.map((row) => (
            <li key={row.id}>
              <LumenButton
                type="button"
                variant="text"
                onClick={() => reportNavbarAction(onAction, spec, 'open', row.id)}
              >
                <strong>{row.title}</strong>
                <span>
                  {row.sprint}
                  {content.labels.metadataSeparator}
                  {row.owner}
                </span>
              </LumenButton>
            </li>
          ))}
        </ol>
      </main>
    </NavbarFrame>
  );
}
