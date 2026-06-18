import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';
import {
  ActionRow, Alert, Badge, Button, Card, Container, Form, IconButton, ModalDialog, Spinner,
} from '@openedx/paragon';
import { RiArrowLeftLine, RiDeleteBinLine, RiEditLine } from '@remixicon/react';
import messages from '../messages';
import { PROMPT_KEYS } from '../data/types';
import {
  usePromptOverrides,
  useSavePromptOverride,
  useDeletePromptOverride,
  usePromptAddenda,
  useSavePromptAddendum,
  useDeletePromptAddendum,
} from '../data/apiHooks';
import './PromptsAdminPage.scss';

const EMPTY_OVERRIDE = {
  id: undefined, key: PROMPT_KEYS[0], organisationId: '', body: '', isActive: true,
};
const EMPTY_ADDENDUM = {
  id: undefined, organisationId: '', body: '', isActive: true,
};

const isForbidden = (query) => query.isError && query.error?.response?.status === 403;

const PromptsAdminPage = () => {
  const intl = useIntl();

  const overrides = usePromptOverrides();
  const saveOverride = useSavePromptOverride();
  const deleteOverride = useDeletePromptOverride();
  const addenda = usePromptAddenda();
  const saveAddendum = useSavePromptAddendum();
  const deleteAddendum = useDeletePromptAddendum();

  const [oForm, setOForm] = useState(EMPTY_OVERRIDE);
  const [aForm, setAForm] = useState(EMPTY_ADDENDUM);
  // { kind: 'override' | 'addendum', id } — drives the delete confirmation modal.
  const [pendingDelete, setPendingDelete] = useState(null);

  const scopeLabel = (org) => org || intl.formatMessage(messages.promptsScopeGlobal);

  const deleting = deleteOverride.isPending || deleteAddendum.isPending;

  const confirmDelete = () => {
    if (!pendingDelete) { return; }
    const mutation = pendingDelete.kind === 'override' ? deleteOverride : deleteAddendum;
    mutation.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  };

  const submitOverride = (e) => {
    e.preventDefault();
    if (!oForm.body.trim()) { return; }
    saveOverride.mutate(oForm, { onSuccess: () => setOForm(EMPTY_OVERRIDE) });
  };

  const submitAddendum = (e) => {
    e.preventDefault();
    if (!aForm.body.trim()) { return; }
    saveAddendum.mutate(aForm, { onSuccess: () => setAForm(EMPTY_ADDENDUM) });
  };

  return (
    <Container className="ai-studio-prompts py-4">
      <Link to="/ai-studio" className="ai-studio-prompts__back">
        <RiArrowLeftLine size={16} />
        {intl.formatMessage(messages.promptsBackToStudio)}
      </Link>
      <h1 className="ai-studio-prompts__title">{intl.formatMessage(messages.promptsTitle)}</h1>
      <p className="ai-studio-prompts__subtitle text-muted">
        {intl.formatMessage(messages.promptsSubtitle)}
      </p>

      {(isForbidden(overrides) || isForbidden(addenda)) && (
        <Alert variant="warning">{intl.formatMessage(messages.promptsForbidden)}</Alert>
      )}

      {/* ---------------- Prompt overrides ---------------- */}
      <Card className="mb-4">
        <Card.Header title={intl.formatMessage(messages.promptsOverridesHeading)} />
        <Card.Section>
          <p className="text-muted small">{intl.formatMessage(messages.promptsOverridesHelp)}</p>

          <Form onSubmit={submitOverride} className="ai-studio-prompts__form">
            <Form.Row>
              <Form.Group className="mr-3 mb-2">
                <Form.Label>{intl.formatMessage(messages.promptsFieldKey)}</Form.Label>
                <Form.Control
                  as="select"
                  value={oForm.key}
                  onChange={(e) => setOForm({ ...oForm, key: e.target.value })}
                >
                  {PROMPT_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-2 flex-grow-1">
                <Form.Label>{intl.formatMessage(messages.promptsFieldOrg)}</Form.Label>
                <Form.Control
                  value={oForm.organisationId}
                  onChange={(e) => setOForm({ ...oForm, organisationId: e.target.value })}
                  placeholder="acme"
                />
              </Form.Group>
            </Form.Row>
            <Form.Group className="mb-2">
              <Form.Label>{intl.formatMessage(messages.promptsFieldBody)}</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={oForm.body}
                onChange={(e) => setOForm({ ...oForm, body: e.target.value })}
              />
            </Form.Group>
            <Form.Checkbox
              checked={oForm.isActive}
              onChange={(e) => setOForm({ ...oForm, isActive: e.target.checked })}
            >
              {intl.formatMessage(messages.promptsFieldActive)}
            </Form.Checkbox>
            <div className="ai-studio-prompts__form-actions">
              {oForm.id && (
                <Button variant="tertiary" onClick={() => setOForm(EMPTY_OVERRIDE)}>
                  {intl.formatMessage(messages.actionCancel)}
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={saveOverride.isPending || !oForm.body.trim()}>
                {saveOverride.isPending
                  ? <Spinner animation="border" size="sm" screenReaderText="Saving" />
                  : intl.formatMessage(oForm.id ? messages.promptsUpdate : messages.promptsCreate)}
              </Button>
            </div>
          </Form>

          <div className="ai-studio-prompts__list">
            {overrides.isLoading && <Spinner animation="border" screenReaderText="Loading" />}
            {overrides.data?.length === 0 && (
              <p className="text-muted">{intl.formatMessage(messages.promptsEmpty)}</p>
            )}
            {(overrides.data || []).map((row) => (
              <div key={row.id} className="ai-studio-prompts__row">
                <div className="ai-studio-prompts__row-head">
                  <strong>{row.key}</strong>
                  <Badge variant="light">{scopeLabel(row.organisationId)}</Badge>
                  {!row.isActive && (
                    <Badge variant="secondary">{intl.formatMessage(messages.promptsInactiveBadge)}</Badge>
                  )}
                  <span className="ai-studio-prompts__row-actions">
                    <IconButton
                      iconAs={RiEditLine}
                      alt={intl.formatMessage(messages.actionEdit)}
                      size="sm"
                      onClick={() => setOForm({
                        id: row.id,
                        key: row.key,
                        organisationId: row.organisationId,
                        body: row.body,
                        isActive: row.isActive,
                      })}
                    />
                    <IconButton
                      iconAs={RiDeleteBinLine}
                      alt={intl.formatMessage(messages.actionDelete)}
                      size="sm"
                      variant="danger"
                      onClick={() => setPendingDelete({ kind: 'override', id: row.id })}
                    />
                  </span>
                </div>
                <pre className="ai-studio-prompts__row-body">{row.body}</pre>
              </div>
            ))}
          </div>
        </Card.Section>
      </Card>

      {/* ---------------- Business-logic addenda ---------------- */}
      <Card>
        <Card.Header title={intl.formatMessage(messages.promptsAddendaHeading)} />
        <Card.Section>
          <p className="text-muted small">{intl.formatMessage(messages.promptsAddendaHelp)}</p>

          <Form onSubmit={submitAddendum} className="ai-studio-prompts__form">
            <Form.Group className="mb-2">
              <Form.Label>{intl.formatMessage(messages.promptsFieldOrg)}</Form.Label>
              <Form.Control
                value={aForm.organisationId}
                onChange={(e) => setAForm({ ...aForm, organisationId: e.target.value })}
                placeholder="acme"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{intl.formatMessage(messages.promptsFieldBody)}</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={aForm.body}
                onChange={(e) => setAForm({ ...aForm, body: e.target.value })}
              />
            </Form.Group>
            <Form.Checkbox
              checked={aForm.isActive}
              onChange={(e) => setAForm({ ...aForm, isActive: e.target.checked })}
            >
              {intl.formatMessage(messages.promptsFieldActive)}
            </Form.Checkbox>
            <div className="ai-studio-prompts__form-actions">
              {aForm.id && (
                <Button variant="tertiary" onClick={() => setAForm(EMPTY_ADDENDUM)}>
                  {intl.formatMessage(messages.actionCancel)}
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={saveAddendum.isPending || !aForm.body.trim()}>
                {saveAddendum.isPending
                  ? <Spinner animation="border" size="sm" screenReaderText="Saving" />
                  : intl.formatMessage(aForm.id ? messages.promptsUpdate : messages.promptsCreate)}
              </Button>
            </div>
          </Form>

          <div className="ai-studio-prompts__list">
            {addenda.isLoading && <Spinner animation="border" screenReaderText="Loading" />}
            {addenda.data?.length === 0 && (
              <p className="text-muted">{intl.formatMessage(messages.promptsEmpty)}</p>
            )}
            {(addenda.data || []).map((row) => (
              <div key={row.id} className="ai-studio-prompts__row">
                <div className="ai-studio-prompts__row-head">
                  <Badge variant="light">{scopeLabel(row.organisationId)}</Badge>
                  {!row.isActive && (
                    <Badge variant="secondary">{intl.formatMessage(messages.promptsInactiveBadge)}</Badge>
                  )}
                  <span className="ai-studio-prompts__row-actions">
                    <IconButton
                      iconAs={RiEditLine}
                      alt={intl.formatMessage(messages.actionEdit)}
                      size="sm"
                      onClick={() => setAForm({
                        id: row.id,
                        organisationId: row.organisationId,
                        body: row.body,
                        isActive: row.isActive,
                      })}
                    />
                    <IconButton
                      iconAs={RiDeleteBinLine}
                      alt={intl.formatMessage(messages.actionDelete)}
                      size="sm"
                      variant="danger"
                      onClick={() => setPendingDelete({ kind: 'addendum', id: row.id })}
                    />
                  </span>
                </div>
                <pre className="ai-studio-prompts__row-body">{row.body}</pre>
              </div>
            ))}
          </div>
        </Card.Section>
      </Card>

      <ModalDialog
        title={intl.formatMessage(messages.promptsDeleteTitle)}
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        hasCloseButton
        isBlocking={deleting}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>{intl.formatMessage(messages.promptsDeleteTitle)}</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          {intl.formatMessage(messages.promptsDeleteBody)}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <Button variant="tertiary" onClick={() => setPendingDelete(null)} disabled={deleting}>
              {intl.formatMessage(messages.actionCancel)}
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting
                ? <Spinner animation="border" size="sm" screenReaderText="Deleting" />
                : intl.formatMessage(messages.actionDelete)}
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </Container>
  );
};

export default PromptsAdminPage;
