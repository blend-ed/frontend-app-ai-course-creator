import React from 'react';

const BriefGroup = ({ title, children }) => (
  <div className="ai-studio-brief__group">
    <h5 className="ai-studio-brief__group-title">{title}</h5>
    <div className="ai-studio-brief__group-body">{children}</div>
  </div>
);

export default BriefGroup;
