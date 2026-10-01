import { LumenButton } from '../primitives';
import { Heart, Menu, Search, ShoppingBag, UserRound } from './glyphs';
import type { LumenNavbarCommerceContent } from './content';
import { uniqueLumenNavbarItems } from './content';
import { NavbarPopup } from './menu';
import { NavbarNavigationOwner } from './navigation';
import { ChevronDown } from './glyphs';
import { NavbarGlyph } from './primitives';
import {
  NavbarFrame,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export function CommerceNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarCommerceContent;
}) {
  const products = uniqueLumenNavbarItems(content.products);
  return (
    <NavbarNavigationOwner
      navigation={content.navigation}
      items={content.navItems.map((label) => ({ id: label, label }))}
      menus={content.dropdowns}
      onChoose={(id, menuId) =>
        reportNavbarAction(
          onAction,
          spec,
          menuId ? 'navigate-menu' : 'navigate',
          menuId ? JSON.stringify([menuId, id]) : id,
        )
      }
    >
      {({ open, toggle }) => (
        <NavbarFrame spec={spec} onAction={onAction} className="hbar-app-ui-navbar-commerce">
          <header>
            <p>{content.announcement}</p>
            <div>
              <NavbarIconOnly
                className="hbar-app-ui-navbar-commerce-menu"
                label={open && content.navigation ? content.navigation.close : content.labels.menu}
                data-navbar-navigation-trigger="true"
                aria-expanded={content.navigation ? open : undefined}
                icon={Menu}
                tier="sm"
                onClick={() =>
                  content.navigation ? toggle() : reportNavbarAction(onAction, spec, 'menu')
                }
              />
              <strong>{content.brand}</strong>
              <nav aria-label={content.brand}>
                {content.navItems.map((item, index) => {
                  const dropdown = content.dropdowns?.find((entry) => entry.label === item);
                  return dropdown ? (
                    <NavbarPopup
                      {...dropdown}
                      key={dropdown.id}
                      onChoose={(id) =>
                        reportNavbarAction(
                          onAction,
                          spec,
                          'navigate-menu',
                          JSON.stringify([dropdown.id, id]),
                        )
                      }
                    >
                      <span>{item}</span>
                      <NavbarGlyph icon={ChevronDown} tier="xs" />
                    </NavbarPopup>
                  ) : (
                    <LumenButton
                      type="button"
                      key={`${index}-${item}`}
                      onClick={() => reportNavbarAction(onAction, spec, 'navigate', item)}
                    >
                      {item}
                    </LumenButton>
                  );
                })}
              </nav>
              <span className="hbar-app-ui-navbar-commerce-actions">
                <NavbarIconOnly
                  label={content.labels.search}
                  icon={Search}
                  tier="sm"
                  onClick={() => reportNavbarAction(onAction, spec, 'search')}
                />
                <NavbarIconOnly
                  label={content.labels.account}
                  icon={UserRound}
                  tier="sm"
                  onClick={() => reportNavbarAction(onAction, spec, 'account')}
                />
                <span>
                  <NavbarIconOnly
                    label={content.labels.wishlist}
                    icon={Heart}
                    tier="sm"
                    onClick={() => reportNavbarAction(onAction, spec, 'wishlist')}
                  />
                  <i className="hbar-app-ui-navbar-wishlist-marker" aria-hidden="true" />
                </span>
                <span>
                  <NavbarIconOnly
                    label={content.labels.cart}
                    icon={ShoppingBag}
                    tier="sm"
                    onClick={() => reportNavbarAction(onAction, spec, 'cart')}
                  />
                  <i>{content.cartCount}</i>
                </span>
              </span>
            </div>
          </header>
          <main
            data-hbar-app-ui-list-strategy={content.productStrategy.kind}
            data-hbar-app-ui-expected-maximum={content.productStrategy.expectedMaximum}
          >
            {products.map((product) => (
              <article key={product.id}>
                <i aria-hidden="true" />
                <LumenButton
                  type="button"
                  onClick={() => reportNavbarAction(onAction, spec, 'open', product.id)}
                >
                  <strong>{product.name}</strong>
                  <small>{product.price}</small>
                </LumenButton>
              </article>
            ))}
          </main>
        </NavbarFrame>
      )}
    </NavbarNavigationOwner>
  );
}
