export class NodeData {
  constructor(name, years, notes, type) {
    this.name = name;
    this.years = years;
    this.notes = notes;
    this.type = type;
    this.display = this.display.bind(this);
  }

  setData(name, years, notes, type) {
    this.name = name;
    this.years = years;
    this.notes = notes;
    this.type = type;
  }

  display() {
    console.log('data: ');
    console.log('name: ' + this.name);
    console.log('years: ' + this.years);
    console.log('notes: ' + this.notes);
    console.log('type: ' + this.type);
  }

  getData() {
    return [this.name, this.years, this.notes, this.type];
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

  getData() {
    return [this.category, this.familiarity, this.stressCode, this.node1ID, this.node2ID];
  }
}
