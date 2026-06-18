import React, {
  forwardRef, useImperativeHandle, useRef, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, IconButton } from '@openedx/paragon';
import { RiArrowUpLine, RiLoader4Line } from '@remixicon/react';
import messages from '../messages';
import './Composer.scss';

const Composer = forwardRef(({ onSend, disabled, placeholder }, ref) => {
  const intl = useIntl();
  const textRef = useRef(null);
  const [text, setText] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => textRef.current?.focus(),
  }));

  const submit = () => {
    if (disabled) { return; }
    if (!text.trim()) { return; }
    onSend({ message: text.trim(), files: [] });
    setText('');
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="ai-studio-composer"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Form.Control
        as="textarea"
        ref={textRef}
        controlClassName="ai-studio-composer__textarea"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder ?? intl.formatMessage(messages.chatPlaceholder)}
        disabled={disabled}
      />
      <div className="ai-studio-composer__actions">
        <IconButton
          type="submit"
          variant="primary"
          className="ai-studio-composer__send"
          disabled={disabled || !text.trim()}
          iconAs={disabled ? RiLoader4Line : RiArrowUpLine}
          iconClassNames={disabled ? 'ai-studio-spin' : undefined}
          alt={intl.formatMessage(messages.sendAriaLabel)}
        />
      </div>
    </form>
  );
});

Composer.displayName = 'Composer';

export default Composer;
