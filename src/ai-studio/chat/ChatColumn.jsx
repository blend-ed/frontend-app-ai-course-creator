import React, { useEffect, useRef } from 'react';
import { Alert } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useMessages, useSendChat } from '../data/apiHooks';
import { getAiErrorMessage } from '../../generic/aiErrorMessage';
import messages from '../messages';
import ChatMessage from './ChatMessage';
import MetadataSummaryCard from './MetadataSummaryCard';
import OptionsCard from './OptionsCard';
import TypingIndicator from './TypingIndicator';
import Composer from './Composer';
import './ChatColumn.scss';

const parseAssistant = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
};

// Build an {id: label} lookup from a parsed assistant message's options, so a
// user's reply (stored as raw option ids like "problem_first") can be shown
// with its friendly label ("Problem First").
const optionLabelMap = (parsed) => {
  const map = {};
  const choices = parsed?.options?.choices;
  if (Array.isArray(choices)) {
    choices.forEach((c) => {
      if (c?.id != null) { map[String(c.id)] = c.label || String(c.id); }
    });
  }
  return map;
};

// Replace a comma-joined list of option ids with their labels. Only transforms
// when EVERY part matches an option id, so free-text answers pass through
// untouched.
const humanizeSelection = (content, labelMap) => {
  if (!content || !labelMap) { return content; }
  const parts = content.split(',').map((s) => s.trim());
  const mapped = parts.map((p) => labelMap[p]);
  return mapped.every((m) => m != null) ? mapped.join(', ') : content;
};

const extractUserAttachments = (toolCalls) => {
  if (!Array.isArray(toolCalls)) { return []; }
  const attached = toolCalls
    .flatMap((tc) => {
      if (tc?.args?.files && Array.isArray(tc.args.files)) { return tc.args.files; }
      if (tc?.args?.attached_files && Array.isArray(tc.args.attached_files)) {
        return tc.args.attached_files;
      }
      return [];
    })
    .filter(Boolean);
  return attached;
};

const ChatColumn = ({ courseCreationId, latestOptions, composerRef }) => {
  const intl = useIntl();
  const { data: chatMessages = [] } = useMessages(courseCreationId);
  const {
    mutate: sendChat, isPending, error, reset,
  } = useSendChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [chatMessages.length, isPending, error]);

  const handleSend = ({ message, files }) => {
    if (error) { reset(); }
    sendChat({ message, courseCreationId, files });
  };

  const handleOptionSelect = (choiceIds) => {
    const values = choiceIds.join(', ');
    handleSend({ message: values, files: [] });
  };

  const optionsActive = latestOptions && !isPending;
  const choiceIds = (latestOptions?.choices || []).map((c) => String(c.id));
  // Closed-choice questionnaires the user answers purely by tapping: the
  // multi-select content/assessment cards, and the single-select theme/style
  // card (choices `default` / `modern`). For these the free-text composer is
  // redundant, so hide it. Other single-select cards keep the composer, since
  // some offer a "specify other" free-text path and sizing accepts typed counts.
  const isMultiCard = latestOptions?.type === 'multi' && choiceIds.length > 0;
  const isStyleCard = choiceIds.length > 0
    && choiceIds.every((id) => id === 'default' || id === 'modern');
  const hideComposer = Boolean(optionsActive && (isMultiCard || isStyleCard));

  return (
    <div className="ai-studio-chat">
      <div ref={scrollRef} className="ai-studio-chat__log">
        <div className="ai-studio-chat__log-inner">
          {(() => {
            // Track the most recent assistant question's option labels so the
            // following user reply renders friendly labels instead of raw ids.
            let lastLabelMap = {};
            return chatMessages.map((m) => {
              if (m.role === 'user') {
                return (
                  <ChatMessage
                    key={m.id}
                    role="user"
                    text={humanizeSelection(m.content, lastLabelMap)}
                    files={extractUserAttachments(m.toolCalls)}
                  />
                );
              }
              if (m.role === 'assistant') {
                const parsed = parseAssistant(m.content);
                lastLabelMap = optionLabelMap(parsed);
                return (
                  <React.Fragment key={m.id}>
                    <ChatMessage role="assistant" text={parsed.message} />
                    <MetadataSummaryCard summary={parsed.metadata_summary} />
                  </React.Fragment>
                );
              }
              return null;
            });
          })()}
          {isPending && <TypingIndicator />}
          {!isPending && error && (
            <Alert variant="danger" icon={ErrorIcon} className="ai-studio-chat__error">
              {getAiErrorMessage(error, intl.formatMessage(messages.chatErrorFallback))}
            </Alert>
          )}
        </div>
      </div>
      <div className="ai-studio-chat__dock">
        {optionsActive && (
          <OptionsCard
            options={latestOptions}
            onSelect={handleOptionSelect}
            onSpecifyOther={() => composerRef?.current?.focus()}
          />
        )}
        {!hideComposer && (
          <Composer
            ref={composerRef}
            onSend={handleSend}
            disabled={isPending}
          />
        )}
      </div>
    </div>
  );
};

export default ChatColumn;
