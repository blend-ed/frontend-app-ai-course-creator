import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import messages from '../../messages';

const InlineRename = ({
  value,
  onSave,
  className = '',
  as: Tag = 'span',
  placeholder,
}) => {
  const intl = useIntl();
  const resolvedPlaceholder = placeholder ?? intl.formatMessage(messages.untitledPlaceholder);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) { inputRef.current?.focus(); }
  }, [editing]);

  const commit = () => {
    const trimmed = (draft || '').trim();
    if (trimmed && trimmed !== value) { onSave(trimmed); }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <Form.Control
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Escape') { cancel(); }
        }}
        onBlur={commit}
        size="sm"
        placeholder={resolvedPlaceholder}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <Tag
      className={`ai-studio-rename ${className}`}
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setEditing(true);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {value || resolvedPlaceholder}
    </Tag>
  );
};

export default InlineRename;
