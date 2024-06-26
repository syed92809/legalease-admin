const pool = require("../database");
const socketIo = require("socket.io");

let io;

function socketServer(server) {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected", socket.id);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined Room: ${data}`);
    });

    socket.on("send_message", async (data) => {
      try {
        const getRoomId = await pool.query(
          "SELECT id FROM chat_room WHERE room_id = $1",
          [data.room]
        );

        if (getRoomId.rowCount !== 0) {
          const chat = await pool.query(
            "INSERT INTO chats (sender, message, time, chat_room_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [data.author, data.message, data.time, getRoomId.rows[0].id]
          );
          const insertedChat = await chat.rows[0];
          io.emit("receive_message", insertedChat);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("close_chat", async (data) => {
      console.log(data);
      const deleteChat = await pool.query(
        "DELETE FROM chats WHERE chat_room_id = $1",
        [data.chat_room_id]
      );
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
    });
  });
}

const createChatRoom = async (req, res) => {
  const { userId, username } = req.body;

  const getRoom = await pool.query(
    "SELECT * FROM chat_room WHERE room_id = $1",
    [userId]
  );
  if (getRoom.rowCount === 0) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const createRoom = await pool.query(
      "INSERT INTO chat_room (room_id, username, date) VALUES ($1, $2, $3)",
      [userId, username, formattedDate]
    );
    return res.status(200).json({
      success: true,
      message: "New Chat Room Created!",
      data: createRoom.rows,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Chat already exists!",
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const rooms = await pool.query(
      "WITH RankedChats AS (SELECT chat_room.room_id, chat_room.username, to_char(chats.time, 'HH12:MI am') AS time,chats.message, chats.chat_room_id,ROW_NUMBER() OVER (PARTITION BY chat_room_id ORDER BY chats.time DESC) AS rank FROM chats INNER JOIN chat_room ON chats.chat_room_id = chat_room.id) SELECT room_id, username, time, message, chat_room_id FROM RankedChats WHERE rank = 1;"
    );
    if (rooms.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No Room found!",
      });
    } else {
      //   console.log(rooms.rows);
      return res.status(200).json({
        success: true,
        rooms: rooms.rows,
      });
    }
  } catch (error) {}
};

const getChats = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const chats = await pool.query(
      "SELECT chats.message, TO_CHAR(chats.time, 'HH12:MI am') AS time, chats.sender FROM chats WHERE chats.chat_room_id = $1",
      [id]
    );

    if (chats.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No chat found!",
      });
    } else {
      return res.status(200).json({
        success: true,
        chats: chats.rows,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createChatRoom, getChats, getRoom, socketServer };
