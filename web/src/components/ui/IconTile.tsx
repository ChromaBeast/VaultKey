import React from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'blue' | 'violet' | 'cyan' | 'fuchsia' | 'green' | 'amber' | 'red' | 'rose';
export type TileSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASS: Record<TileSize, string> = { sm: 'vk-icon-sm', md: 'vk-icon-md', lg: 'vk-icon-lg', xl: 'vk-icon-xl' };

interface IconTileProps {
  children: React.ReactNode;
  tone?: Tone;
  size?: TileSize;
  /** Draw a tinted rounded square behind the icon. Use sparingly. */
  boxed?: boolean;
  className?: string;
}

/** A single tone-coloured icon. Bare by default; pass `boxed` for a tinted container. */
export const IconTile: React.FC<IconTileProps> = ({ children, tone = 'blue', size = 'md', boxed = false, className }) => (
  <span aria-hidden="true" className={cn('vk-icon', boxed && 'vk-tile', `tone-${tone}`, SIZE_CLASS[size], className)}>
    {children}
  </span>
);
