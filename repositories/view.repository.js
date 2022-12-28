const { View, Post } = require("../models/");
const { Sequelize, Op } = require("sequelize");

class ViewRepository {
  findView = async (address, postId) => {
    try {
      const viewed = await View.findOne({
        where: {
          [Op.and]: [{ address: address }, { postId: postId }],
        },
        attributes: ["createdAt"],
        order: [["createdAt", "DESC"]],
        raw: true,
      });
      return viewed;
    } catch (err) {
      throw err;
    }
  };

  addView = async (address, postId) => {
    try {
      const view = await View.create({ address, postId });
      return view;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ViewRepository;
