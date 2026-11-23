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
          {/* Anta sinistra */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, duration: 0.35 }}
            className="relative w-1/2 h-full bg-gradient-to-r from-amber-950 via-amber-800 to-amber-600 border-r-4 border-amber-300 shadow-2xl flex items-center justify-end overflow-hidden"
          >
            {/* Rivetti decorativi */}
            <div className="absolute left-6 inset-y-8 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((r) => (
                <span
                  key={r}
                  className="w-4 h-4 rounded-full bg-amber-300 border-2 border-amber-950 shadow"
                />
              ))}
            </div>
            {/* Mezzo ingranaggio destro sul bordo interno */}
            <div className="translate-x-1/2 text-amber-200/90">
              <Cog className="w-40 h-40" strokeWidth={1.6} />
            </div>
          </motion.div>

          {/* Anta destra */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, duration: 0.35 }}
            className="relative w-1/2 h-full bg-gradient-to-l from-amber-950 via-amber-800 to-amber-600 border-l-4 border-amber-300 shadow-2xl flex items-center justify-start overflow-hidden"
          >
            {/* Rivetti decorativi */}
            <div className="absolute right-6 inset-y-8 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((r) => (
                <span
                  key={r}
                  className="w-4 h-4 rounded-full bg-amber-300 border-2 border-amber-950 shadow"
                />
              ))}
            </div>
            {/* Mezzo ingranaggio sinistro sul bordo interno */}
            <div className="-translate-x-1/2 text-amber-200/90">
              <Cog className="w-40 h-40" strokeWidth={1.6} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
