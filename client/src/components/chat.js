import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import { MdOutlineEmojiEmotions, MdCancel } from "react-icons/md";
import "./chat.css";
import ScrollToBottom from "react-scroll-to-bottom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import moment from "moment";

const socket = io.connect("http://localhost:5000");

const Chat = ({ admin_name }) => {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [roomList, setRoomList] = useState([]);
  const [chats, setChats] = useState([]);

  const chatInputRef = useRef(null);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: admin_name,
        message: message,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      await socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  const handleClick = async (id, room_id) => {
    await fetch(`http://localhost:5000/chats/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success === true) {
          setChats(json.chats);
          setRoom(room_id);
        }
      });
    if (room !== null) {
      socket.emit("join_room", room);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && message.trim() !== "") {
      const messageData = {
        room: room,
        author: admin_name,
        message: message,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      await socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => (prevMessage || "") + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevShowEmojiPicker) => !prevShowEmojiPicker);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChats((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    fetch(`http://localhost:5000/fetchRooms`)
      .then((res) => res.json())
      .then((json) => setRoomList(json.rooms));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatInputRef.current &&
        !chatInputRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = async (chat_room_id, room_id) => {
    const data = { chat_room_id, room_id };
    await socket.emit("close_chat", data);
    window.location.reload();
  };

  return (
    <>
      <div className="d-flex border border-2 mt-5">
        <div className="border" style={{ width: "200px" }}>
          {roomList ? (
            roomList.map((room) => (
              <div
                className="px-2 py-1 mx-1"
                style={{
                  borderBottom: "1px solid #F8971C",
                  cursor: "pointer",
                }}
                key={room.chat_room_id}
                onClick={() => handleClick(room.chat_room_id, room.room_id)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-1">{room.username}</h6>
                  <MdCancel
                    size={18}
                    color="#F8971C"
                    onClick={() => handleClose(room.chat_room_id, room.room_id)}
                  />
                </div>
                <p className="text-secondary mb-0 message-text">
                  {room.message}
                </p>
                <p
                  className="text-secondary mb-0 message-time"
                  style={{ textAlign: "right" }}
                >
                  {room.time}
                </p>
              </div>
            ))
          ) : (
            <p className="text-secondary text-center opacity-75 mt-2">
              No Chats
            </p>
          )}
        </div>
        <div className="w-100">
          <div
            className={chats.length > 0 && chats[0].username ? "p-2" : ""}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)" }}
          >
            <h4 className="text-center">
              {chats.length > 0 && chats[0].username ? chats[0].username : ""}
            </h4>
          </div>

          <ScrollToBottom className="chat-container">
            <div className="chat-messages">
              {chats.map((chat) => (
                <div
                  className={`message ${
                    chat.sender === admin_name ? "sender" : "receiver"
                  }`}
                >
                  <p className="message-text">{chat.message}</p>
                  <span className="message-time">
                    {moment(`1970-01-01 ${chat.time}`).format("hh:mm A")}
                  </span>
                </div>
              ))}
            </div>
          </ScrollToBottom>
          <div className="input-container">
            <div class="input-group mt-3" ref={chatInputRef}>
              <div class="input-group-text">
                <MdOutlineEmojiEmotions
                  size={24}
                  color="#404156"
                  onClick={toggleEmojiPicker}
                  style={{ cursor: "pointer" }}
                />
              </div>
              {showEmojiPicker && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "12.5%",
                    scale: "0.8",
                    left: "-3%",
                    zIndex: "999",
                  }}
                >
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
              <input
                disabled={!room}
                type="text"
                className="input-field"
                placeholder="Type your message..."
                value={message}
                onKeyDown={handleKeyDown}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                disabled={!room}
                className="btn btn-primary"
                type="submit"
                onClick={sendMessage}
              >
                <IoMdSend size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
