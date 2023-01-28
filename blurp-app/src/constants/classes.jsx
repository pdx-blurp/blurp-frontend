export class NodeData {
  constructor(name, years, notes, type, id) {
    this.name = name;
    this.years = years;
    this.notes = notes;
    this.type = type;
    this.id = id;

    this.display = this.display.bind(this);
  }

  setData(name, years, notes, type, id) {
    this.name = name;
    this.years = years;
    this.notes = notes;
    this.type = type;
    this.id = id;
  }

  display() {
    console.log('data: ');
    console.log('id: ' + this.id);
    console.log('name: ' + this.name);
    console.log('years: ' + this.years);
    console.log('notes: ' + this.notes);
    console.log('type: ' + this.type);
  }
}

export class EdgeData {
  constructor() {
    this.category = Relationships.situational;
    this.familiarity = 0;
    this.stressCode = 0;
    this.node1ID = 0;
    this.node2ID = 0;
  }
  setData(category, familiarity, stressCode, node1ID, node2ID) {
    this.category = category;
    this.familiarity = familiarity;
    this.stressCode = stressCode;
    this.node1ID = node1ID;
    this.node2ID = node2ID;
  }
}
