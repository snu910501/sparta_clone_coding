const { MapperAbstract } = require("./mapper");

class SocketStreamMapper extends MapperAbstract {
  #map = {};

  map(socket, channelName) {
    this.#map[socket.id] = channelName;
  }

  unmap(socket) {
    const { [socket.id]: _, ...map } = this.#map;

    this.#map = map;
  }

  get(socket) {
    return this.#map[socket.id];
  }

  getAllStreamIds(channelName) {
    return Object.entries(this.#map)
      .filter(([, value]) => value === channelName)
      .map(([key]) => key);
  }
}

module.exports = { SocketStreamMapper };
