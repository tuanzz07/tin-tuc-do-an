'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface SourceFilterProps {
  sources: { id: string; name: string; count: number }[];
  selectedSource: string | null;
  onSelectSource: (sourceId: string | null) => void;
}

export const SourceFilter: React.FC<SourceFilterProps> = ({
  sources,
  selectedSource,
  onSelectSource
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Filter className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Nguồn:</span>
      </div>

      <select
        value={selectedSource || ''}
        onChange={(e) => onSelectSource(e.target.value ? e.target.value : null)}
        className="text-xs bg-card border border-border/80 rounded-xl px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
      >
        <option value="">Tất cả nguồn ({sources.reduce((acc, cur) => acc + cur.count, 0)})</option>
        {sources.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.count})
          </option>
        ))}
      </select>
    </div>
  );
};
