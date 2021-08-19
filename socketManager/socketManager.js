import User from "../models/users/users.model.js";

export const socketManager = (io) => (socket) => {
  socket.on("mark_user_online", async (userId) => {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { socketId: socket.id },
      { new: true }
    );
    if (user) {
      io.emit("marked_user_online", user);
    }
  });
  // when disconnect
  socket.on("disconnect", async () => {
    await User.findOneAndUpdate(
      { socketId: socket.id },
      {
        $set: { socketId: null },
      }
    );
    console.log("disconnect");
  });
};
