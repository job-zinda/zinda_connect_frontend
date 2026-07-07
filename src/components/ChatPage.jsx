import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  IoSend,
  IoMic,
  IoImage,
  IoHappy,
  IoTrashOutline,
  IoEllipsisVertical,
  IoArrowUndo,
} from "react-icons/io5";
import { FaArrowLeft, FaBan, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import "../styles/chat.css";
import { API_BASE_URL } from "../apis/Api";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room_id");

  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollPositions, setScrollPositions] = useState({});
  const [isBlockedUser, setIsBlockedUser] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastAppliedRoomIdRef = useRef(null);

  const navigate = useNavigate();
  const currentUserId = Number(localStorage.getItem("user_id"));
  const token = localStorage.getItem("access");

  const getDisplayName = (user) => {
    if (!user) return "User";
    const first = user.first_name || user.name || user.firstname || "";
    const last = user.last_name || user.lastname || "";
    const full =
      user.full_name ||
      user.fullname ||
      user.child_name ||
      user.display_name ||
      user.name ||
      `${first} ${last}`.trim() ||
      user.username ||
      "";
    if (!full || full === " ") return user.username || user.email || "User";
    if (String(full).includes("@")) {
      return user.username || user.full_name || user.child_name || "User";
    }
    return full;
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/50";
    return path.startsWith("http")? path : `${API_BASE_URL}${path}`;
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    fetchChatRooms();
    const interval = setInterval(fetchChatRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!roomId || chatRooms.length === 0) return;

    const nextRoomId = Number(roomId);
    if (Number.isNaN(nextRoomId)) return;
    if (lastAppliedRoomIdRef.current === nextRoomId) return;

    const room = chatRooms.find((r) => r.id === nextRoomId);
    if (room) {
      setSelectedRoom(room);
      lastAppliedRoomIdRef.current = nextRoomId;
    }
  }, [roomId, chatRooms.length]);

  useEffect(() => {
    if (selectedRoom?.id) {
      const savedScrollTop = scrollPositions[selectedRoom.id];
      fetchMessages(selectedRoom.id, savedScrollTop === undefined? "bottom" : "restore");

      const interval = setInterval(() => {
        fetchMessages(selectedRoom.id, "none");
        fetchChatRooms();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedRoom?.id]);

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedMsg(null);
      setMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const refreshBlockedState = async () => {
      if (!selectedRoom?.other_user?.id) {
        setIsBlockedUser(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/block-user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const blockedUsers = res.data || [];
        const blocked = blockedUsers.some(
          (entry) => Number(entry.blocked_user_id) === Number(selectedRoom.other_user.id)
        );
        setIsBlockedUser(blocked);
      } catch (err) {
        console.error("Failed to load blocked users", err);
        setIsBlockedUser(false);
      }
    };

    refreshBlockedState();
  }, [selectedRoom?.other_user?.id, token]);

  const fetchChatRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/chat-rooms/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatRooms(res.data || []);

      if (selectedRoom) {
        const updatedRoom = res.data.find((r) => r.id === selectedRoom.id);
        if (updatedRoom) {
          const hasChanged = JSON.stringify(updatedRoom)!== JSON.stringify(selectedRoom);
          if (hasChanged) {
            setSelectedRoom((prev) =>
              prev?.id === updatedRoom.id? {...prev,...updatedRoom } : prev
            );
          }
        }
      }
    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id, scrollMode = "none") => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/chat/${id}/messages/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data || []);

      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        if (scrollMode === "bottom") {
          container.scrollTop = container.scrollHeight;
        } else if (scrollMode === "restore") {
          const savedScrollTop = scrollPositions[id];
          if (savedScrollTop!== undefined) {
            container.scrollTop = savedScrollTop;
          } else {
            container.scrollTop = container.scrollHeight;
          }
        }
      });
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleRoomClick = (room) => {
    if (messagesContainerRef.current && selectedRoom?.id) {
      setScrollPositions((prev) => ({
       ...prev,
        [selectedRoom.id]: messagesContainerRef.current.scrollTop,
      }));
    }

    setSelectedRoom(room);
    lastAppliedRoomIdRef.current = room.id;
    setAutoScroll(true);
    // FIX: replace:true use cheyth history push cheyyathaakki
    navigate(`/chat?room_id=${room.id}`, { replace: true });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() ||!selectedRoom) return;

    try {
      const payload = {
        room_id: selectedRoom.id,
        text: newMessage,
      };

      if (replyTo) payload.reply_to = replyTo.id;

      await axios.post(`${API_BASE_URL}/api/auth/chat/send-message/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewMessage("");
      setShowEmoji(false);
      setReplyTo(null);
      setAutoScroll(true);
      fetchMessages(selectedRoom.id, "bottom");
      fetchChatRooms();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send message");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file ||!selectedRoom) return;

    const formData = new FormData();
    formData.append("room_id", selectedRoom.id);
    formData.append("image", file);

    if (replyTo) formData.append("reply_to", replyTo.id);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/chat/send-image/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setReplyTo(null);
      setAutoScroll(true);
      fetchMessages(selectedRoom.id, "bottom");
      fetchChatRooms();
    } catch (err) {
      toast.error("Failed to send image");
    }
  };

  const startRecording = async () => {
    if (!selectedRoom) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("room_id", selectedRoom.id);
        formData.append("voice_file", blob, "voice.webm");

        if (replyTo) formData.append("reply_to", replyTo.id);

        try {
          await axios.post(`${API_BASE_URL}/api/auth/chat/send-voice/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          setReplyTo(null);
          setAutoScroll(true);
          fetchMessages(selectedRoom.id, "bottom");
          fetchChatRooms();
        } catch (err) {
          toast.error("Voice failed");
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      toast.error("Mic access denied");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleRequestAction = async (action) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/chat/request-action/${selectedRoom.id}/`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message);
      fetchChatRooms();
      fetchMessages(selectedRoom.id);

      if (action === "ignore" || action === "reject") {
        setSelectedRoom(null);
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDeleteMessage = async (forEveryone = false) => {
    if (!selectedMsg) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/auth/chat/delete-message/`, {
        data: {
          message_id: selectedMsg.id,
          for_everyone: forEveryone,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedMsg(null);
      fetchMessages(selectedRoom.id);
      fetchChatRooms();
    } catch (err) {
      toast.error("Could not delete message");
    }
  };

  const handleReply = () => {
    if (!selectedMsg) return;
    setReplyTo(selectedMsg);
    setSelectedMsg(null);
  };

  const handleClearChat = async () => {
    if (!selectedRoom) return;
    if (!window.confirm("Are you sure you want to clear all messages?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/auth/chat/delete-message/`, {
        data: {
          room_id: selectedRoom.id,
          clear_all: true,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([]);
      toast.success("Chat cleared");
      fetchChatRooms();
    } catch (err) {
      toast.error("Failed to clear chat");
    }
  };

  const handleBlockUser = async () => {
    if (!selectedRoom?.other_user?.id) {
      toast.error("User ID not found");
      return;
    }

    const otherUserId = selectedRoom.other_user.id;
    const confirmMessage = isBlockedUser
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?";

    if (!window.confirm(confirmMessage)) return;

    try {
      if (isBlockedUser) {
        await axios.delete(`${API_BASE_URL}/api/auth/block-user/`, {
          data: { blocked_user_id: otherUserId },
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User unblocked successfully");
        setIsBlockedUser(false);
        await fetchChatRooms();
        if (selectedRoom?.id) {
          await fetchMessages(selectedRoom.id, "restore");
        }
      } else {
        await axios.post(
          `${API_BASE_URL}/api/auth/block-user/`,
          {
            blocked_user_id: otherUserId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("User blocked successfully");
        setIsBlockedUser(true);
        setSelectedRoom(null);
        await fetchChatRooms();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.blocked_user_id?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        (isBlockedUser ? "Failed to unblock user" : "Failed to block user");
      toast.error(errorMsg);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (selectedRoom?.id) {
      setScrollPositions((prev) => ({
       ...prev,
        [selectedRoom.id]: container.scrollTop,
      }));
    }

    setAutoScroll(distanceFromBottom <= 2);
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMessageClick = (e, msg) => {
    e.stopPropagation();
    setSelectedMsg(msg);
  };

  if (loading) {
    return <div className="chat-loading">Loading chats...</div>;
  }

  const isInitiator = selectedRoom?.initiated_by === currentUserId;
  const isAdminChat =
    selectedRoom?.is_admin_chat || selectedRoom?.other_user?.is_admin;

  const showRequestActions =
    selectedRoom?.status === "pending" &&!isInitiator &&!isAdminChat;

  const isChatAccepted = selectedRoom?.status === "accepted" || isAdminChat;

  return (
    <div className="chat-page dark-theme">
      <div className={`chat-sidebar ${selectedRoom? "mobile-hide" : ""}`}>
        <div className="chat-header">
          <FaArrowLeft onClick={() => navigate(-1)} className="back-icon" />
          <h2>Messages</h2>
        </div>

        <div className="chat-rooms-list">
          {chatRooms.length === 0? (
            <p className="no-chats">No chats yet</p>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                className={`chat-room-item ${
                  selectedRoom?.id === room.id? "active" : ""
                }`}
                onClick={() => handleRoomClick(room)}
              >
                <img src={getImageUrl(room.other_user?.image)} alt="" />

                <div className="chat-room-info">
                  <h4>
                    {getDisplayName(room.other_user)}
                    {room.other_user?.is_admin && (
                      <span className="admin-badge">Admin</span>
                    )}
                  </h4>

                  <p>
                    {room.last_message?.message_type === "voice"
                     ? "🎤 Voice"
                      : room.last_message?.message_type === "image"
                     ? "📷 Image"
                      : room.last_message?.text || "Start conversation"}
                  </p>

                  {room.unread_count > 0 && (
                    <span className="unread-badge">{room.unread_count}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`chat-main ${!selectedRoom? "mobile-hide" : ""}`}>
        {selectedRoom? (
          <>
            <div className="chat-main-header">
              <div className="header-left">
                <FaArrowLeft
                  onClick={() => setSelectedRoom(null)}
                  className="back-icon mobile-only"
                />

                <img src={getImageUrl(selectedRoom.other_user?.image)} alt="" />

                <div>
                  <h3>{getDisplayName(selectedRoom.other_user)}</h3>
                  <p>
                    {isAdminChat
                     ? "Admin Chat"
                      : selectedRoom.status === "pending"
                     ? "Pending Request"
                      : selectedRoom.status === "accepted"
                     ? "Connected"
                      : selectedRoom.status === "rejected"
                     ? "Rejected"
                      : "Connected"}
                  </p>
                </div>
              </div>

              <div
                className="header-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <IoEllipsisVertical onClick={() => setMenuOpen(!menuOpen)} />

                {menuOpen && (
                  <div className="menu-dropdown">
                    <button onClick={handleClearChat}>
                      <IoTrashOutline /> Clear Chat
                    </button>
                    <button onClick={handleBlockUser}>
                      <FaBan /> {isBlockedUser ? "Unblock User" : "Block User"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              className="chat-messages"
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              onClick={() => setSelectedMsg(null)}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender === currentUserId? "sent" : "received"
                  } ${selectedMsg?.id === msg.id? "selected" : ""}`}
                  onClick={(e) => handleMessageClick(e, msg)}
                >
                  {msg.sender!== currentUserId && (
                    <p className="message-sender">
                      {msg.sender_full_name || msg.sender_name || "User"}
                    </p>
                  )}

                  {msg.reply_to && (
                    <div className="reply-preview">
                      <span className="reply-line"></span>
                      <div>
                        <p className="reply-name">
                          {msg.reply_to_sender_name || "User"}
                        </p>
                        <p className="reply-text">
                          {msg.reply_to_text || "📷 Image"}
                        </p>
                      </div>
                    </div>
                  )}

                  {msg.message_type === "voice"? (
                    <audio controls src={msg.voice_url} />
                  ) : (
                    <>
                      {msg.image_url && (
                        <img
                          src={msg.image_url}
                          alt="Attachment"
                          className="msg-image"
                        />
                      )}
                      {msg.text && (
                        <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                      )}
                    </>
                  )}

                  <div className="msg-footer">
                    <span>{formatTime(msg.created_at)}</span>
                  </div>

                  {selectedMsg?.id === msg.id && (
                    <div
                      className="msg-context-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={handleReply}>
                        <IoArrowUndo /> Reply
                      </button>
                      <button onClick={() => handleDeleteMessage(false)}>
                        <IoTrashOutline /> Delete for me
                      </button>
                      {msg.sender === currentUserId && (
                        <button onClick={() => handleDeleteMessage(true)}>
                          <IoTrashOutline /> Delete for everyone
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {showRequestActions? (
              <div className="chat-request-box">
                <p>{getDisplayName(selectedRoom.other_user)} wants to chat with you.</p>
                <div className="request-actions">
                  <button
                    onClick={() => handleRequestAction("accept")}
                    className="btn-accept"
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    onClick={() => handleRequestAction("reject")}
                    className="btn-reject"
                  >
                    <FaTimes /> Reject
                  </button>
                  <button
                    onClick={() => handleRequestAction("ignore")}
                    className="btn-ignore"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ) : selectedRoom.status === "rejected" &&!isAdminChat? (
              <div className="chat-rejected">
                This chat request was rejected.
              </div>
            ) : selectedRoom.status === "pending" &&
              isInitiator &&
             !isAdminChat? (
              <div className="chat-pending">
                Waiting for {getDisplayName(selectedRoom.other_user)} to accept your request...
              </div>
            ) : isChatAccepted? (
              <div className="chat-input-container">
                {replyTo && (
                  <div className="reply-box">
                    <div className="reply-content">
                      <span className="reply-line"></span>
                      <div>
                        <p className="reply-name">
                          Replying to{" "}
                          {replyTo.sender === currentUserId
                           ? "yourself"
                            : replyTo.sender_name || getDisplayName(selectedRoom.other_user)}
                        </p>
                        <p className="reply-text">
                          {replyTo.text || "📷 Image"}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setReplyTo(null)}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                {showEmoji && (
                  <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                  </div>
                )}

                <div className="chat-input">
                  <IoHappy
                    className="input-icon emoji-btn"
                    onClick={() => setShowEmoji(!showEmoji)}
                  />

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Message..."
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                    aria-hidden="true"
                    tabIndex={-1}
                  />

                  <div className="input-actions">
                    {newMessage.trim()? (
                      <button onClick={handleSendMessage} className="send-btn">
                        <IoSend />
                      </button>
                    ) : (
                      <>
                        <IoMic
                          className={isRecording? "recording mic-btn" : "mic-btn"}
                          onClick={isRecording? stopRecording : startRecording}
                        />
                        <IoImage
                          className="image-btn"
                          onClick={() => fileInputRef.current.click()}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a match to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
}