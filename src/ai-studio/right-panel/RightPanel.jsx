import React from 'react';
import CourseBriefPanel from './brief/CourseBriefPanel';
import OutlinePanel from './outline/OutlinePanel';
import ScriptsPanel from './scripts/ScriptsPanel';

const RightPanel = ({
  mode,
  courseCreationId,
  metadataSummary,
  activeSlotKey,
  onScriptsReady,
}) => {
  if (mode === 'brief') {
    return (
      <CourseBriefPanel
        metadataSummary={metadataSummary}
        activeSlotKey={activeSlotKey}
        courseCreationId={courseCreationId}
      />
    );
  }

  if (mode === 'outline') {
    return (
      <OutlinePanel
        courseCreationId={courseCreationId}
        onScriptsReady={onScriptsReady}
      />
    );
  }

  if (mode === 'scripts') {
    return <ScriptsPanel courseCreationId={courseCreationId} />;
  }

  return null;
};

export default RightPanel;
