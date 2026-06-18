import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Spinner } from '@openedx/paragon';
import messages from '../messages';

const PHRASES = [
  'Brewing your curriculum…',
  'Outlining lessons…',
  'Polishing pedagogy…',
  'Drafting objectives…',
  'Shaping the syllabus…',
  'Mapping the journey…',
  'Piecing together sections…',
  'Composing chapters…',
  'Stitching ideas…',
  'Tuning the tone…',
  'Mulling over modules…',
  'Orchestrating units…',
  'Sharpening the outline…',
  'Bundling components…',
  'Distilling objectives…',
  'Mixing content types…',
  'Designing the arc…',
  'Iterating on titles…',
  'Arranging subsections…',
  'Sculpting the course…',
  'Priming the pedagogy…',
  'Weighing the structure…',
  'Chiseling the content…',
  'Gathering inspiration…',
];

const pickRandomIndex = () => Math.floor(Math.random() * PHRASES.length);

const TypingIndicator = () => {
  const intl = useIntl();
  const [idx, setIdx] = useState(pickRandomIndex);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => {
        let next = pickRandomIndex();
        if (next === prev) { next = (prev + 1) % PHRASES.length; }
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ai-studio-msg ai-studio-msg--assistant">
      <div className="ai-studio-msg__bubble d-inline-flex align-items-center">
        <Spinner
          animation="border"
          size="sm"
          className="mr-2"
          screenReaderText={intl.formatMessage(messages.typingIndicator)}
        />
        <span>{PHRASES[idx]}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
