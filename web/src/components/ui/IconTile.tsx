import React from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'blue' | 'violet' | 'cyan' | 'fuchsia' | 'green' | 'amber' | 'red' | 'rose';
export type TileSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASS: Record<TileSize, string> = { sm: 'vk-tile-sm', md: '', lg: 'vk-tile-lg', xl: 'vk-tile-xl' };

interface IconTileProps {
  children: React.ReactNode;
  tone?: Tone;
  size?: TileSize;
  className?: string;
}

/** Rounded square with a tinted background and border; holds a single icon. */
export const IconTile: React.FC<IconTileProps> = ({ children, tone = 'blue', size = 'md', className }) => (
  <span aria-hidden="true" className={cn('vk-tile', `tone-${tone}`, SIZE_CLASS[size], className)}>
    {children}
  </span>
);
