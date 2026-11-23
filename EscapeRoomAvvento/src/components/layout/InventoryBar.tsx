import { useRef, useState } from 'react';
import { Backpack, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { ITEMS_BY_ID } from '../../data/items';
import type { InventoryItem } from '../../types/game';
import { SafeImage } from '../ui/SafeImage';
import { playClick } from '../../audio/soundEngine';

export interface InventoryBarProps {
  /** Se fornito, toccare un oggetto chiama questo callback (es. per la Stazione 13A) oltre o invece di ispezionarlo */
  onSelectItem?: (item: InventoryItem) => void;
  highlightedIds?: string[];
}

export function InventoryBar({ onSelectItem, highlightedIds }: InventoryBarProps) {
  const inventoryIds = useGameStore((s) => s.inventoryIds);
  const [inspectedItem, setInspectedItem] = useState<InventoryItem | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const items = inventoryIds
    .map((id) => ITEMS_BY_ID[id])
    .filter((item): item is InventoryItem => Boolean(item));

  const scrollByAmount = (delta: number) => {
    playClick();
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 shrink-0 pr-2 border-r-2 border-amber-400/40">
          <Backpack className="w-7 h-7 text-amber-300" />
          <span className="text-lg md:text-xl font-extrabold text-amber-200 hidden md:inline">
            Zaino ({items.length})
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-lg md:text-xl font-semibold text-amber-100/90 truncate">
            Nessun oggetto raccolto ancora — risolvi gli enigmi per riempire lo zaino!
          </p>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {items.length > 5 && (
              <button
                type="button"
                onClick={() => scrollByAmount(-240)}
                className="min-h-14 min-w-12 rounded-xl bg-slate-900 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center shrink-0 active:scale-95 cursor-pointer"
                aria-label="Scorri zaino a sinistra"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto py-1 px-1 flex-1 min-w-0"
            >
              {items.map((item) => {
                const isHighlighted = highlightedIds?.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      if (onSelectItem) {
                        onSelectItem(item);
                      } else {
                        setInspectedItem(item);
                      }
                    }}
                    className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 bg-slate-950 overflow-hidden shadow-lg active:scale-95 transition-transform cursor-pointer ${
                      isHighlighted
                        ? 'border-emerald-400 ring-4 ring-emerald-400/50'
                        : item.isMasterGear
                        ? 'border-amber-300 ring-2 ring-amber-400/50'
                        : 'border-amber-400'
                    }`}
                    aria-label={`Ispeziona ${item.name}`}
                  >
                    <SafeImage
                      src={item.imagePath}
                      alt={item.name}
                      className={`w-full h-full ${
                        item.isMasterGear ? 'object-contain p-1.5' : 'object-cover'
                      }`}
                    />
                    {item.isMasterGear && item.gearValue !== undefined && (
                      <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center border-2 border-slate-950">
                        {item.gearValue}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {items.length > 5 && (
              <button
                type="button"
                onClick={() => scrollByAmount(240)}
                className="min-h-14 min-w-12 rounded-xl bg-slate-900 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center shrink-0 active:scale-95 cursor-pointer"
                aria-label="Scorri zaino a destra"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modale di ispezione grande leggibile alla LIM */}
      <AnimatePresence>
        {inspectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-6"
            onClick={() => {
              playClick();
              setInspectedItem(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl bg-slate-900 border-4 border-amber-400 shadow-2xl p-6 md:p-8 flex flex-col items-center text-center gap-6"
            >
              <div className="w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden shadow-xl">
                <SafeImage
                  src={inspectedItem.imagePath}
                  alt={inspectedItem.name}
                  className={`w-full h-full ${
                    inspectedItem.isMasterGear ? 'object-contain p-3' : 'object-cover'
                  }`}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold text-amber-300">
                  {inspectedItem.name}
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-white bg-slate-950/90 border-2 border-amber-400/60 rounded-2xl px-6 py-4 leading-snug">
                  {inspectedItem.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setInspectedItem(null);
                }}
                className="min-h-16 px-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center gap-3 shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                <X className="w-7 h-7" />
                Chiudi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
