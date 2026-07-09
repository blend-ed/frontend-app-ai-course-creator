import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import messages from '../../messages';
import { useReorderNodes } from '../../data/apiHooks';

// Up/down reordering of sibling nodes. The backend reorder endpoint requires
// every id to share the same parent, so `siblingIds` must be exactly one
// level's children in their current order.
const MoveControls = ({ siblingIds, index, courseCreationId }) => {
  const intl = useIntl();
  const reorder = useReorderNodes();

  const move = (dir) => {
    const j = index + dir;
    if (j < 0 || j >= siblingIds.length) { return; }
    const ids = [...siblingIds];
    [ids[index], ids[j]] = [ids[j], ids[index]];
    reorder.mutate({ nodeIds: ids, courseCreationId });
  };

  if (siblingIds.length < 2) { return null; }

  return (
    <>
      <IconButton
        iconAs={RiArrowUpSLine}
        alt={intl.formatMessage(messages.moveUp)}
        size="sm"
        variant="ghost-secondary"
        disabled={index === 0 || reorder.isPending}
        onClick={() => move(-1)}
      />
      <IconButton
        iconAs={RiArrowDownSLine}
        alt={intl.formatMessage(messages.moveDown)}
        size="sm"
        variant="ghost-secondary"
        disabled={index === siblingIds.length - 1 || reorder.isPending}
        onClick={() => move(1)}
      />
    </>
  );
};

export default MoveControls;
