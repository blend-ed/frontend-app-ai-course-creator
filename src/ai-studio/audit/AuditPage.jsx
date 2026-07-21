import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert, Badge, Button, Container, Form, Pagination, SearchField, Skeleton, Stack,
} from '@openedx/paragon';
import { RiArrowLeftLine, RiErrorWarningLine } from '@remixicon/react';
import { format as formatDate, parseISO } from 'date-fns';

import messages from '../messages';
import { useAllowedOrgs, useAuditRuns, useAuditSummary } from '../data/apiHooks';
import {
  STAGE_ORDER, formatDuration, stageColor, stageLabel,
} from './stages';
import './AuditPage.scss';

const PAGE_SIZE = 25;

const safeFormat = (iso, pattern) => {
  try { return formatDate(parseISO(iso), pattern); } catch { return '—'; }
};

/** Shown instead of the audit trail to non-staff users. */
const AuditAccessDenied = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  return (
    <div className="ai-studio-audit">
      <Container size="xl" className="py-4">
        <Button
          variant="tertiary"
          size="sm"
          className="mb-3"
          iconBefore={RiArrowLeftLine}
          onClick={() => navigate('/ai-studio')}
        >
          {intl.formatMessage(messages.auditBack)}
        </Button>
        <Alert variant="warning">{intl.formatMessage(messages.auditStaffOnly)}</Alert>
      </Container>
    </div>
  );
};

const SummaryTiles = ({ summary, isLoading }) => {
  const intl = useIntl();
  if (isLoading) {
    return <Skeleton height={72} count={1} className="mb-4" />;
  }
  if (!summary) { return null; }

  const rate = summary.successRate === null
    ? '—'
    : `${Math.round(summary.successRate * 100)}%`;

  const tiles = [
    { key: 'total', label: messages.auditStatTotal, value: summary.total },
    { key: 'succeeded', label: messages.auditStatSucceeded, value: summary.succeeded },
    { key: 'failed', label: messages.auditStatFailed, value: summary.failed },
    { key: 'rate', label: messages.auditStatSuccessRate, value: rate },
  ];

  return (
    <div className="ai-studio-audit__stats">
      {tiles.map((tile) => (
        <div key={tile.key} className="ai-studio-audit__stat">
          <span className="ai-studio-audit__stat-value">{tile.value}</span>
          <span className="ai-studio-audit__stat-label">{intl.formatMessage(tile.label)}</span>
        </div>
      ))}
      {summary.successRate !== null && (
        <p className="ai-studio-audit__stats-note">
          {intl.formatMessage(messages.auditSuccessRateNote)}
        </p>
      )}
    </div>
  );
};

