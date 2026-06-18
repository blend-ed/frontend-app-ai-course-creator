import React, { useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';
import {
  Alert, Button, Form, IconButton,
} from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import {
  RiAttachment2,
  RiArrowUpLine,
  RiCloseLine,
  RiLoader4Line,
} from '@remixicon/react';
import { getAiErrorMessage } from '../../generic/aiErrorMessage';
import messages from '../messages';
import { ACCEPTED_FILE_TYPES } from '../data/constants';
import './LandingScreen.scss';

const LandingScreen = ({
  onSubmit, isSubmitting, error, onHistoryClick,
}) => {
  const intl = useIntl();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!message.trim() || isSubmitting) { return; }
    onSubmit({ message: message.trim(), files });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const removeFile = (index) => {
    setFiles((fs) => fs.filter((_, i) => i !== index));
  };

  return (
    <div className="ai-studio-landing">
      <div className="ai-studio-landing__container">
        <div className="ai-studio-landing__hero">
          <h1 className="ai-studio-landing__heading">
            {intl.formatMessage(messages.landingHeading, { br: () => <br /> })}
          </h1>
          <p className="ai-studio-landing__subtitle">
            {intl.formatMessage(messages.landingSubtitle)}
          </p>
        </div>
        <div className="ai-studio-landing__composer-block">
          {error && !isSubmitting && (
            <Alert
              variant="danger"
              icon={ErrorIcon}
              className="ai-studio-landing__error"
            >
              {getAiErrorMessage(error, intl.formatMessage(messages.chatErrorFallback))}
            </Alert>
          )}
          <form className="ai-studio-landing__composer" onSubmit={handleSubmit}>
            <Form.Control
              as="textarea"
              controlClassName="ai-studio-landing__textarea"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={intl.formatMessage(messages.landingPromptPlaceholder)}
              disabled={isSubmitting}
            />
            {files.length > 0 && (
            <div className="ai-studio-landing__files">
              {files.map((f, i) => (
                <span key={`${f.name}-${i}`} className="ai-studio-landing__file-chip">
                  <span className="ai-studio-landing__file-name">{f.name}</span>
                  <button
                    type="button"
                    className="ai-studio-landing__file-remove"
                    onClick={() => removeFile(i)}
                    aria-label={intl.formatMessage(messages.removeFile)}
                  >
                    <RiCloseLine size={12} />
                  </button>
                </span>
              ))}
            </div>
            )}
            <div className="ai-studio-landing__actions">
              <button
                type="button"
                className="ai-studio-landing__upload-pill"
                onClick={() => fileInputRef.current?.click()}
              >
                <RiAttachment2 size={16} className="ai-studio-landing__pill-icon" />
                <span className="ai-studio-landing__pill-label">
                  {intl.formatMessage(messages.uploadLabel)}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FILE_TYPES}
                className="ai-studio-landing__file-input"
                onChange={(e) => setFiles((fs) => [...fs, ...Array.from(e.target.files || [])])}
              />
              <IconButton
                type="submit"
                variant="primary"
                className="ai-studio-landing__send"
                disabled={!message.trim() || isSubmitting}
                iconAs={isSubmitting ? RiLoader4Line : RiArrowUpLine}
                iconClassNames={isSubmitting ? 'ai-studio-spin' : undefined}
                alt={intl.formatMessage(messages.sendAriaLabel)}
              />
            </div>
          </form>
          <div className="ai-studio-landing__history-row">
            <Button
              variant="ghost-secondary"
              size="sm"
              onClick={onHistoryClick}
            >
              {intl.formatMessage(messages.creationHistory)}
            </Button>
            <Button
              as={Link}
              to="/ai-studio/prompts"
              variant="ghost-secondary"
              size="sm"
            >
              {intl.formatMessage(messages.promptsTitle)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
