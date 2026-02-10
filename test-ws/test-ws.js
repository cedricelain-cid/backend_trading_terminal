const { io } = require("socket.io-client");

const socket = io("http://localhost:8000", {
  path: "/ws",
  transports: ["websocket"], // force websocket
});

socket.on("connect", () => {
  console.log("connected:", socket.id);
  socket.emit("subscribeUser", { user: "0xUserStub" }, (ack) => {
    console.log("ack:", ack);
  });
});

socket.on("PortfolioUpdated", (msg) => {
  console.log("PortfolioUpdated:", msg);
});

socket.on("connect_error", (err) => {
  console.error("connect_error:", err.message);
});

