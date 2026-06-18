import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, IconButton } from '@openedx/paragon';
import {
  RiCheckboxCircleFill,
  RiLoader4Line,
  RiInformationLine,
  RiCloseLine,
  RiEditLine,
  RiCheckLine,
} from '@remixicon/react';
import messages from '../../messages';
import { componentTypeMeta } from '../../data/constants';
import { useUpdateComponentScript } from '../../data/apiHooks';
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

  const startEdit = () => {
    setDraft(script || '');
    setEditing(true);
  };

  const commit = () => {
    if (!componentId) { return; }
    update.mutate(
      { componentId, script: draft, courseCreationId },
      { onSuccess: () => setEditing(false) },
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
