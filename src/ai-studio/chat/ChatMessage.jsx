import React from 'react';
import { RiFileTextLine } from '@remixicon/react';
import './ChatMessage.scss';

const ChatMessage = ({ role, text, files }) => {
  const hasAttachments = files?.length > 0;

  if (role === 'user') {
    return (
      <div className="ai-studio-msg ai-studio-msg--user">
        <div className="ai-studio-msg__content">
          {hasAttachments && (
            <div className="ai-studio-msg__attachments">
              {files.map((f) => (
                <span key={f.name} className="ai-studio-msg__file">
                  <RiFileTextLine size={16} className="ai-studio-msg__file-icon" />
                  <span className="ai-studio-msg__file-name">{f.name}</span>
                </span>
              ))}
            </div>
          )}
          {text && <div className="ai-studio-msg__text">{text}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="ai-studio-msg ai-studio-msg--assistant">
      {text && <div className="ai-studio-msg__text">{text}</div>}
    </div>
  );
};

export default ChatMessage;
