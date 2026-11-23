import type { PuzzleConfig } from '../../types/game';
import { HotspotScene } from './HotspotScene';
import { LogicBoard } from './LogicBoard';
import { CipherWheel } from './CipherWheel';
import { GridMap } from './GridMap';
import { VaultLock } from './VaultLock';

export interface PuzzleHostProps {
  config: PuzzleConfig;
  onSolve: () => void;
  onMistake: (customFeedback?: string) => void;
}

export function PuzzleHost({ config, onSolve, onMistake }: PuzzleHostProps) {
  switch (config.puzzleType) {
    case 'HotspotScene':
      return <HotspotScene config={config} onSolve={onSolve} onMistake={onMistake} />;
    case 'LogicBoard':
      return <LogicBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
    case 'CipherWheel':
      return <CipherWheel config={config} onSolve={onSolve} onMistake={onMistake} />;
    case 'GridMap':
      return <GridMap config={config} onSolve={onSolve} onMistake={onMistake} />;
    case 'VaultLock':
      return <VaultLock config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
}
