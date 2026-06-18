import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@openedx/paragon';
import { RiAddLine } from '@remixicon/react';
import { COMPONENT_TYPES } from '../../data/constants';

const AddComponentMenu = ({ existing = [], onAdd }) => {
  const intl = useIntl();
  const available = COMPONENT_TYPES.filter((c) => !existing.includes(c.id));
  if (available.length === 0) { return null; }

  return (
    <Dropdown>
      <Dropdown.Toggle
        id="add-component-toggle"
        variant="tertiary"
        size="sm"
        className="ai-studio-add-component"
      >
        <RiAddLine size={16} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="ai-studio-menu">
        {available.map((c) => {
          const Icon = c.icon;
          return (
            <Dropdown.Item key={c.id} onClick={() => onAdd(c.id)}>
              <Icon size={14} className="mr-2" />
              {intl.formatMessage(c.label)}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AddComponentMenu;
