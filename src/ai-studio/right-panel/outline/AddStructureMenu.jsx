import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { RiAddLine } from '@remixicon/react';
import messages from '../../messages';

const labelFor = (hierarchy, intl) => {
  if (hierarchy === 'section') { return intl.formatMessage(messages.addSection); }
  if (hierarchy === 'subsection') { return intl.formatMessage(messages.addSubsection); }
  if (hierarchy === 'unit') { return intl.formatMessage(messages.addUnit); }
  return 'Add';
};

const AddStructureMenu = ({ hierarchy, onAdd }) => {
  const intl = useIntl();
  return (
    <Button
      variant="tertiary"
      size="sm"
      className="ai-studio-outline__add-btn"
      onClick={() => onAdd(hierarchy)}
    >
      <RiAddLine size={14} className="mr-1" />
      {labelFor(hierarchy, intl)}
    </Button>
  );
};

export default AddStructureMenu;
