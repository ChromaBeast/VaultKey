import React from 'react';

export const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr className="skel-row">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i}>
        <span className="skel-block" style={{ width: i % 3 === 0 ? '68%' : '42%' }} />
      </td>
    ))}
  </tr>
);

export const TableSkeleton: React.FC<{ rows?: number; cols: number }> = ({ rows = 5, cols }) => (
  <>
    {Array.from({ length: rows }).map((_, r) => (
      <SkeletonRow key={r} cols={cols} />
    ))}
  </>
);
