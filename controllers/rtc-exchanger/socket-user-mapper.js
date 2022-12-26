const { MapperAbstract } = require("./mapper");

class SocketUserMapper extends MapperAbstract {
  #map = {};

  map(socket, user) {
    this.#map[socket.id] = user;
  }

  unmap(socket) {
    const { [socket.id]: _, ...map } = this.#map;

    this.#map = map;
  }

  get(socket) {
    return this.#map[socket.id];
  }
}

module.exports = { SocketUserMapper };
