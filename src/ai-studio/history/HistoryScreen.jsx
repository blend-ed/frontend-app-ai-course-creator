import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Badge, Button, SearchField, Spinner,
} from '@openedx/paragon';
import {
  RiAddLine, RiCheckboxCircleFill, RiLoader4Line,
} from '@remixicon/react';
import { format as formatDate, parseISO, isToday } from 'date-fns';

import messages from '../messages';
import { useCourseCreations } from '../data/apiHooks';
import { STAGES } from '../data/constants';
import HoverCard from './HoverCard';
import './HistoryScreen.scss';

const PHASES = [
  {
    id: 'outline',
    labelKey: 'progressOutline',
    stages: [STAGES.INIT, STAGES.METADATA_COLLECTION, STAGES.OUTLINE_CREATION],
  },
  {
    id: 'scripts',
    labelKey: 'progressScripts',
    stages: [STAGES.COMPONENT_PLAN, STAGES.SCRIPT_GENERATION],
  },
  {
    id: 'assembly',
    labelKey: 'progressAssembly',
    stages: [STAGES.BUILDING],
  },
];

const phaseState = (stage, phaseIdx) => {
  const activeIdx = PHASES.findIndex((p) => p.stages.includes(stage));
  if (activeIdx === -1) {
    return 'pending';
  }
  if (phaseIdx < activeIdx) {
    return 'done';
  }
  if (phaseIdx === activeIdx) {
    return 'active';
  }
  return 'pending';
};

const STAGE_LABEL_KEYS = {
  [STAGES.INIT]: 'historyStageInit',
  [STAGES.METADATA_COLLECTION]: 'historyStageMetadata',
  [STAGES.OUTLINE_CREATION]: 'historyStageOutline',
  [STAGES.COMPONENT_PLAN]: 'historyStageComponentPlan',
  [STAGES.SCRIPT_GENERATION]: 'historyStageScripts',
  [STAGES.BUILDING]: 'historyStageBuilding',
  [STAGES.SUCCESS]: 'historyStageCompleted',
  [STAGES.FAILED]: 'historyStageFailed',
};

const isInProgress = (stage) => (
  stage !== STAGES.SUCCESS && stage !== STAGES.FAILED
);

const safeFormat = (iso, pattern) => {
  try { return formatDate(parseISO(iso), pattern); } catch { return ''; }
};

