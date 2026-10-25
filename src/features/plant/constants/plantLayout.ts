export const PLANT_NODE_LAYOUT = {
  corpServer: { x: 70, y: 78 },
  remoteAccess: { x: 300, y: 78 },
  industrialDmz: { x: 435, y: 78 },
  scadaCore: { x: 700, y: 78 },
  hmiStation: { x: 530, y: 190 },
  safetySis: { x: 700, y: 190 },
  plcController: { x: 530, y: 310 },
} as const

export const PLANT_CONNECTION_PATHS = {
  firewall: ['M125 115 H290 M350 115 H450 M515 115 H710', 'M450 115 V225 H590'],
  plc: ['M590 225 H710 M590 225 V345 H710'],
  sis: ['M590 225 V130 H710'],
} as const

export const PLANT_CONNECTIONS = [
  { key: 'firewall', paths: PLANT_CONNECTION_PATHS.firewall },
  { key: 'plc', paths: PLANT_CONNECTION_PATHS.plc },
  { key: 'sis', paths: PLANT_CONNECTION_PATHS.sis },
] as const

export const PLANT_GRID = {
  columns: 18,
  rows: 10,
  columnSize: 50,
  rowSize: 50,
  width: 900,
  height: 445,
} as const

export const PLANT_VIEWBOX = '0 0 900 445'
