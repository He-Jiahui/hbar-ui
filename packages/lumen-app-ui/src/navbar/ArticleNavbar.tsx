'use client';

import * as React from 'react';
import { LumenButton } from '../primitives';
import { LumenPopover } from '../ui-controls';
import { ArrowLeft, Bookmark, Copy, List, Share2 } from './glyphs';
import type { LumenNavbarArticleContent } from './content';
import { uniqueLumenNavbarItems } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export default function ArticleNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarArticleContent;
}) {
  const sections = uniqueLumenNavbarItems(content.sections);
  const [contentsOpen, setContentsOpen] = React.useState(false);
  return (
    <NavbarFrame spec={spec} className="hbar-app-ui-navbar-article">
      <header>
        <NavbarIconOnly
          label={content.labels.back}
          icon={ArrowLeft}
          tier="sm"
          onClick={() => reportNavbarAction(onAction, spec, 'back')}
        />
        <div className="hbar-app-ui-navbar-article-summary">
          <p>{content.title}</p>
          <small>{content.authorMeta}</small>
        </div>
        <section>
          <NavbarButton
            className="hbar-app-ui-navbar-article-contents"
            aria-expanded={contentsOpen}
            onClick={() => {
              setContentsOpen((value) => !value);
              reportNavbarAction(onAction, spec, 'contents');
            }}
          >
            <NavbarGlyph icon={List} tier="sm" />
            <span>{content.labels.contents}</span>
          </NavbarButton>
          <LumenPopover
            open={contentsOpen}
            label={content.labels.contents}
            className="hbar-app-ui-navbar-article-contents-popover"
          >
            <nav aria-label={content.labels.contents}>
              {sections.map((section) => (
                <LumenButton
                  variant="text"
                  key={section.id}
                  onClick={() => {
                    reportNavbarAction(onAction, spec, 'open', section.id);
                    setContentsOpen(false);
                  }}
                >
                  {section.title}
                </LumenButton>
              ))}
            </nav>
            <LumenButton variant="text" onClick={() => setContentsOpen(false)}>
              {content.labels.closeContents}
            </LumenButton>
          </LumenPopover>
          <NavbarIconOnly
            label={content.labels.bookmark}
            icon={Bookmark}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'bookmark')}
          />
          <NavbarIconOnly
            label={content.labels.copyLink}
            icon={Copy}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'copy')}
          />
          <NavbarIconOnly
            label={content.labels.share}
            icon={Share2}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'share')}
          />
        </section>
      </header>
      <main
        data-hbar-app-ui-list-strategy={content.sectionStrategy.kind}
        data-hbar-app-ui-expected-maximum={content.sectionStrategy.expectedMaximum}
      >
        <article>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          {sections.map((section) => (
            <section key={section.id}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.placeholder && <i aria-hidden="true" />}
            </section>
          ))}
        </article>
      </main>
    </NavbarFrame>
  );
}
