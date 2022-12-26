/**
 * @abstract
 */
class MapperAbstract {
  mappings = {};

  constructor() {
    this.map = this.map.bind(this);
    this.unmap = this.unmap.bind(this);
    this.get = this.get.bind(this);
  }

  map(socket, item) {
    this.mappings[socket.id] = item;
  }

  unmap(socket) {
    const { [socket.id]: _, ...mappings } = this.mappings;

    this.mappings = mappings;
  }

  get(socket) {
    return this.mappings[socket.id];
  }
}

module.exports = { MapperAbstract };
