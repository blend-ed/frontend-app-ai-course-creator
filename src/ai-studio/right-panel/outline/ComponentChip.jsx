import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { RiCloseLine } from '@remixicon/react';
import messages from '../../messages';
import { componentTypeMeta } from '../../data/constants';

const ComponentChip = ({ typeId, onRemove, suffix }) => {
  const intl = useIntl();
  const meta = componentTypeMeta(typeId);
  const Icon = meta.icon;
  const label = meta.label ? intl.formatMessage(meta.label) : meta.id;
  return (
    <span className="ai-studio-chip">
      <Icon size={16} className="ai-studio-chip__icon" />
      <span className="ai-studio-chip__label">{label}</span>
      {onRemove && (
        <button
          type="button"
          className="ai-studio-chip__remove"
          onClick={onRemove}
          aria-label={intl.formatMessage(messages.removeComponent, { label })}
        >
          <RiCloseLine size={16} />
        </button>
      )}
      {suffix}
    </span>
  );
};

export default ComponentChip;
