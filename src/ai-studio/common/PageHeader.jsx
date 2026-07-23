import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@openedx/paragon';
import { RiArrowLeftLine } from '@remixicon/react';

import './PageHeader.scss';

/**
 * Shared page shell header for the AI Studio sub-pages.
 *
 * Layout-agnostic: it renders only the optional "back" button + the title
 * block, so each page keeps its own Container/width. Standardises the compact
 * title/subtitle treatment across audit, prompts and history.
 */
const PageHeader = ({
  title, subtitle = null, backTo = null, backLabel = null, actions = null,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {backTo && (
        <Button
          variant="tertiary"
          size="sm"
          className="ai-studio-pageheader__back mb-3"
          iconBefore={RiArrowLeftLine}
          onClick={() => navigate(backTo)}
        >
          {backLabel}
        </Button>
      )}

      <header className="ai-studio-pageheader">
        <div className="ai-studio-pageheader__text">
          <h1 className="ai-studio-pageheader__title">{title}</h1>
          {subtitle && <p className="ai-studio-pageheader__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="ai-studio-pageheader__actions">{actions}</div>}
      </header>
    </>
  );
};

export default PageHeader;
