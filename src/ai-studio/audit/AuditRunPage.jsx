import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert, Badge, Button, Collapsible, Container, Hyperlink, Skeleton, Stack,
} from '@openedx/paragon';
import { RiArrowLeftLine, RiErrorWarningLine } from '@remixicon/react';
import { format as formatDate, parseISO } from 'date-fns';

import messages from '../messages';
import { useAuditRun } from '../data/apiHooks';
import { STAGES } from '../data/constants';
import { formatDuration, stageColor, stageLabel } from './stages';
import './AuditPage.scss';

const safeFormat = (iso, pattern = 'MMM dd, yyyy HH:mm:ss') => {
  try { return formatDate(parseISO(iso), pattern); } catch { return '—'; }
};

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) { return '—'; }
  if (bytes < 1024) { return `${bytes} B`; }
  if (bytes < 1024 * 1024) { return `${Math.round(bytes / 1024)} KB`; }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Renders any metadata value — strings, numbers, arrays and nested objects. */
const MetadataValue = ({ value }) => {
  if (value === null || value === undefined || value === '') { return <span className="text-muted">—</span>; }
  if (Array.isArray(value)) {
    return (
      <Stack direction="horizontal" gap={1} className="flex-wrap">
        {value.map((v, i) => (
          // Metadata values are plain scalars with no stable id of their own.
          // eslint-disable-next-line react/no-array-index-key
          <Badge key={i} variant="light" size="sm">{String(v)}</Badge>
        ))}
      </Stack>
    );
  }
  if (typeof value === 'object') {
    return <pre className="ai-studio-audit__json">{JSON.stringify(value, null, 2)}</pre>;
  }
  return <span>{String(value)}</span>;
};

const Section = ({ title, count, children }) => (
  <section className="ai-studio-audit__section">
    <h2 className="ai-studio-audit__section-title">
      {title}
      {count !== undefined && <span className="ai-studio-audit__section-count">{count}</span>}
    </h2>
    {children}
  </section>
);

const Transcript = ({ run }) => {
  const intl = useIntl();
  if (!run.messages.length) {
    return <p className="ai-studio-audit__empty">{intl.formatMessage(messages.auditNoMessages)}</p>;
  }
  return (
    <ol className="ai-studio-audit__transcript">
      {run.messages.map((m) => (
        <li key={m.id} className={`ai-studio-audit__msg ai-studio-audit__msg--${m.role}`}>
          <div className="ai-studio-audit__msg-head">
            <Badge variant="light" size="sm">{m.role}</Badge>
            <time dateTime={m.createdAt}>{safeFormat(m.createdAt)}</time>
          </div>
          {m.content && <div className="ai-studio-audit__msg-body">{m.content}</div>}
          {m.toolCalls?.length > 0 && (
            <Collapsible
              styling="basic"
              title={intl.formatMessage(messages.auditToolCalls, { count: m.toolCalls.length })}
              className="ai-studio-audit__tools"
            >
              <pre className="ai-studio-audit__json">{JSON.stringify(m.toolCalls, null, 2)}</pre>
            </Collapsible>
          )}
        </li>
      ))}
    </ol>
  );
};

