import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { RiDeleteBinLine } from '@remixicon/react';
import InlineRename from './InlineRename';
import UnitRow from './UnitRow';
import AddStructureMenu from './AddStructureMenu';
import messages from '../../messages';
import {
  useRenameNode,
  useDeleteNode,
  useAddStructureNode,
} from '../../data/apiHooks';

// Subsection wraps its units inside `.ai-studio-outline__units-wrapper` so
// the vertical divider + L-shape connectors can be drawn with CSS pseudo-
// elements anchored to that wrapper (see OutlinePanel.scss).
const Subsection = ({ node, courseCreationId, planByUnit }) => {
  const intl = useIntl();
  const rename = useRenameNode();
  const del = useDeleteNode();
  const add = useAddStructureNode();

  return (
    <div className="ai-studio-outline__subsection">
      <div className="ai-studio-outline__row">
        <InlineRename
          as="h5"
          className="ai-studio-outline__subsection-title"
          value={node.name}
          onSave={(v) => rename.mutate({ nodeId: node.id, name: v, courseCreationId })}
        />
        <IconButton
          iconAs={RiDeleteBinLine}
          alt={intl.formatMessage(messages.deleteSubsection)}
          size="sm"
          variant="ghost-secondary"
          onClick={() => del.mutate({ nodeId: node.id, courseCreationId })}
        />
      </div>
      <div className="ai-studio-outline__units-wrapper">
        {(node.children || []).map((unit) => (
          <UnitRow
            key={unit.id}
            courseCreationId={courseCreationId}
            unitId={unit.id}
            name={unit.name}
            componentTypes={planByUnit[unit.id] || []}
          />
        ))}
        <div className="ai-studio-outline__unit-add">
          <AddStructureMenu
            hierarchy="unit"
            onAdd={() => add.mutate({
              courseCreationId,
              parentId: node.id,
              hierarchy: 'unit',
              name: 'New Unit',
            })}
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({ node, courseCreationId, planByUnit }) => {
  const intl = useIntl();
  const rename = useRenameNode();
  const del = useDeleteNode();
  const add = useAddStructureNode();

  return (
    <section className="ai-studio-outline__section">
      <div className="ai-studio-outline__section-header">
        <InlineRename
          as="h4"
          className="ai-studio-outline__section-title"
          value={node.name}
          onSave={(v) => rename.mutate({ nodeId: node.id, name: v, courseCreationId })}
        />
        <IconButton
          iconAs={RiDeleteBinLine}
          alt={intl.formatMessage(messages.deleteSection)}
          size="sm"
          variant="ghost-secondary"
          onClick={() => del.mutate({ nodeId: node.id, courseCreationId })}
        />
      </div>
      <div className="ai-studio-outline__subsections-wrapper">
        {(node.children || []).map((sub) => (
          <Subsection
            key={sub.id}
            node={sub}
            courseCreationId={courseCreationId}
            planByUnit={planByUnit}
          />
        ))}
        <div className="ai-studio-outline__subsection-add">
          <AddStructureMenu
            hierarchy="subsection"
            onAdd={() => add.mutate({
              courseCreationId,
              parentId: node.id,
              hierarchy: 'subsection',
              name: 'New Subsection',
            })}
          />
        </div>
      </div>
    </section>
  );
};

const StructureTree = ({
  structure = [],
  courseCreationId,
  planByUnit = {},
}) => {
  const add = useAddStructureNode();
  return (
    <div className="ai-studio-outline__tree">
      {structure.map((section) => (
        <Section
          key={section.id}
          node={section}
          courseCreationId={courseCreationId}
          planByUnit={planByUnit}
        />
      ))}
      <div className="ai-studio-outline__section-add">
        <AddStructureMenu
          hierarchy="section"
          onAdd={() => add.mutate({
            courseCreationId,
            parentId: null,
            hierarchy: 'section',
            name: 'New Section',
          })}
        />
      </div>
    </div>
  );
};

export default StructureTree;
