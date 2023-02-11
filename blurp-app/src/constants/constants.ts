export enum COLORS {
  // node colors
  BROWN = '#836953',
  GREY = '#848482',
  OLIVE = '#665D1E',
  // stress level colors
  RED = '#C41E3A',
  ORANGE = '#FF6700',
  YELLOW = '#FFCC00',
  GREEN = '#008000',
  BLUE = '#446CCF',
}

export enum NODE_TYPE {
  PERSON = 'PERSON',
  PLACE = 'PLACE',
  IDEA = 'IDEA',
}

export enum SIDEBAR_STATE {
  closed = 'closed',
  expanded = 'expanded',
}

export enum SIDEBAR_VIEW {
  closed = 'closed',
  none = 'none',
  person = 'person',
  place = 'place',
  idea = 'idea',
  edge = 'edge',
}

export enum MAP_TOOLS {
  node = 'node',
  edge = 'edge',
  select = 'select',
  eraser = 'eraser',
}

export enum SIGMA_CURSOR {
  DEFAULT = 'cursor-default',
  NODE = 'cursor-node',
  EDGE = 'cursor-edge',
  ERASER = 'cursor-eraser',
}

/* 
  graphData and Relationships were both made according 
  to the data objects/map architecture docs
*/
export enum RELATIONSHIPS {
  familial = 'familial',
  friendship = 'friendship',
  acquaintance = 'acquaintance',
  romantic = 'romantic',
  work = 'work',
  situational = 'situational',
}

/* 
Decided to use ints here as the data object doc specifies that the stress code is stored in an int
*/
export enum STRESS_CODE {
  VERY_HIGH = 5,
  HIGH = 4,
  MEDIUM = 3,
  LOW = 2,
  MINIMAL = 1,
}