const AuditRunContent = ({ courseCreationId }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { data: run, isLoading, error } = useAuditRun(courseCreationId);

  if (isLoading) {
    return (
      <Container size="xl" className="py-4">
        <Skeleton height={32} className="mb-3" />
        <Skeleton height={200} count={2} />
      </Container>
    );
  }

  if (error || !run) {
    const forbidden = error?.response?.status === 403;
    const missing = error?.response?.status === 404;
    return (
      <Container size="xl" className="py-4">
        <Button
          variant="tertiary"
          size="sm"
          className="mb-3"
          iconBefore={RiArrowLeftLine}
          onClick={() => navigate('/ai-studio/audit')}
        >
          {intl.formatMessage(messages.auditBackToList)}
        </Button>
        <Alert variant="warning" icon={RiErrorWarningLine}>
          {intl.formatMessage(
            // eslint-disable-next-line no-nested-ternary
            forbidden ? messages.auditStaffOnly
              : (missing ? messages.auditRunMissing : messages.auditLoadError),
          )}
        </Alert>
      </Container>
    );
  }

  const metadataKeys = Object.keys(run.metadata || {});

  return (
    <Container size="xl" className="py-4">
      <Button
        variant="tertiary"
        size="sm"
        className="mb-3"
        iconBefore={RiArrowLeftLine}
        onClick={() => navigate('/ai-studio/audit')}
      >
        {intl.formatMessage(messages.auditBackToList)}
      </Button>

      <header className="ai-studio-audit__header">
        <Stack direction="horizontal" gap={2} className="align-items-center flex-wrap">
          <h1 className="ai-studio-audit__title mb-0">
            {run.title || intl.formatMessage(messages.historyUntitled)}
          </h1>
          <Badge variant="soft" color={stageColor(run.stage)}>{stageLabel(intl, run.stage)}</Badge>
        </Stack>
        <p className="ai-studio-audit__subtitle">
          {intl.formatMessage(messages.auditRunByline, {
            username: run.username,
            org: run.organisationId || '—',
            created: safeFormat(run.createdAt, 'MMM dd, yyyy HH:mm'),
          })}
        </p>
      </header>

      {run.stage === STAGES.FAILED && (
        <Alert variant="danger" icon={RiErrorWarningLine}>
          <Alert.Heading>{intl.formatMessage(messages.auditFailureHeading)}</Alert.Heading>
          <p className="mb-0">
            {run.errorMessage || intl.formatMessage(messages.buildFailedFallback)}
          </p>
          {run.buildProgressDetail && (
            <p className="mb-0 mt-2 small">
              {intl.formatMessage(messages.auditFailedAt, {
                detail: run.buildProgressDetail,
                current: run.buildProgressCurrent,
                total: run.buildProgressTotal,
              })}
            </p>
          )}
        </Alert>
      )}

      <dl className="ai-studio-audit__facts">
        <div><dt>{intl.formatMessage(messages.auditColOwner)}</dt><dd>{run.username} ({run.email})</dd></div>
        <div><dt>{intl.formatMessage(messages.auditColOrg)}</dt><dd>{run.organisationId || '—'}</dd></div>
        <div><dt>{intl.formatMessage(messages.auditColDuration)}</dt><dd>{formatDuration(run.durationSeconds)}</dd></div>
        <div><dt>{intl.formatMessage(messages.auditFactUpdated)}</dt><dd>{safeFormat(run.updatedAt)}</dd></div>
        <div>
          <dt>{intl.formatMessage(messages.auditFactCourse)}</dt>
          <dd>
            {run.courseKey ? (
              <Hyperlink destination={`${getConfig().STUDIO_BASE_URL}/course/${run.courseKey}`} target="_blank">
                {run.courseKey}
              </Hyperlink>
            ) : '—'}
          </dd>
        </div>
        <div><dt>{intl.formatMessage(messages.auditFactTaskId)}</dt><dd>{run.buildTaskId || '—'}</dd></div>
      </dl>

      {run.attachedFiles?.length > 0 && (
        <Section title={intl.formatMessage(messages.auditFilesHeading)} count={run.attachedFiles.length}>
          <ul className="ai-studio-audit__files">
            {run.attachedFiles.map((f) => (
              <li key={`${f.name}-${f.size}`}>
                <span>{f.name}</span>
                <span className="text-muted">{f.type} · {formatBytes(f.size)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {metadataKeys.length > 0 && (
        <Section title={intl.formatMessage(messages.auditBriefHeading)}>
          <dl className="ai-studio-audit__facts">
            {metadataKeys.map((key) => (
              <div key={key}>
                <dt>{key.replace(/_/g, ' ')}</dt>
                <dd><MetadataValue value={run.metadata[key]} /></dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section title={intl.formatMessage(messages.auditOutlineHeading)}>
        <p className="ai-studio-audit__section-hint">
          {intl.formatMessage(messages.auditOutlineCounts, {
            sections: run.outline.counts.section,
            subsections: run.outline.counts.subsection,
            units: run.outline.counts.unit,
          })}
        </p>
        {run.outline.nodes.length > 0 && (
          <ul className="ai-studio-audit__outline">
            {run.outline.nodes.map((node) => (
              <li key={node.id} className={`ai-studio-audit__outline-${node.hierarchy}`}>
                {node.name}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={intl.formatMessage(messages.auditComponentsHeading)} count={run.components.length}>
        {run.components.length === 0 ? (
          <p className="ai-studio-audit__empty">{intl.formatMessage(messages.auditNoComponents)}</p>
        ) : (
          <div className="ai-studio-audit__components">
            {run.components.map((c) => (
              <Collapsible
                key={c.id}
                styling="card-lg"
                title={(
                  <Stack direction="horizontal" gap={2} className="align-items-center flex-wrap">
                    <Badge variant="light" size="sm">{c.componentType}</Badge>
                    <span>{c.unitName}</span>
                    {c.wasEdited && (
                      <Badge variant="soft" color="info" size="sm">
                        {intl.formatMessage(messages.auditEditedBadge)}
                      </Badge>
                    )}
                  </Stack>
                )}
              >
                <pre className="ai-studio-audit__script">{c.script || '—'}</pre>
              </Collapsible>
            ))}
          </div>
        )}
      </Section>

      {run.videoJobs.length > 0 && (
        <Section title={intl.formatMessage(messages.auditVideoHeading)} count={run.videoJobs.length}>
          <div className="ai-studio-audit__table-wrap">
            <table className="ai-studio-audit__table">
              <thead>
                <tr>
                  <th>{intl.formatMessage(messages.auditVideoProvider)}</th>
                  <th>{intl.formatMessage(messages.auditVideoJobId)}</th>
                  <th>{intl.formatMessage(messages.auditVideoStatus)}</th>
                  <th className="text-right">{intl.formatMessage(messages.auditColDuration)}</th>
                  <th>{intl.formatMessage(messages.auditVideoError)}</th>
                </tr>
              </thead>
              <tbody>
                {run.videoJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.provider}</td>
                    <td className="ai-studio-audit__mono">{job.providerJobId || '—'}</td>
                    <td>
                      <Badge
                        variant="soft"
                        color={job.status === 'failed' ? 'danger' : 'info'}
                        size="sm"
                      >
                        {job.status}
                      </Badge>
                    </td>
                    <td className="text-right">{formatDuration(job.durationSeconds)}</td>
                    <td className="ai-studio-audit__row-error">{job.errorMessage || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section title={intl.formatMessage(messages.auditTranscriptHeading)} count={run.messages.length}>
        <Transcript run={run} />
      </Section>
    </Container>
  );
};

/** Full recorded trail for one run. Staff-only, see AuditPage. */
const AuditRunPage = () => {
  const intl = useIntl();
  const { courseCreationId } = useParams();
  const { authenticatedUser } = useContext(AppContext);

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, { siteName: process.env.SITE_NAME })}
        </title>
      </Helmet>
      <div className="ai-studio-audit">
        {authenticatedUser?.administrator ? (
          <AuditRunContent courseCreationId={courseCreationId} />
        ) : (
          <Container size="xl" className="py-4">
            <Alert variant="warning">{intl.formatMessage(messages.auditStaffOnly)}</Alert>
          </Container>
        )}
      </div>
    </>
  );
};

export default AuditRunPage;
