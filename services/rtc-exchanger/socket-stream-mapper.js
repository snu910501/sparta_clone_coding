const { MapperAbstract } = require("./mapper");

class SocketStreamMapper extends MapperAbstract {
  constructor() {
    super();

    this.getAllStreamIds = this.getAllStreamIds.bind(this);
  }

  getAllStreamIds(channelName) {
    return Object.entries(this.mappings)
      .filter(([, value]) => value === channelName)
      .map(([key]) => key);
  }
}

module.exports = { SocketStreamMapper };
