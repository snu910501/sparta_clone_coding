/**
 * @abstract
 */
class MapperAbstract {
  #map = {};

  map(socket, item) {}
  unmap(socket) {}
  get(socket) {}
}

module.exports = { MapperAbstract };
