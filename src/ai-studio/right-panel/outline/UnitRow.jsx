import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { RiDeleteBinLine } from '@remixicon/react';
import ComponentChip from './ComponentChip';
import AddComponentMenu from './AddComponentMenu';
import InlineRename from './InlineRename';
import messages from '../../messages';
import {
  useRenameNode,
  useDeleteNode,
  useUpdateUnitPlan,
} from '../../data/apiHooks';

const UnitRow = ({
  courseCreationId,
  unitId,
  name,
  componentTypes = [],
}) => {
  const intl = useIntl();
  const rename = useRenameNode();
  const del = useDeleteNode();
  const updatePlan = useUpdateUnitPlan();

  const setTypes = (next) => {
    updatePlan.mutate({ courseCreationId, unitId, componentTypes: next });
  };

  return (
    <div className="ai-studio-outline__unit">
      <div className="ai-studio-outline__unit-header">
        <InlineRename
          as="span"
          className="ai-studio-outline__unit-title"
          value={name}
          onSave={(v) => rename.mutate({ nodeId: unitId, name: v, courseCreationId })}
        />
        <IconButton
          iconAs={RiDeleteBinLine}
          alt={intl.formatMessage(messages.deleteUnit)}
          size="sm"
          variant="ghost-secondary"
          onClick={() => del.mutate({ nodeId: unitId, courseCreationId })}
        />
      </div>
      <div className="ai-studio-outline__chips">
        {componentTypes.map((t) => (
          <ComponentChip
            key={t}
            typeId={t}
            onRemove={() => setTypes(componentTypes.filter((x) => x !== t))}
          />
        ))}
        <AddComponentMenu
          existing={componentTypes}
          onAdd={(t) => setTypes([...componentTypes, t])}
        />
      </div>
    </div>
  );
};

export default UnitRow;
