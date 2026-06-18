import React, { useEffect, useRef } from 'react';
import { Alert } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useMessages, useSendChat } from '../data/apiHooks';
import { getAiErrorMessage } from '../../generic/aiErrorMessage';
import messages from '../messages';
import ChatMessage from './ChatMessage';
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

  return (
    <div className="ai-studio-chat">
      <div ref={scrollRef} className="ai-studio-chat__log">
        <div className="ai-studio-chat__log-inner">
          {chatMessages.map((m) => {
            if (m.role === 'user') {
              return (
                <ChatMessage
                  key={m.id}
                  role="user"
                  text={m.content}
                  files={extractUserAttachments(m.toolCalls)}
                />
              );
            }
            if (m.role === 'assistant') {
              const parsed = parseAssistant(m.content);
              return <ChatMessage key={m.id} role="assistant" text={parsed.message} />;
            }
            return null;
          })}
          {isPending && <TypingIndicator />}
          {!isPending && error && (
            <Alert variant="danger" icon={ErrorIcon} className="ai-studio-chat__error">
              {getAiErrorMessage(error, intl.formatMessage(messages.chatErrorFallback))}
            </Alert>
          )}
        </div>
      </div>
      <div className="ai-studio-chat__dock">
        {latestOptions && !isPending && (
          <OptionsCard
            options={latestOptions}
            onSelect={handleOptionSelect}
            onSpecifyOther={() => composerRef?.current?.focus()}
          />
        )}
        <Composer
          ref={composerRef}
          onSend={handleSend}
          disabled={isPending}
        />
      </div>
    </div>
  );
};

export default ChatColumn;
