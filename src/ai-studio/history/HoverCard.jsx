import React, { cloneElement, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

const OFFSET = 14; // gap between the cursor and the card
const CARD_WIDTH = 221;
const CARD_HEIGHT = 140; // approx height of the 3-step card

// Lightweight hover/focus card that portals to <body> and appears at the
// pointer position on hover (then stays put). Used instead of Paragon's
// OverlayTrigger, whose popper anchoring is unreliable inside the scrollable
// history list.
const HoverCard = ({ children, card }) => {
  const [pos, setPos] = useState(null);

  const place = useCallback((e) => {
    // Pointer events carry coords; keyboard focus doesn't — fall back to the
    // element's right edge so it still appears for keyboard users.
    let x = e.clientX;
    let y = e.clientY;
    if (typeof x !== 'number' || (x === 0 && y === 0)) {
      const r = e.currentTarget.getBoundingClientRect();
      x = r.right - OFFSET;
      y = r.top + (r.height / 2);
    }

    let left = x + OFFSET;
    let top = y + OFFSET;
    // Keep the card inside the viewport.
    if (left + CARD_WIDTH > window.innerWidth - OFFSET) {
      left = x - OFFSET - CARD_WIDTH;
    }
    if (top + CARD_HEIGHT > window.innerHeight - OFFSET) {
      top = window.innerHeight - OFFSET - CARD_HEIGHT;
    }
    setPos({ top, left });
  }, []);

  const close = useCallback(() => setPos(null), []);

  return (
    <>
      {cloneElement(children, {
        onMouseEnter: place,
        onMouseLeave: close,
        onFocus: place,
        onBlur: close,
      })}
      {pos && createPortal(
        <div
          role="tooltip"
          className="ai-studio-history__progress-popover"
          style={{ position: 'fixed', top: pos.top, left: pos.left }}
        >
          {card}
        </div>,
        document.body,
      )}
    </>
  );
};

export default HoverCard;
