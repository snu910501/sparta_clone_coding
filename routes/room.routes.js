const express = require('express');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const authMiddleware = require("../middlewares/authMiddleware");

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

router.post('/room', authMiddleware, async (req, res) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: res.locals.user.userId,
    });
    console.log(res.locals.user.userId)
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.status(200).json({ result: true, roomId: newRoom._id })
  } catch (err) {
    console.log(err);
    throw err;
  }
});

router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      return res.redirect('/?error=존재하지 않는 방입니다.');
    }
    const { rooms } = io.of('/chat').adapter;
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      return res.redirect('/?error=허용 인원이 초과하였습니다.');
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');

    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: 123
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    console.log('hihi');
    const chat = await Chat.create({
      room: req.params.id,
      user: 123,
      chat: req.body.chat,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;