import { AnimatePresence, motion } from 'motion/react';
import { Cog } from 'lucide-react';

export interface BrassDoorTransitionProps {
  isClosed: boolean;
}

export function BrassDoorTransition({ isClosed }: BrassDoorTransitionProps) {
  return (
    <AnimatePresence>
      {isClosed && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 pointer-events-none flex overflow-hidden"
        >
          {/* Anta sinistra in legno caldo e ottone */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, duration: 0.35 }}
            className="relative w-1/2 h-full bg-gradient-to-r from-[#4A2B18] via-[#6D4124] to-[#B47028] border-r-[5px] border-[#FFD859] shadow-2xl flex items-center justify-end overflow-hidden"
          >
            {/* Cornice decorativa interna */}
            <div className="absolute inset-y-8 left-14 right-8 rounded-2xl border-4 border-[#F3B63A]/45 pointer-events-none" />
            {/* Borchie dorate */}
            <div className="absolute left-6 inset-y-10 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((r) => (
                <span
                  key={r}
                  className="w-5 h-5 rounded-full bg-[#FFD859] border-[3px] border-[#3A2314] shadow"
                />
              ))}
            </div>
            {/* Mezzo ingranaggio destro sul bordo interno */}
            <div className="translate-x-1/2 text-[#FFE596] drop-shadow-[0_4px_0_#3A2314]">
              <Cog className="w-44 h-44" strokeWidth={1.8} />
            </div>
          </motion.div>

          {/* Anta destra in legno caldo e ottone */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, duration: 0.35 }}
            className="relative w-1/2 h-full bg-gradient-to-l from-[#4A2B18] via-[#6D4124] to-[#B47028] border-l-[5px] border-[#FFD859] shadow-2xl flex items-center justify-start overflow-hidden"
          >
            {/* Cornice decorativa interna */}
            <div className="absolute inset-y-8 left-8 right-14 rounded-2xl border-4 border-[#F3B63A]/45 pointer-events-none" />
            {/* Borchie dorate */}
            <div className="absolute right-6 inset-y-10 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((r) => (
                <span
                  key={r}
                  className="w-5 h-5 rounded-full bg-[#FFD859] border-[3px] border-[#3A2314] shadow"
                />
              ))}
            </div>
            {/* Mezzo ingranaggio sinistro sul bordo interno */}
            <div className="-translate-x-1/2 text-[#FFE596] drop-shadow-[0_4px_0_#3A2314]">
              <Cog className="w-44 h-44" strokeWidth={1.8} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
