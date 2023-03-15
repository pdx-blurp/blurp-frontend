export class NodeData {
  constructor(name, years, notes, type, size, id) {
    this.name = name;
    this.years = years;
    this.notes = notes;
    this.type = type;
    this.size = size;
    this.id = id;

    this.display = this.display.bind(this);
  }

  display() {
    console.log('Node data: ');
    console.log('id: ' + this.id);
    console.log('name: ' + this.name);
    console.log('years: ' + this.years);
    console.log('notes: ' + this.notes);
    console.log('size: ' + this.size);
    console.log('type: ' + this.type);
  }
}

export class EdgeData {
  constructor(category, familiarity, stressCode, node1ID, node2ID, id) {
    this.category = category;
    this.familiarity = familiarity;
    this.stressCode = stressCode;
    this.node1ID = node1ID;
    this.node2ID = node2ID;
    this.id = id;
  }

  display() {
    console.log('Edge data: ');
    console.log('id: ' + this.id);
    console.log('category: ' + this.category);
    console.log('familiarity: ' + this.familiarity);
    console.log('stressCode: ' + this.stressCode);
    console.log('node1ID: ' + this.node1ID);
    console.log('node2ID: ' + this.node2ID);
  }
}
