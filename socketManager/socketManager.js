import User from "../models/users/users.model.js";

export const socketManager = (io) => (socket) => {
  socket.on("mark_user_online", async (userId) => {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { socketId: socket.id },
      { new: true }
    );
    if (user) {
      io.emit(`user_update_${user._id}`, user);
    }
  });
  // when disconnect
  socket.on("disconnect", async () => {
    const disconnectedUser = await User.findOneAndUpdate(
      { socketId: socket.id },
      {
        $set: { socketId: null },
      },
      { new: true }
    );
    if (disconnectedUser) {
      io.emit(`user_update_${disconnectedUser._id}`, disconnectedUser);
    }
    console.log("disconnect");
  });
};
