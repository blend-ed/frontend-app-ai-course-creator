import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, IconButton } from '@openedx/paragon';
import { RiCloseFill, RiCheckLine } from '@remixicon/react';
import messages from '../messages';
import './OptionsCard.scss';

const OptionsCard = ({
  options, onSelect, onSpecifyOther, onDismiss,
}) => {
  const intl = useIntl();
  const [selected, setSelected] = useState([]);

  if (!options) { return null; }
  const isMulti = options.type === 'multi';

  const toggle = (id) => setSelected((s) => (
    s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
  ));

  const handleSingle = (choice) => {
    if (typeof choice.id === 'string' && choice.id.toLowerCase().startsWith('specify')) {
      onSpecifyOther?.(choice);
      return;
    }
    onSelect([choice.id]);
  };

  return (
    <div className="ai-studio-options">
      <div className="ai-studio-options__header">
        <h2 className="ai-studio-options__q">{options.question}</h2>
        {options.skippable && onDismiss && (
          <IconButton
            onClick={onDismiss}
            iconAs={RiCloseFill}
            alt={intl.formatMessage(messages.actionClose)}
            size="sm"
            className="ai-studio-options__close"
          />
        )}
      </div>
      {isMulti && (
        <div className="ai-studio-options__hint">
          {intl.formatMessage(messages.selectAllThatApply)}
        </div>
      )}
      <div className="ai-studio-options__list">
        {options.choices.map((choice, idx) => {
          const checked = isMulti ? selected.includes(choice.id) : false;
          return (
            <React.Fragment key={choice.id}>
              {idx > 0 && <div className="ai-studio-options__divider" />}
              <button
                type="button"
                className="ai-studio-options__item"
                onClick={() => (isMulti ? toggle(choice.id) : handleSingle(choice))}
              >
                <span className="ai-studio-options__check-frame">
                  <span
                    className={`ai-studio-options__checkbox ${checked ? 'is-checked' : ''}`}
                    aria-hidden
                  >
                    {checked && <RiCheckLine size={10} />}
                  </span>
                </span>
                <span className="ai-studio-options__label">{choice.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
      {isMulti && (
        <div className="ai-studio-options__footer">
          <Button
            variant="soft-primary"
            size="sm"
            disabled={selected.length === 0}
            onClick={() => onSelect(selected)}
          >
            {intl.formatMessage(messages.submitOptions)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OptionsCard;
