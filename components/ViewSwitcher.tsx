'use client';

import React from 'react';
import { LayoutGrid, Newspaper, List } from 'lucide-react';

export type ViewMode = 'grid' | 'magazine' | 'compact';

interface ViewSwitcherProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center p-1 bg-muted/60 rounded-xl border border-border/60">
      <button
        onClick={() => onChange('grid')}
        title="Dạng thẻ lưới (Grid)"
        className={`p-1.5 rounded-lg transition-colors ${
          mode === 'grid'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => onChange('magazine')}
        title="Dạng tạp chí chi tiết (Magazine)"
        className={`p-1.5 rounded-lg transition-colors ${
          mode === 'magazine'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Newspaper className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => onChange('compact')}
        title="Dạng danh sách gọn (Compact)"
        className={`p-1.5 rounded-lg transition-colors ${
          mode === 'compact'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <List className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
