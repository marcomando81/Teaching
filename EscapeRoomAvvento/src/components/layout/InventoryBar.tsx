import { useRef, useState } from 'react';
import { Backpack, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
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
        {/* Etichetta Zaino dell'Esploratore */}
        <div className="flex items-center gap-2.5 shrink-0 pr-3 border-r-2 border-[#F3B63A]/45">
          <div className="relative w-12 h-12 rounded-2xl bg-[#7A4A2B] border-[3px] border-[#2B170C] shadow-[0_3px_0_#24130A] flex items-center justify-center">
            <Backpack className="w-7 h-7 text-[#FFE38E]" />
            <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1 rounded-full bg-[#E04248] text-white border-2 border-[#2B170C] font-display font-bold text-sm flex items-center justify-center shadow">
              {items.length}
            </span>
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="font-display text-xl font-bold text-[#FFE38E] drop-shadow-[0_2px_0_#2B170C]">
              Zaino
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#F7DFB3]">
              Oggetti trovati
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-2 rounded-2xl bg-[#2E190E]/75 border-2 border-dashed border-[#E6B96B]/55 text-[#FFF2D4] text-base md:text-lg font-extrabold truncate">
            Lo zaino è ancora vuoto — risolvi il primo enigma per raccogliere gli indizi!
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {items.length > 5 && (
              <button
                type="button"
                onClick={() => scrollByAmount(-240)}
                className="btn-3d btn-3d-cream min-h-14 min-w-12 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Scorri zaino a sinistra"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto py-1.5 px-1 flex-1 min-w-0"
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
                    title={item.name}
                    className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] overflow-hidden shadow-[0_4px_0_#24130A] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer ${
                      isHighlighted
                        ? 'border-[#22A85A] ring-4 ring-[#4FE08A]/70 bg-[#FFF8E7]'
                        : item.isMasterGear
                        ? 'border-[#FFD859] ring-3 ring-[#F5B21B]/65 bg-[#2B190E]'
                        : 'border-[#F3B63A] bg-[#FFF8E7]'
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
                      <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#FFD859] text-[#3A2314] font-display font-bold text-base flex items-center justify-center border-2 border-[#3A2314] shadow">
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
                className="btn-3d btn-3d-cream min-h-14 min-w-12 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Scorri zaino a destra"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modale di ispezione stile "Scheda del Diario" */}
      <AnimatePresence>
        {inspectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F1B35]/75 backdrop-blur-[2px] flex items-center justify-center p-6"
            onClick={() => {
              playClick();
              setInspectedItem(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="storybook-panel w-full max-w-2xl rounded-[30px] p-6 md:p-8 flex flex-col items-center text-center gap-5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E04248] text-white border-2 border-[#3A2314] font-display font-bold text-base uppercase tracking-wide shadow-[0_3px_0_#3A2314]">
                <Sparkles className="w-4 h-4" />
                <span>{inspectedItem.isMasterGear ? 'Ingranaggio Maestro' : 'Oggetto dello Zaino'}</span>
              </div>

              <div className="w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-[#3A2314] ring-4 ring-[#F5B82E] bg-[#2B190E] overflow-hidden shadow-[0_6px_0_rgba(58,35,20,0.35)]">
                <SafeImage
                  src={inspectedItem.imagePath}
                  alt={inspectedItem.name}
                  className={`w-full h-full ${
                    inspectedItem.isMasterGear ? 'object-contain p-3' : 'object-cover'
                  }`}
                />
              </div>

              <div className="space-y-3 w-full">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#3A2314]">
                  {inspectedItem.name}
                </h2>
                <p className="storybook-subcard text-2xl md:text-3xl font-extrabold text-[#2B190E] rounded-2xl px-6 py-4 leading-snug">
                  {inspectedItem.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setInspectedItem(null);
                }}
                className="btn-3d btn-3d-gold min-h-16 px-10 rounded-2xl font-bold text-2xl flex items-center gap-3 cursor-pointer"
              >
                <X className="w-7 h-7" />
                Chiudi Scheda
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
