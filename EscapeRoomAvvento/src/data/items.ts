import type { InventoryItem, StationId } from '../types/game';

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'item_frammento_1',
    name: 'Frammento di Pergamena I',
    description: 'Simbolo SOLE = 4',
    imagePath: '/assets/items/item_frammento_1.webp',
    stationUnlockedAt: 1,
  },
  {
    id: 'item_frammento_2',
    name: 'Frammento di Pergamena II',
    description: 'Simbolo LUNA = 7',
    imagePath: '/assets/items/item_frammento_2.webp',
    stationUnlockedAt: 2,
  },
  {
    id: 'item_frammento_3',
    name: 'Frammento di Pergamena III',
    description: 'Simbolo STELLA = 9',
    imagePath: '/assets/items/item_frammento_3.webp',
    stationUnlockedAt: 3,
  },
  {
    id: 'gear_bronze',
    name: 'Ingranaggio Maestro di Bronzo',
    description: 'Valore inciso sul retro: 3',
    imagePath: '/assets/gears/gear_bronze.png',
    isMasterGear: true,
    gearValue: 3,
    stationUnlockedAt: 4,
  },
  {
    id: 'item_chiave_officina',
    name: "Chiave dell'Officina",
    description: "1° simbolo della Cassaforte d'Argento: CHIAVE INGLESE",
    imagePath: '/assets/items/item_chiave_officina.webp',
    stationUnlockedAt: 5,
  },
  {
    id: 'item_schema_apprendisti',
    name: 'Schema degli Apprendisti',
    description: "2° simbolo della Cassaforte d'Argento: FULMINE",
    imagePath: '/assets/items/item_schema_apprendisti.webp',
    stationUnlockedAt: 6,
  },
  {
    id: 'item_targhetta_officina',
    name: "Targhetta dell'Officina",
    description: "3° simbolo della Cassaforte d'Argento: INGRANAGGIO",
    imagePath: '/assets/items/item_targhetta_officina.webp',
    stationUnlockedAt: 7,
  },
  {
    id: 'gear_silver',
    name: "Ingranaggio Maestro d'Argento",
    description: 'Valore inciso sul retro: 6',
    imagePath: '/assets/gears/gear_silver.png',
    isMasterGear: true,
    gearValue: 6,
    stationUnlockedAt: 8,
  },
  {
    id: 'item_sigillo_archivio',
    name: "Sigillo dell'Archivio",
    description: "Orario di partenza per la Cassaforte d'Oro: 09:00",
    imagePath: '/assets/items/item_sigillo_archivio.webp',
    stationUnlockedAt: 9,
  },
  {
    id: 'item_spartito_rintocchi',
    name: 'Spartito dei Rintocchi',
    description: "Aggiungi 2 ore e 30 minuti all'orario del Sigillo",
    imagePath: '/assets/items/item_spartito_rintocchi.webp',
    stationUnlockedAt: 10,
  },
  {
    id: 'item_pagina_diario',
    name: 'Pagina del Diario',
    description: "Sottrai 15 minuti per ottenere l'ora esatta della Cassaforte d'Oro",
    imagePath: '/assets/items/item_pagina_diario.webp',
    stationUnlockedAt: 11,
  },
  {
    id: 'gear_gold',
    name: "Ingranaggio Maestro d'Oro",
    description: 'Valore inciso sul retro: 9',
    imagePath: '/assets/gears/gear_gold.png',
    isMasterGear: true,
    gearValue: 9,
    stationUnlockedAt: 12,
  },
  {
    id: 'badge_master_clockmaker',
    name: 'Medaglia di Maestro Orologiaio',
    description: 'Avete risvegliato il Grande Orologio della Torre e salvato le vacanze!',
    imagePath: '/assets/items/badge_master_clockmaker.webp',
    stationUnlockedAt: 13,
  },
];

export const ITEMS_BY_ID: Record<string, InventoryItem> = Object.fromEntries(
  INVENTORY_ITEMS.map((item) => [item.id, item])
);

export function getRewardItemForStation(stationId: StationId): InventoryItem | undefined {
  return INVENTORY_ITEMS.find((item) => item.stationUnlockedAt === stationId);
}