const HistoryScreen = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useCourseCreations();
  const [query, setQuery] = useState('');

  const { todayItems, olderItems } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((it) => {
      if (!q) {
        return true;
      }
      return (it.title || '').toLowerCase().includes(q);
    });
    const sorted = [...filtered].sort((a, b) => (
      (b.updatedAt || '').localeCompare(a.updatedAt || '')
    ));
    const today = [];
    const older = [];
    sorted.forEach((it) => {
      let updatedToday = false;
      try { updatedToday = isToday(parseISO(it.updatedAt)); } catch { updatedToday = false; }
      if (updatedToday) {
        today.push(it);
      } else {
        older.push(it);
      }
    });
    return { todayItems: today, olderItems: older };
  }, [items, query]);

  const stageMessageFor = (stage) => {
    const key = STAGE_LABEL_KEYS[stage] || 'historyStageInit';
    return intl.formatMessage(messages[key]);
  };

  const renderRow = (item) => {
    const title = item.title || intl.formatMessage(messages.historyUntitled);
    const inProgress = isInProgress(item.stage);
    const openItem = () => {
      if (item.stage === STAGES.SUCCESS && item.courseKey) {
        window.location.assign(`${getConfig().STUDIO_BASE_URL}/course/${item.courseKey}`);
      } else {
        navigate(`/ai-studio/${item.id}`);
      }
    };
    const button = (
      <button
        type="button"
        className="ai-studio-history__row"
        onClick={openItem}
      >
        <div className="ai-studio-history__row-top">
          <span className="ai-studio-history__row-title">{title}</span>
          {item.stage === STAGES.SUCCESS && (
            <Badge variant="soft" color="success" size="sm">
              {intl.formatMessage(messages.historyStageCompleted)}
            </Badge>
          )}
          {item.stage === STAGES.FAILED && (
            <Badge variant="soft" color="danger" size="sm">
              {intl.formatMessage(messages.historyStageFailed)}
            </Badge>
          )}
        </div>
        {inProgress ? (
          <span className="ai-studio-history__row-shimmer">
            {stageMessageFor(item.stage)}
          </span>
        ) : (
          <span className="ai-studio-history__row-date">
            {safeFormat(item.updatedAt, 'MMM dd, yyyy')}
          </span>
        )}
      </button>
    );

    if (!inProgress) {
      return <React.Fragment key={item.id}>{button}</React.Fragment>;
    }

    const card = (
      <>
        <div className="ai-studio-history__progress-title">
          {intl.formatMessage(messages.progressTitle)}
        </div>
        <ul className="ai-studio-history__progress-steps">
          {PHASES.map((phase, idx) => {
            const state = phaseState(item.stage, idx);
            return (
              <li
                key={phase.id}
                className={`ai-studio-history__progress-step ai-studio-history__progress-step--${state}`}
              >
                {state === 'done' && (
                  <RiCheckboxCircleFill
                    size={14}
                    className="ai-studio-history__progress-icon-done"
                  />
                )}
                {state === 'active' && (
                  <RiLoader4Line
                    size={14}
                    className="ai-studio-history__progress-icon-active ai-studio-spin"
                  />
                )}
                {state === 'pending' && (
                  <span className="ai-studio-history__progress-icon-pending" />
                )}
                <span className="ai-studio-history__progress-label">
                  {intl.formatMessage(messages[phase.labelKey])}
                </span>
              </li>
            );
          })}
        </ul>
      </>
    );

    return (
      <HoverCard key={item.id} card={card}>
        {button}
      </HoverCard>
    );
  };

  const renderGroup = (labelMsg, rows) => {
    if (!rows.length) {
      return null;
    }
    return (
      <section className="ai-studio-history__group">
        <h3 className="ai-studio-history__group-label">
          {intl.formatMessage(labelMsg)}
        </h3>
        <div className="ai-studio-history__rows">
          {rows.map(renderRow)}
        </div>
      </section>
    );
  };

  const isEmpty = !isLoading && todayItems.length === 0 && olderItems.length === 0;

  return (
    <div className="ai-studio-history">
      <div className="ai-studio-history__container">
        <div className="ai-studio-history__header">
          <h1 className="ai-studio-history__title">
            {intl.formatMessage(messages.historyTitle)}
          </h1>
          <Button
            variant="primary"
            iconBefore={RiAddLine}
            onClick={() => navigate('/ai-studio')}
            className="ai-studio-history__new-cta"
          >
            {intl.formatMessage(messages.historyNewCourse)}
          </Button>
        </div>
        <SearchField.Advanced
          onSubmit={setQuery}
          onChange={setQuery}
          onClear={() => setQuery('')}
          value={query}
          className="ai-studio-history__search"
        >
          <SearchField.Label />
          <SearchField.Input
            placeholder={intl.formatMessage(messages.historySearchPlaceholder)}
          />
          <SearchField.ClearButton />
          <SearchField.SubmitButton />
        </SearchField.Advanced>

        {isLoading && (
          <div className="ai-studio-history__loading">
            <Spinner animation="border" size="sm" screenReaderText={intl.formatMessage(messages.historyLoading)} />
          </div>
        )}

        {!isLoading && (
          <div className="ai-studio-history__list">
            {renderGroup(messages.historyGroupToday, todayItems)}
            {renderGroup(messages.historyGroupOlder, olderItems)}
            {isEmpty && (
              <p className="ai-studio-history__empty">
                {query
                  ? intl.formatMessage(messages.historyEmptySearch)
                  : intl.formatMessage(messages.historyEmpty)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