const AuditPageContent = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const { data: orgInfo } = useAllowedOrgs();
  const allowedOrgs = useMemo(() => orgInfo?.allowedOrganizations || [], [orgInfo]);

  const [org, setOrg] = useState('');
  const [stage, setStage] = useState('');
  // `searchInput` tracks keystrokes; `search` is the applied filter, so the
  // table refetches on submit rather than on every character.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Any filter change invalidates the current page number.
  const applyFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const filters = useMemo(() => ({
    organisationId: org, stage, search, page, pageSize: PAGE_SIZE,
  }), [org, stage, search, page]);

  const runsQuery = useAuditRuns(filters);
  const summaryQuery = useAuditSummary(org);

  const runs = runsQuery.data?.results || [];
  const total = runsQuery.data?.count || 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const forbidden = runsQuery.error?.response?.status === 403;

  // Orgs that actually have runs, so the filter can't select an empty scope.
  const orgOptions = summaryQuery.data?.organisations?.length
    ? summaryQuery.data.organisations
    : allowedOrgs;

  return (
    <div className="ai-studio-audit">
      <Container size="xl" className="py-4">
        <Button
          variant="tertiary"
          size="sm"
          className="mb-3"
          iconBefore={RiArrowLeftLine}
          onClick={() => navigate('/ai-studio')}
        >
          {intl.formatMessage(messages.auditBack)}
        </Button>

        <header className="ai-studio-audit__header">
          <h1 className="ai-studio-audit__title">{intl.formatMessage(messages.auditHeading)}</h1>
          <p className="ai-studio-audit__subtitle">{intl.formatMessage(messages.auditSubtitle)}</p>
        </header>

        {forbidden ? (
          <Alert variant="warning">{intl.formatMessage(messages.auditStaffOnly)}</Alert>
        ) : (
          <>
            <SummaryTiles summary={summaryQuery.data} isLoading={summaryQuery.isLoading} />

            <div className="ai-studio-audit__filters">
              <SearchField.Advanced
                onSubmit={applyFilter(setSearch)}
                onChange={setSearchInput}
                onClear={() => {
                  setSearchInput('');
                  applyFilter(setSearch)('');
                }}
                value={searchInput}
                className="ai-studio-audit__search"
              >
                <SearchField.Label />
                <SearchField.Input
                  placeholder={intl.formatMessage(messages.auditSearchPlaceholder)}
                />
                <SearchField.ClearButton />
                <SearchField.SubmitButton />
              </SearchField.Advanced>

              <Form.Group className="ai-studio-audit__filter mb-0">
                <Form.Label size="sm">{intl.formatMessage(messages.auditFilterOrg)}</Form.Label>
                <Form.Control
                  as="select"
                  size="sm"
                  value={org}
                  onChange={(e) => applyFilter(setOrg)(e.target.value)}
                >
                  <option value="">{intl.formatMessage(messages.auditFilterAllOrgs)}</option>
                  {orgOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </Form.Control>
              </Form.Group>

              <Form.Group className="ai-studio-audit__filter mb-0">
                <Form.Label size="sm">{intl.formatMessage(messages.auditFilterStage)}</Form.Label>
                <Form.Control
                  as="select"
                  size="sm"
                  value={stage}
                  onChange={(e) => applyFilter(setStage)(e.target.value)}
                >
                  <option value="">{intl.formatMessage(messages.auditFilterAllStages)}</option>
                  {STAGE_ORDER.map((s) => (
                    <option key={s} value={s}>{stageLabel(intl, s)}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>

            {runsQuery.isError && !forbidden && (
              <Alert variant="danger" icon={RiErrorWarningLine}>
                {intl.formatMessage(messages.auditLoadError)}
              </Alert>
            )}

            {runsQuery.isLoading ? (
              <Skeleton height={44} count={8} />
            ) : (
              <>
                <div className="ai-studio-audit__table-wrap">
                  <table className="ai-studio-audit__table">
                    <thead>
                      <tr>
                        <th>{intl.formatMessage(messages.auditColRun)}</th>
                        <th>{intl.formatMessage(messages.auditColOwner)}</th>
                        <th>{intl.formatMessage(messages.auditColOrg)}</th>
                        <th>{intl.formatMessage(messages.auditColStage)}</th>
                        <th className="text-right">{intl.formatMessage(messages.auditColActivity)}</th>
                        <th className="text-right">{intl.formatMessage(messages.auditColDuration)}</th>
                        <th>{intl.formatMessage(messages.auditColUpdated)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map((run) => (
                        <tr key={run.id}>
                          <td>
                            <Link className="ai-studio-audit__run-link" to={`/ai-studio/audit/${run.id}`}>
                              {run.title || intl.formatMessage(messages.historyUntitled)}
                            </Link>
                            {run.errorMessage && (
                              <span className="ai-studio-audit__row-error">{run.errorMessage}</span>
                            )}
                          </td>
                          <td>
                            <span className="ai-studio-audit__owner">{run.username}</span>
                            <span className="ai-studio-audit__owner-email">{run.email}</span>
                          </td>
                          <td>{run.organisationId || '—'}</td>
                          <td>
                            <Badge variant="soft" color={stageColor(run.stage)} size="sm">
                              {stageLabel(intl, run.stage)}
                            </Badge>
                          </td>
                          <td className="text-right ai-studio-audit__counts">
                            {intl.formatMessage(messages.auditActivityCounts, {
                              messages: run.messageCount,
                              units: run.unitCount,
                              components: run.componentCount,
                            })}
                          </td>
                          <td className="text-right">{formatDuration(run.durationSeconds)}</td>
                          <td>{safeFormat(run.updatedAt, 'MMM dd, yyyy HH:mm')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {runs.length === 0 && !runsQuery.isError && (
                  <p className="ai-studio-audit__empty">
                    {intl.formatMessage(messages.auditEmpty)}
                  </p>
                )}

                {pageCount > 1 && (
                  <Stack direction="horizontal" className="justify-content-between align-items-center mt-3">
                    <span className="ai-studio-audit__count">
                      {intl.formatMessage(messages.auditRunCount, { count: total })}
                    </span>
                    <Pagination
                      paginationLabel={intl.formatMessage(messages.auditPaginationLabel)}
                      pageCount={pageCount}
                      currentPage={page}
                      onPageSelect={setPage}
                      variant="reduced"
                    />
                  </Stack>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

/**
 * Audit trail over every course-creation run.
 *
 * Staff-only: this is the one place a user can read another user's runs and
 * their full chat transcript. The `administrator` JWT claim mirrors Django's
 * `is_staff`, matching the backend's `IsAdminUser` on /audit/ — the gate here
 * keeps non-staff out of a page that would only 403, it is not the boundary.
 */
const AuditPage = () => {
  const intl = useIntl();
  const { authenticatedUser } = useContext(AppContext);

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, { siteName: process.env.SITE_NAME })}
        </title>
      </Helmet>
      {authenticatedUser?.administrator ? <AuditPageContent /> : <AuditAccessDenied />}
    </>
  );
};

export default AuditPage;
