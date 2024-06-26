const express = require("express");
const router = express.Router();

const {
  getRoom,
  getChats,
  createChatRoom,
} = require("../controllers/chatController");

router.get("/admin/fetchRoomAdmin", getRoom);
router.post("/admin/createRoomAdmin", createChatRoom);
router.get("/admin/chatsAdmin/:id", getChats);

module.exports = router;
