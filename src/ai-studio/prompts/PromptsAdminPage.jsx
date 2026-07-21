import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Button, Container, Form, Spinner, Stack,
} from '@openedx/paragon';
import { RiArrowLeftLine, RiBuildingLine } from '@remixicon/react';

import messages from '../messages';
import { PROMPT_KEY_FIELDS, editablePromptKeys } from '../data/constants';
import {
  useAllowedOrgs,
  usePromptOverrides,
  usePromptAddenda,
  usePromptDefaults,
  useSavePromptOverride,
  useDeletePromptOverride,
  useSavePromptAddendum,
  useDeletePromptAddendum,
} from '../data/apiHooks';
import PromptEditorCard from './PromptEditorCard';
import './PromptsAdminPage.scss';

const isForbidden = (query) => query.isError && query.error?.response?.status === 403;

const BackToStudio = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  return (
    <Button
      variant="tertiary"
      size="sm"
      className="ai-studio-prompts__back mb-3"
      iconBefore={RiArrowLeftLine}
      onClick={() => navigate('/ai-studio')}
    >
      {intl.formatMessage(messages.promptsBack)}
    </Button>
  );
};

/** Shown instead of the editor to non-staff users. */
const PromptsAccessDenied = () => {
  const intl = useIntl();
  return (
    <div className="ai-studio-prompts">
      <Container size="lg" className="ai-studio-prompts__container py-4">
        <BackToStudio />
        <Alert variant="warning">{intl.formatMessage(messages.promptsStaffOnly)}</Alert>
      </Container>
    </div>
  );
};

