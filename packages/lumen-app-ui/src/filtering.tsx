'use client';

import * as React from 'react';
import { LumenCheckBox, LumenFormField, LumenInput, LumenSelect } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import './filtering.css';

export interface LumenFilteringListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenFilteringChoice {
  readonly id: string;
  readonly label: string;
  readonly detail?: string | undefined;
  readonly disabled?: boolean | undefined;
}
export interface LumenFilteringProductCategory extends LumenFilteringChoice {
  readonly count: number;
}
export interface LumenFilteringSwatch extends LumenFilteringChoice {
  readonly color: string;
}
export interface LumenFilteringProductContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly clear: string;
    readonly category: string;
    readonly price: string;
    readonly priceValue: (value: number) => string;
    readonly finish: string;
  };
  readonly categories: readonly LumenFilteringProductCategory[];
  readonly initialCategoryIds: readonly string[];
  readonly minimumPrice: number;
  readonly maximumPrice: number;
  readonly initialPrice: number;
  readonly swatches: readonly LumenFilteringSwatch[];
}
export interface LumenFilteringDrawerContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly show: string;
    readonly hide: string;
    readonly search: string;
    readonly searchPlaceholder: string;
    readonly status: string;
    readonly owner: string;
    readonly apply: string;
    readonly resultCount: (count: number) => string;
    readonly reset: string;
  };
  readonly statuses: readonly LumenFilteringChoice[];
  readonly owners: readonly LumenFilteringChoice[];
  readonly initialStatusId: string;
  readonly initialOwnerId: string;
  readonly resultCount: number;
  readonly initiallyOpen: boolean;
}
export interface LumenFilteringRule {
  readonly id: string;
  readonly field: string;
  readonly operator: string;
  readonly value: string;
}
export interface LumenFilteringResult {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly status: string;
  readonly tone: 'neutral' | 'success' | 'warning' | 'danger';
}
export interface LumenFilteringQueryContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly addRule: string;
    readonly removeRule: (field: string) => string;
    readonly emptyRules: string;
    readonly emptyResults: string;
  };
  readonly initialRules: readonly LumenFilteringRule[];
  readonly availableRules: readonly LumenFilteringRule[];
  readonly maximumRules: number;
  readonly results: readonly LumenFilteringResult[];
  readonly listStrategy: LumenFilteringListStrategy;
}
export interface LumenFilteringLogContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly levels: string;
    readonly service: string;
    readonly volume: string;
    readonly lines: string;
    readonly empty: string;
  };
  readonly levels: readonly LumenFilteringChoice[];
  readonly services: readonly LumenFilteringChoice[];
  readonly initialLevelId: string;
  readonly initialServiceId: string;
  readonly volume: readonly { readonly id: string; readonly value: number }[];
  readonly lines: readonly {
    readonly id: string;
    readonly time: string;
    readonly message: string;
  }[];
  readonly listStrategy: LumenFilteringListStrategy;
}
export interface LumenFilteringPropertyContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly search: string;
    readonly bedrooms: string;
    readonly bathrooms: string;
    readonly decrement: (label: string) => string;
    readonly increment: (label: string) => string;
    readonly price: string;
    readonly amenities: string;
  };
  readonly initialBedrooms: number;
  readonly initialBathrooms: number;
  readonly maximumRooms: number;
  readonly minimumPrice: number;
  readonly maximumPrice: number;
  readonly initialPrice: number;
  readonly amenities: readonly LumenFilteringChoice[];
}
export interface LumenFilteringCandidate {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly detail: string;
  readonly status: string;
}
export interface LumenFilteringCandidateContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly skill: string;
    readonly removeSkill: (skill: string) => string;
    readonly seniority: string;
    readonly empty: string;
    readonly skillLimit: string;
  };
  readonly initialSkills: readonly LumenFilteringChoice[];
  readonly maximumSkills: number;
  readonly seniorities: readonly LumenFilteringChoice[];
  readonly initialSeniorityId: string;
  readonly candidates: readonly LumenFilteringCandidate[];
  readonly listStrategy: LumenFilteringListStrategy;
}
export interface LumenFilteringAsset {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly meta: string;
}
export interface LumenFilteringAssetsContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly facets: string;
    readonly empty: string;
  };
  readonly facets: readonly LumenFilteringChoice[];
  readonly initialFacetId: string;
  readonly assets: readonly LumenFilteringAsset[];
  readonly listStrategy: LumenFilteringListStrategy;
}
export interface LumenFilteringFlight {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly price: string;
  readonly timeId: string;
}
export interface LumenFilteringFlightsContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly departure: string;
    readonly select: string;
    readonly empty: string;
  };
  readonly times: readonly LumenFilteringChoice[];
  readonly initialTimeId: string;
  readonly flights: readonly LumenFilteringFlight[];
  readonly listStrategy: LumenFilteringListStrategy;
}
export interface LumenFilteringCuisineContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly cuisines: string;
    readonly rating: string;
    readonly ratingValue: (value: number) => string;
    readonly price: string;
  };
  readonly cuisines: readonly LumenFilteringChoice[];
  readonly initialCuisineId: string;
  readonly maximumRating: number;
  readonly initialRating: number;
  readonly prices: readonly LumenFilteringChoice[];
  readonly initialPriceId: string;
}
export interface LumenFilteringContent {
  readonly product?: LumenFilteringProductContent | undefined;
  readonly drawer?: LumenFilteringDrawerContent | undefined;
  readonly query?: LumenFilteringQueryContent | undefined;
  readonly log?: LumenFilteringLogContent | undefined;
  readonly property?: LumenFilteringPropertyContent | undefined;
  readonly candidate?: LumenFilteringCandidateContent | undefined;
  readonly assets?: LumenFilteringAssetsContent | undefined;
  readonly flights?: LumenFilteringFlightsContent | undefined;
  readonly cuisine?: LumenFilteringCuisineContent | undefined;
}
export interface LumenFilteringProviderProps {
  readonly content: LumenFilteringContent;
  readonly children: React.ReactNode;
}
export interface LumenFilteringAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenFilteringProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenFilteringContent | undefined;
  readonly onAction?: ((event: LumenFilteringAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenFilteringVariantProps = Omit<LumenFilteringProps, 'variant' | 'variantId'>;
const Context = React.createContext<LumenFilteringContent | undefined>(undefined);
export function LumenFilteringProvider({ content, children }: LumenFilteringProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenFilteringContent() {
  return React.useContext(Context);
}
export function uniqueLumenFilteringItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
export function selectLumenFilteringItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenFilteringProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({ name }: { name: 'filter' | 'plus' | 'minus' | 'close' | 'search' | 'star' }) {
  const paths = {
    filter: 'M2 3h12L9.5 8v4l-3 1V8Z',
    plus: 'M8 3v10M3 8h10',
    minus: 'M3 8h10',
    close: 'm4 4 8 8m0-8-8 8',
    search: 'm11 11 3 3M7 12A5 5 0 1 1 7 2a5 5 0 0 1 0 10Z',
    star: 'm8 2 1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z',
  } as const;
  const d = paths[name];
  return (
    <svg className="lumen-filtering-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
function Root({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenFilteringProps, 'content' | 'onAction'> & { children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-filtering',
        'hbar-app-ui-variant',
        `hbar-app-ui-filter-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="filtering"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}
function Header({
  title,
  detail,
  actions,
}: {
  title: string;
  detail: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-filtering-header">
      <div>
        <LumenText as="h2" variant="heading">
          {title}
        </LumenText>
        <LumenText as="p" tone="muted" variant="supporting">
          {detail}
        </LumenText>
      </div>
      {actions}
    </header>
  );
}
function Product(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringProductContent },
) {
  const categories = uniqueLumenFilteringItems(props.content.categories);
  const validInitial = uniqueLumenFilteringItems(
    props.content.initialCategoryIds.map((id) => ({ id })),
  )
    .map((item) => item.id)
    .filter((id) => categories.some((item) => item.id === id));
  const [selectedIds, setSelectedIds] = React.useState<readonly string[]>(validInitial);
  const [price, setPrice] = React.useState(
    Math.max(
      props.content.minimumPrice,
      Math.min(props.content.maximumPrice, props.content.initialPrice),
    ),
  );
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => {
              setSelectedIds([]);
              setPrice(props.content.initialPrice);
              report(props.onAction, 'clear');
            }}
          >
            {props.content.labels.clear}
          </LumenButton>
        }
      />
      <aside className="lumen-filtering-product">
        <LumenText as="strong" variant="label">
          {props.content.labels.category}
        </LumenText>
        {categories.map((item) => (
          <LumenCheckBox
            key={item.id}
            label={item.label}
            checked={selectedIds.includes(item.id)}
            disabled={item.disabled}
            description={String(item.count)}
            onChange={() =>
              setSelectedIds((current) =>
                current.includes(item.id)
                  ? current.filter((id) => id !== item.id)
                  : [...current, item.id],
              )
            }
          />
        ))}
        <LumenText as="strong" variant="label">
          {props.content.labels.price}
        </LumenText>
        <LumenInput
          type="range"
          min={props.content.minimumPrice}
          max={props.content.maximumPrice}
          value={price}
          onChange={(event) => setPrice(Number(event.currentTarget.value))}
        />
        <LumenText as="span" tone="muted">
          {props.content.labels.priceValue(price)}
        </LumenText>
        <LumenText as="strong" variant="label">
          {props.content.labels.finish}
        </LumenText>
        <div className="lumen-filtering-swatches">
          {uniqueLumenFilteringItems(props.content.swatches).map((swatch) => (
            <span
              key={swatch.id}
              title={swatch.label}
              aria-label={swatch.label}
              style={{ background: swatch.color }}
            />
          ))}
        </div>
      </aside>
    </Root>
  );
}
function Drawer(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringDrawerContent },
) {
  const statuses = uniqueLumenFilteringItems(props.content.statuses);
  const owners = uniqueLumenFilteringItems(props.content.owners);
  const [open, setOpen] = React.useState(props.content.initiallyOpen);
  const [query, setQuery] = React.useState('');
  const [statusId, setStatusId] = React.useState(props.content.initialStatusId);
  const [ownerId, setOwnerId] = React.useState(props.content.initialOwnerId);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton variant="outlined" onClick={() => setOpen((value) => !value)}>
            <Glyph name="filter" />
            {open ? props.content.labels.hide : props.content.labels.show}
          </LumenButton>
        }
      />
      {open ? (
        <div className="lumen-filtering-drawer">
          <LumenFormField
            controlId={`${props.variantId}-search`}
            label={props.content.labels.search}
          >
            <LumenInput
              value={query}
              placeholder={props.content.labels.searchPlaceholder}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </LumenFormField>
          <LumenFormField
            controlId={`${props.variantId}-status`}
            label={props.content.labels.status}
          >
            <LumenSelect
              value={statusId}
              onChange={(event) => setStatusId(event.currentTarget.value)}
            >
              {statuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </LumenSelect>
          </LumenFormField>
          <LumenFormField controlId={`${props.variantId}-owner`} label={props.content.labels.owner}>
            <LumenSelect
              value={ownerId}
              onChange={(event) => setOwnerId(event.currentTarget.value)}
            >
              {owners.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </LumenSelect>
          </LumenFormField>
          <LumenButton
            tone="primary"
            onClick={() =>
              report(props.onAction, 'apply', JSON.stringify({ query, statusId, ownerId }))
            }
          >
            {props.content.labels.apply}
          </LumenButton>
        </div>
      ) : null}
      <footer className="lumen-filtering-result-count">
        <strong>{props.content.labels.resultCount(props.content.resultCount)}</strong>
        <LumenButton
          variant="text"
          onClick={() => {
            setQuery('');
            setStatusId(props.content.initialStatusId);
            setOwnerId(props.content.initialOwnerId);
            report(props.onAction, 'reset');
          }}
        >
          {props.content.labels.reset}
        </LumenButton>
      </footer>
    </Root>
  );
}
function Query(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringQueryContent },
) {
  const initial = uniqueLumenFilteringItems(props.content.initialRules).slice(
    0,
    Math.max(0, props.content.maximumRules),
  );
  const available = uniqueLumenFilteringItems(props.content.availableRules);
  const results = uniqueLumenFilteringItems(props.content.results);
  const [rules, setRules] = React.useState<readonly LumenFilteringRule[]>(initial);
  const next = available.find((item) => !rules.some((rule) => rule.id === item.id));
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            disabled={!next || rules.length >= props.content.maximumRules}
            onClick={() => {
              if (next) {
                setRules((current) => [...current, next]);
              }
            }}
          >
            <Glyph name="plus" />
            {props.content.labels.addRule}
          </LumenButton>
        }
      />
      <div className="lumen-filtering-rules">
        {rules.length ? (
          rules.map((rule) => (
            <span key={rule.id}>
              <strong>{rule.field}</strong> {rule.operator} <b>{rule.value}</b>
              <LumenIconButton
                size="s"
                label={props.content.labels.removeRule(rule.field)}
                onClick={() => setRules((current) => current.filter((item) => item.id !== rule.id))}
              >
                <Glyph name="close" />
              </LumenIconButton>
            </span>
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.emptyRules}
          </LumenText>
        )}
      </div>
      <div
        className="lumen-filtering-results"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {results.length ? (
          results.map((result) => (
            <article key={result.id}>
              <strong>{result.title}</strong>
              <LumenStatus value={result.status} tone={result.tone} />
              <small>{result.detail}</small>
            </article>
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.emptyResults}
          </LumenText>
        )}
      </div>
    </Root>
  );
}
function Log(props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringLogContent }) {
  const levels = uniqueLumenFilteringItems(props.content.levels);
  const services = uniqueLumenFilteringItems(props.content.services);
  const [levelId, setLevelId] = React.useState(props.content.initialLevelId);
  const [serviceId, setServiceId] = React.useState(props.content.initialServiceId);
  const level = selectLumenFilteringItem(levels, levelId);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-filtering-pills" role="group" aria-label={props.content.labels.levels}>
        {levels.map((item) => (
          <LumenButton
            key={item.id}
            variant={level?.id === item.id ? 'solid' : 'outlined'}
            onClick={() => {
              setLevelId(item.id);
              report(props.onAction, 'level', item.id);
            }}
          >
            <Glyph name="filter" />
            {item.label}
          </LumenButton>
        ))}
      </div>
      <LumenSelect
        aria-label={props.content.labels.service}
        value={serviceId}
        onChange={(event) => setServiceId(event.currentTarget.value)}
      >
        {services.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </LumenSelect>
      <div className="lumen-filtering-histogram" aria-label={props.content.labels.volume}>
        {props.content.volume.map((bar) => (
          <i key={bar.id} style={{ blockSize: `${Math.max(0, Math.min(100, bar.value))}%` }} />
        ))}
      </div>
      <div
        className="lumen-filtering-logs"
        aria-label={props.content.labels.lines}
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {props.content.lines.length ? (
          props.content.lines.map((line) => (
            <code key={line.id}>
              {line.time} {level?.label ?? ''} {line.message}
            </code>
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        )}
      </div>
    </Root>
  );
}
function Counter({
  label,
  value,
  maximum,
  labels,
  onChange,
}: {
  label: string;
  value: number;
  maximum: number;
  labels: LumenFilteringPropertyContent['labels'];
  onChange: (value: number) => void;
}) {
  return (
    <div className="lumen-filtering-counter">
      <LumenText as="strong" variant="label">
        {label}
      </LumenText>
      <div>
        <LumenIconButton
          label={labels.decrement(label)}
          disabled={value <= 0}
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Glyph name="minus" />
        </LumenIconButton>
        <strong>{value}</strong>
        <LumenIconButton
          label={labels.increment(label)}
          disabled={value >= maximum}
          onClick={() => onChange(Math.min(maximum, value + 1))}
        >
          <Glyph name="plus" />
        </LumenIconButton>
      </div>
    </div>
  );
}
function Property(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringPropertyContent },
) {
  const [beds, setBeds] = React.useState(
    Math.max(0, Math.min(props.content.maximumRooms, props.content.initialBedrooms)),
  );
  const [baths, setBaths] = React.useState(
    Math.max(0, Math.min(props.content.maximumRooms, props.content.initialBathrooms)),
  );
  const [price, setPrice] = React.useState(props.content.initialPrice);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            tone="primary"
            onClick={() => report(props.onAction, 'search', `${beds}:${baths}:${price}`)}
          >
            <Glyph name="search" />
            {props.content.labels.search}
          </LumenButton>
        }
      />
      <div className="lumen-filtering-counters">
        <Counter
          label={props.content.labels.bedrooms}
          value={beds}
          maximum={props.content.maximumRooms}
          labels={props.content.labels}
          onChange={setBeds}
        />
        <Counter
          label={props.content.labels.bathrooms}
          value={baths}
          maximum={props.content.maximumRooms}
          labels={props.content.labels}
          onChange={setBaths}
        />
      </div>
      <LumenFormField controlId={`${props.variantId}-price`} label={props.content.labels.price}>
        <LumenInput
          type="range"
          min={props.content.minimumPrice}
          max={props.content.maximumPrice}
          value={price}
          onChange={(event) => setPrice(Number(event.currentTarget.value))}
        />
      </LumenFormField>
      <div className="lumen-filtering-amenities" aria-label={props.content.labels.amenities}>
        {uniqueLumenFilteringItems(props.content.amenities).map((item) => (
          <span key={item.id}>{item.label}</span>
        ))}
      </div>
    </Root>
  );
}
function Candidate(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringCandidateContent },
) {
  const initialSkills = uniqueLumenFilteringItems(props.content.initialSkills).slice(
    0,
    Math.max(0, props.content.maximumSkills),
  );
  const candidates = uniqueLumenFilteringItems(props.content.candidates);
  const seniorities = uniqueLumenFilteringItems(props.content.seniorities);
  const [skills, setSkills] = React.useState<readonly LumenFilteringChoice[]>(initialSkills);
  const [seniorityId, setSeniorityId] = React.useState(props.content.initialSeniorityId);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-filtering-token-input">
        {skills.map((skill) => (
          <span key={skill.id}>
            {skill.label}
            <LumenIconButton
              size="s"
              label={props.content.labels.removeSkill(skill.label)}
              onClick={() => setSkills((current) => current.filter((item) => item.id !== skill.id))}
            >
              <Glyph name="close" />
            </LumenIconButton>
          </span>
        ))}
        <LumenInput
          aria-label={props.content.labels.skill}
          placeholder={
            skills.length >= props.content.maximumSkills
              ? props.content.labels.skillLimit
              : props.content.labels.skill
          }
          disabled={skills.length >= props.content.maximumSkills}
          onKeyDown={(event) => {
            const value = event.currentTarget.value.trim();
            if (event.key === 'Enter' && value) {
              const id = value.toLowerCase().replace(/\s+/g, '-');
              if (!skills.some((item) => item.id === id)) {
                setSkills((current) => [...current, { id, label: value }]);
              }
              event.currentTarget.value = '';
              report(props.onAction, 'skill', id);
            }
          }}
        />
      </div>
      <LumenSelect
        aria-label={props.content.labels.seniority}
        value={seniorityId}
        onChange={(event) => setSeniorityId(event.currentTarget.value)}
      >
        {seniorities.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </LumenSelect>
      <div
        className="lumen-filtering-results"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {candidates.length ? (
          candidates.map((candidate) => (
            <article key={candidate.id}>
              <span className="lumen-filtering-avatar">{candidate.initials}</span>
              <div>
                <strong>{candidate.name}</strong>
                <small>{candidate.detail}</small>
              </div>
              <LumenStatus value={candidate.status} tone="success" />
            </article>
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        )}
      </div>
    </Root>
  );
}
function Assets(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringAssetsContent },
) {
  const facets = uniqueLumenFilteringItems(props.content.facets);
  const assets = uniqueLumenFilteringItems(props.content.assets);
  const [facetId, setFacetId] = React.useState(props.content.initialFacetId);
  const facet = selectLumenFilteringItem(facets, facetId);
  const visible = assets.filter((asset) => facet?.id === 'all' || asset.kind === facet?.id);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-filtering-pills" role="group" aria-label={props.content.labels.facets}>
        {facets.map((item) => (
          <LumenButton
            key={item.id}
            variant={facet?.id === item.id ? 'solid' : 'outlined'}
            onClick={() => setFacetId(item.id)}
          >
            {item.label}
          </LumenButton>
        ))}
      </div>
      <div
        className="lumen-filtering-assets"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {visible.length ? (
          visible.map((asset) => (
            <article key={asset.id}>
              <span>{asset.name.split('.').pop()?.toUpperCase()}</span>
              <strong>{asset.name}</strong>
              <small>{asset.meta}</small>
            </article>
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        )}
      </div>
    </Root>
  );
}
function Flights(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringFlightsContent },
) {
  const times = uniqueLumenFilteringItems(props.content.times);
  const flights = uniqueLumenFilteringItems(props.content.flights);
  const [timeId, setTimeId] = React.useState(props.content.initialTimeId);
  const time = selectLumenFilteringItem(times, timeId);
  const visible = flights.filter((flight) => time?.id === 'any' || flight.timeId === time?.id);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div
        className="lumen-filtering-tabs"
        role="tablist"
        aria-label={props.content.labels.departure}
      >
        {times.map((item) => (
          <LumenButton
            key={item.id}
            role="tab"
            variant="text"
            aria-selected={time?.id === item.id}
            onClick={() => {
              setTimeId(item.id);
              report(props.onAction, 'time', item.id);
            }}
          >
            {item.label}
          </LumenButton>
        ))}
      </div>
      <div
        className="lumen-filtering-flights"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {visible.length ? (
          visible.map((flight) => (
            <article key={flight.id}>
              <strong>{flight.label}</strong>
              <small>{flight.detail}</small>
              <b>{flight.price}</b>
              <LumenButton
                variant="outlined"
                onClick={() => report(props.onAction, 'select', flight.id)}
              >
                {props.content.labels.select}
              </LumenButton>
            </article>
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        )}
      </div>
    </Root>
  );
}
function Cuisine(
  props: Omit<LumenFilteringProps, 'content'> & { content: LumenFilteringCuisineContent },
) {
  const cuisines = uniqueLumenFilteringItems(props.content.cuisines);
  const prices = uniqueLumenFilteringItems(props.content.prices);
  const maximum = Math.max(0, props.content.maximumRating);
  const [cuisineId, setCuisineId] = React.useState(props.content.initialCuisineId);
  const [rating, setRating] = React.useState(
    Math.max(0, Math.min(maximum, props.content.initialRating)),
  );
  const [priceId, setPriceId] = React.useState(props.content.initialPriceId);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div
        className="lumen-filtering-pills"
        role="group"
        aria-label={props.content.labels.cuisines}
      >
        {cuisines.map((item) => (
          <LumenButton
            key={item.id}
            variant={cuisineId === item.id ? 'solid' : 'outlined'}
            onClick={() => {
              setCuisineId(item.id);
              report(props.onAction, 'cuisine', item.id);
            }}
          >
            {item.label}
          </LumenButton>
        ))}
      </div>
      <div className="lumen-filtering-rating" role="group" aria-label={props.content.labels.rating}>
        {Array.from({ length: maximum }, (_, index) => index + 1).map((value) => (
          <LumenIconButton
            key={value}
            label={props.content.labels.ratingValue(value)}
            tone={value <= rating ? 'primary' : 'neutral'}
            onClick={() => setRating(value)}
          >
            <Glyph name="star" />
          </LumenIconButton>
        ))}
        <span>{props.content.labels.ratingValue(rating)}</span>
      </div>
      <div className="lumen-filtering-prices" role="group" aria-label={props.content.labels.price}>
        {prices.map((item) => (
          <LumenButton
            key={item.id}
            variant={priceId === item.id ? 'solid' : 'outlined'}
            onClick={() => setPriceId(item.id)}
          >
            {item.label}
          </LumenButton>
        ))}
      </div>
    </Root>
  );
}
function empty(props: LumenFilteringProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenFiltering(props: LumenFilteringProps) {
  const contextContent = useLumenFilteringContent();
  const content = props.content ?? contextContent;
  if (props.variant === 1) {
    return content?.product ? <Product {...props} content={content.product} /> : empty(props);
  }
  if (props.variant === 2) {
    return content?.drawer ? <Drawer {...props} content={content.drawer} /> : empty(props);
  }
  if (props.variant === 3) {
    return content?.query ? <Query {...props} content={content.query} /> : empty(props);
  }
  if (props.variant === 4) {
    return content?.log ? <Log {...props} content={content.log} /> : empty(props);
  }
  if (props.variant === 5) {
    return content?.property ? <Property {...props} content={content.property} /> : empty(props);
  }
  if (props.variant === 6) {
    return content?.candidate ? <Candidate {...props} content={content.candidate} /> : empty(props);
  }
  if (props.variant === 7) {
    return content?.assets ? <Assets {...props} content={content.assets} /> : empty(props);
  }
  if (props.variant === 8) {
    return content?.flights ? <Flights {...props} content={content.flights} /> : empty(props);
  }
  if (props.variant === 9) {
    return content?.cuisine ? <Cuisine {...props} content={content.cuisine} /> : empty(props);
  }
  return empty(props);
}
function variant(value: number, props: LumenFilteringVariantProps) {
  return <LumenFiltering {...props} variant={value} variantId={`hbar-app-ui-filtering-${value}`} />;
}
export const LumenFiltering01 = (props: LumenFilteringVariantProps) => variant(1, props);
export const LumenFiltering02 = (props: LumenFilteringVariantProps) => variant(2, props);
export const LumenFiltering03 = (props: LumenFilteringVariantProps) => variant(3, props);
export const LumenFiltering04 = (props: LumenFilteringVariantProps) => variant(4, props);
export const LumenFiltering05 = (props: LumenFilteringVariantProps) => variant(5, props);
export const LumenFiltering06 = (props: LumenFilteringVariantProps) => variant(6, props);
export const LumenFiltering07 = (props: LumenFilteringVariantProps) => variant(7, props);
export const LumenFiltering08 = (props: LumenFilteringVariantProps) => variant(8, props);
export const LumenFiltering09 = (props: LumenFilteringVariantProps) => variant(9, props);
