import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Form, IconButton, Spinner,
} from '@openedx/paragon';
import {
  RiCheckboxCircleFill,
  RiLoader4Line,
  RiInformationLine,
  RiCloseLine,
  RiEditLine,
  RiCheckLine,
  RiSparkling2Line,
} from '@remixicon/react';
import messages from '../../messages';
import { componentTypeMeta } from '../../data/constants';
import { useUpdateComponentScript, useRefineScript } from '../../data/apiHooks';
import './ScriptCard.scss';

const ScriptCard = ({
  courseCreationId,
  componentId,
  typeId,
  script,
  status,
  onRemove,
}) => {
  const intl = useIntl();
  const meta = componentTypeMeta(typeId);
  const Icon = meta.icon;
  const label = meta.label ? intl.formatMessage(meta.label) : meta.id;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(script || '');
  const update = useUpdateComponentScript();

  const refine = useRefineScript();
  const [refining, setRefining] = useState(false);
  const [instruction, setInstruction] = useState('');

  const startEdit = () => {
    setDraft(script || '');
    setRefining(false);
    setEditing(true);
  };

  const commit = () => {
    if (!componentId) { return; }
    update.mutate(
      { componentId, script: draft, courseCreationId },
      { onSuccess: () => setEditing(false) },
    );
  };

  const startRefine = () => {
    setEditing(false);
    setInstruction('');
    setRefining((v) => !v);
  };

  const submitRefine = () => {
    if (!componentId || !instruction.trim()) { return; }
    refine.mutate(
      { componentId, instruction: instruction.trim(), courseCreationId },
      { onSuccess: () => { setRefining(false); setInstruction(''); } },
    );
  };

  return (
    <div className={`ai-studio-script-card ai-studio-script-card--${status}`}>
      <div className="ai-studio-script-card__header">
        <span className="ai-studio-script-card__pill">
          <Icon size={16} className="ai-studio-script-card__pill-icon" />
          <span className="ai-studio-script-card__pill-label">{label}</span>
          {onRemove && (
            <button
              type="button"
              className="ai-studio-script-card__pill-close"
              onClick={onRemove}
              aria-label={intl.formatMessage(messages.removeComponent, { label })}
            >
              <RiCloseLine size={16} />
            </button>
          )}
        </span>
        <span className="ai-studio-script-card__status">
          {status === 'done' && (
            <>
              {!editing && componentId && (
                <IconButton
                  iconAs={RiEditLine}
                  alt={intl.formatMessage(messages.actionEdit)}
                  size="sm"
                  variant="ghost-secondary"
                  onClick={startEdit}
                />
              )}
              {!editing && componentId && (
                <IconButton
                  iconAs={RiSparkling2Line}
                  alt={intl.formatMessage(messages.actionRefine)}
                  size="sm"
                  variant="ghost-secondary"
                  onClick={startRefine}
                  isActive={refining}
                />
              )}
              {editing && (
                <IconButton
                  iconAs={RiCheckLine}
                  alt={intl.formatMessage(messages.actionSave)}
                  size="sm"
                  variant="ghost-secondary"
                  onClick={commit}
                />
              )}
              <RiCheckboxCircleFill
                size={16}
                className="ai-studio-script-card__check"
              />
            </>
          )}
          {status === 'generating' && (
            <RiLoader4Line size={16} className="ai-studio-script-card__spinner" />
          )}
          {status === 'queued' && (
            <span className="ai-studio-script-card__in-queue">
              <RiInformationLine size={16} />
              <span>{intl.formatMessage(messages.scriptInQueue)}</span>
            </span>
          )}
        </span>
      </div>
      <div className="ai-studio-script-card__body">
        {editing && (
          <Form.Control
            as="textarea"
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        )}
        {refining && (
          <div className="ai-studio-script-card__refine">
            <Form.Control
              as="textarea"
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={intl.formatMessage(messages.refineInstructionPlaceholder)}
              disabled={refine.isPending}
            />
            <div className="ai-studio-script-card__refine-actions">
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => { setRefining(false); setInstruction(''); }}
                disabled={refine.isPending}
              >
                {intl.formatMessage(messages.actionCancel)}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={submitRefine}
                disabled={refine.isPending || !instruction.trim()}
                iconBefore={refine.isPending ? undefined : RiSparkling2Line}
              >
                {refine.isPending
                  ? <Spinner animation="border" size="sm" screenReaderText={intl.formatMessage(messages.refineSubmit)} />
                  : intl.formatMessage(messages.refineSubmit)}
              </Button>
            </div>
          </div>
        )}
        {!editing && status === 'done' && script && (
          <p className="ai-studio-script-card__text">
            &ldquo;
            {script}
            &rdquo;
          </p>
        )}
        {!editing && status === 'generating' && script && (
          <p className="ai-studio-script-card__text ai-studio-script-card__text--shimmer">
            &ldquo;
            {script}
            &rdquo;
          </p>
        )}
        {!editing && status === 'generating' && !script && (
          <>
            <div className="ai-studio-script-card__skeleton ai-studio-script-card__skeleton--wide" />
            <div className="ai-studio-script-card__skeleton ai-studio-script-card__skeleton--narrow" />
          </>
        )}
        {!editing && status === 'queued' && (
          <>
            <div className="ai-studio-script-card__skeleton ai-studio-script-card__skeleton--wide" />
            <div className="ai-studio-script-card__skeleton ai-studio-script-card__skeleton--narrow" />
          </>
        )}
      </div>
    </div>
  );
};

export default ScriptCard;
