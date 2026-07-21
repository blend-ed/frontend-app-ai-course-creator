import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Badge, Button, Card, Form, Spinner, Stack,
} from '@openedx/paragon';

import messages from '../messages';

/**
 * Editor for a single overridable prompt or the addendum.
 *
 * `row` is the saved entry for the current scope (or null when none exists, i.e.
 * the built-in default is in effect). The field seeds from the saved override
 * body, or the built-in default when none is saved. Save creates or updates;
 * Reset deletes the row (reverting to the default) and is only offered when a
 * row exists.
 *
 * `readOnly` renders the built-in default for reference without any way to
 * change it — used for prompts whose response the pipeline parses as JSON/OLX,
 * where a free-text override would break course generation.
 */
const PromptEditorCard = ({
  title, help = undefined, row = null, defaultBody = '', placeholder = undefined,
  onSave = undefined, onReset = undefined, readOnly = false, structured = false,
}) => {
  const intl = useIntl();
  // Baseline so an unedited default is not "dirty" and cannot be re-saved as a
  // no-op override.
  const baseline = row?.body ?? defaultBody;
  const savedActive = row?.isActive ?? true;

  const [body, setBody] = useState(baseline);
  const [active, setActive] = useState(savedActive);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'saved' | 'error' | null

  // Re-seed when the row or the default changes (scope toggles, defaults load).
  useEffect(() => {
    setBody(baseline);
    setActive(savedActive);
    setFeedback(null);
  }, [row?.id, baseline, savedActive]);

  const dirty = body !== baseline || active !== savedActive;
  const canSave = dirty && body.trim().length > 0 && !busy;

  const run = async (fn) => {
    setBusy(true);
    setFeedback(null);
    try {
      await fn();
      setFeedback('saved');
    } catch {
      setFeedback('error');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () => run(() => onSave({ body: body.trim(), isActive: active }));
  const handleReset = () => run(async () => {
    await onReset();
    setBody(defaultBody);
    setActive(true);
  });

  const badge = (() => {
    if (!row) {
      return null;
    }
    return active
      ? <Badge variant="info">{intl.formatMessage(messages.promptsCustomizedBadge)}</Badge>
      : <Badge variant="light">{intl.formatMessage(messages.promptsInactiveBadge)}</Badge>;
  })();

  if (readOnly) {
    // A row can still exist here from before the key was locked (or from a
    // direct API call). Show it rather than the default so what's actually in
    // effect is visible, and keep Reset so it can be cleared.
    return (
      <Card className="ai-studio-prompts__card ai-studio-prompts__card--locked">
        <Card.Header
          size="sm"
          title={title}
          subtitle={help}
          actions={<Badge variant="light">{intl.formatMessage(messages.promptsLockedBadge)}</Badge>}
        />
        <Card.Section>
          <Form.Control
            as="textarea"
            rows={6}
            value={baseline}
            readOnly
            className="ai-studio-prompts__textarea"
          />
          <Form.Text className="mt-2">
            {intl.formatMessage(
              structured ? messages.promptsLockedHintStructured : messages.promptsLockedHint,
            )}
          </Form.Text>
        </Card.Section>
        {row && (
          <Card.Footer>
            <Stack direction="horizontal" gap={2} className="align-items-center w-100">
              <span className="me-auto">{badge}</span>
              {feedback === 'error' && (
                <span className="ai-studio-prompts__feedback ai-studio-prompts__feedback--error">
                  {intl.formatMessage(messages.promptsError)}
                </span>
              )}
              {busy && <Spinner animation="border" size="sm" screenReaderText="" />}
              <Button variant="tertiary" size="sm" onClick={handleReset} disabled={busy}>
                {intl.formatMessage(messages.promptsReset)}
              </Button>
            </Stack>
          </Card.Footer>
        )}
      </Card>
    );
  }

  return (
    <Card className="ai-studio-prompts__card">
      <Card.Header size="sm" title={title} subtitle={help} />
      <Card.Section>
        <Form.Control
          as="textarea"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          disabled={busy}
          className="ai-studio-prompts__textarea"
        />
        <Form.Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          disabled={busy}
          helperText={intl.formatMessage(messages.promptsActiveHint)}
          className="mt-3"
        >
          {intl.formatMessage(messages.promptsActiveLabel)}
        </Form.Switch>
      </Card.Section>
      <Card.Footer>
        <Stack direction="horizontal" gap={2} className="align-items-center w-100">
          <span className="me-auto">{badge}</span>
          {feedback === 'saved' && (
            <span className="ai-studio-prompts__feedback ai-studio-prompts__feedback--saved">
              {intl.formatMessage(messages.promptsSaved)}
            </span>
          )}
          {feedback === 'error' && (
            <span className="ai-studio-prompts__feedback ai-studio-prompts__feedback--error">
              {intl.formatMessage(messages.promptsError)}
            </span>
          )}
          {busy && <Spinner animation="border" size="sm" screenReaderText="" />}
          {row && (
            <Button variant="tertiary" size="sm" onClick={handleReset} disabled={busy}>
              {intl.formatMessage(messages.promptsReset)}
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!canSave}>
            {intl.formatMessage(messages.actionSave)}
          </Button>
        </Stack>
      </Card.Footer>
    </Card>
  );
};

export default PromptEditorCard;
