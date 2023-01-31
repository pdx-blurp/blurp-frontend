export enum COLORS {
  RED = '#FF0000',
  BLUE = '#0000FF',
  GREEN = '#00FF00',
}

export enum NODE_TYPE {
  PERSON = 'PERSON',
  PLACE = 'PLACE',
  IDEA = 'IDEA',
}

export enum sidebarState {
  closed = 'closed',
  expanded = 'expanded',
}

export enum sidebarView {
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

/* 
  graphData and Relationships were both made according 
  to the data objects/map architecture docs
*/
export enum Relationships {
  familial = 'familial',
  friendship = 'friendship',
  acquaintance = 'acquaintance',
  romantic = 'romantic',
  work = 'work',
  situational = 'situational',
}