const PromptsAdminPageContent = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const { data: orgInfo } = useAllowedOrgs();
  const allowedOrgs = useMemo(() => orgInfo?.allowedOrganizations || [], [orgInfo]);
  // Prompts are scoped to one organisation. Default to the first allowed org;
  // a selector lets admins switch when they manage several.
  const [org, setOrg] = useState('');
  useEffect(() => {
    if (!org && allowedOrgs.length) { setOrg(allowedOrgs[0]); }
  }, [allowedOrgs, org]);

  // Read once per mount — config is fixed for the life of the app.
  const editableKeys = useMemo(() => editablePromptKeys(), []);

  const overridesQuery = usePromptOverrides(org);
  const addendaQuery = usePromptAddenda(org);
  const { data: defaults = {} } = usePromptDefaults();

  const saveOverride = useSavePromptOverride();
  const deleteOverride = useDeletePromptOverride();
  const saveAddendum = useSavePromptAddendum();
  const deleteAddendum = useDeletePromptAddendum();

  const overrideByKey = useMemo(() => {
    const map = {};
    (overridesQuery.data || []).forEach((o) => { map[o.key] = o; });
    return map;
  }, [overridesQuery.data]);

  // At most one addendum row per org.
  const addendum = (addendaQuery.data || [])[0] || null;

  const handleSaveOverride = (key, row) => async ({ body, isActive }) => {
    await saveOverride.mutateAsync({
      id: row?.id, key, organisationId: org, body, isActive,
    });
  };

  const handleResetOverride = (row) => async () => {
    if (row) { await deleteOverride.mutateAsync(row.id); }
  };

  const handleSaveAddendum = async ({ body, isActive }) => {
    await saveAddendum.mutateAsync({
      id: addendum?.id, organisationId: org, body, isActive,
    });
  };

  const handleResetAddendum = async () => {
    if (addendum) { await deleteAddendum.mutateAsync(addendum.id); }
  };

  const isLoading = overridesQuery.isLoading || addendaQuery.isLoading;
  const loadError = overridesQuery.isError || addendaQuery.isError;
  const forbidden = isForbidden(overridesQuery) || isForbidden(addendaQuery);

  return (
    <div className="ai-studio-prompts">
      <Container size="lg" className="ai-studio-prompts__container py-4">
        <BackToStudio />

        <header className="ai-studio-prompts__header">
          <h1 className="ai-studio-prompts__title">{intl.formatMessage(messages.promptsHeading)}</h1>
          <p className="ai-studio-prompts__subtitle">{intl.formatMessage(messages.promptsSubtitle)}</p>
          <Form.Group className="ai-studio-prompts__org-select mt-3 mb-0">
            <Form.Label className="x-small text-gray-600 mb-1">
              <RiBuildingLine size={14} className="ai-studio-prompts__scope-icon" />
              {intl.formatMessage(messages.promptsScopeLabel)}
            </Form.Label>
            <Form.Control
              as="select"
              size="sm"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            >
              {/* Blank scope is the backend's global scope — always editable, so
                  the page still works on instances with no org list. */}
              <option value="">{intl.formatMessage(messages.promptsScopeGlobal)}</option>
              {allowedOrgs.map((o) => <option key={o} value={o}>{o}</option>)}
            </Form.Control>
          </Form.Group>
        </header>

        {forbidden && (
          <Alert variant="warning">{intl.formatMessage(messages.promptsForbidden)}</Alert>
        )}

        {!forbidden && (
          <>
            {loadError && !forbidden && (
              <Alert variant="danger">{intl.formatMessage(messages.promptsLoadError)}</Alert>
            )}

            {isLoading ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" screenReaderText={intl.formatMessage(messages.promptsHeading)} />
              </div>
            ) : (
              <Stack gap={5}>
                <section className="ai-studio-prompts__section">
                  <h2 className="ai-studio-prompts__section-title">
                    {intl.formatMessage(messages.promptsOverridesHeading)}
                  </h2>
                  <p className="ai-studio-prompts__section-hint">
                    {intl.formatMessage(messages.promptsOverridesHint)}
                  </p>
                  <Stack gap={3}>
                    {PROMPT_KEY_FIELDS.map((k) => (
                      <PromptEditorCard
                        key={`${k.id}-${org}`}
                        title={intl.formatMessage(k.label)}
                        help={intl.formatMessage(k.help)}
                        readOnly={!editableKeys.includes(k.id)}
                        structured={k.structured}
                        row={overrideByKey[k.id] || null}
                        defaultBody={defaults[k.id] || ''}
                        placeholder={intl.formatMessage(messages.promptsBodyPlaceholder)}
                        onSave={handleSaveOverride(k.id, overrideByKey[k.id] || null)}
                        onReset={handleResetOverride(overrideByKey[k.id] || null)}
                      />
                    ))}
                  </Stack>
                </section>

                <section className="ai-studio-prompts__section">
                  <h2 className="ai-studio-prompts__section-title">
                    {intl.formatMessage(messages.promptsAddendumHeading)}
                  </h2>
                  <p className="ai-studio-prompts__section-hint">
                    {intl.formatMessage(messages.promptsAddendumHint)}
                  </p>
                  <PromptEditorCard
                    key={`addendum-${org}`}
                    title={intl.formatMessage(messages.promptsAddendumHeading)}
                    row={addendum}
                    placeholder={intl.formatMessage(messages.promptsAddendumPlaceholder)}
                    onSave={handleSaveAddendum}
                    onReset={handleResetAddendum}
                  />
                </section>
              </Stack>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

/**
 * Prompt settings are staff-only: an override applies to every course generated
 * under the scope. The `administrator` JWT claim mirrors Django's `is_staff`
 * (superusers are staff too), which is exactly what the backend's `IsAdminUser`
 * permission checks — this gate keeps non-staff out of a page that would only
 * 403, it is not the security boundary.
 */
const PromptsAdminPage = () => {
  const { authenticatedUser } = useContext(AppContext);
  if (!authenticatedUser?.administrator) {
    return <PromptsAccessDenied />;
  }
  return <PromptsAdminPageContent />;
};

export default PromptsAdminPage;
