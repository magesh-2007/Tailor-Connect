let io = null

export const initSocket = (socketIoInstance) => {
  io = socketIoInstance

  io.on('connection', (socket) => {
    // Client authenticates/joins their user room
    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(userId.toString())
      }
    })

    socket.on('join_order_room', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`)
      }
    })

    socket.on('disconnect', () => {
      // socket disconnected
    })
  })

  return io
}

export const emitNotification = (userId, notification) => {
  if (io && userId) {
    io.to(userId.toString()).emit('new_notification', notification)
  }
}

export const emitChatMessage = (receiverId, message) => {
  if (io && receiverId) {
    io.to(receiverId.toString()).emit('new_chat_message', message)
  }
}

export const emitOrderStatusUpdate = (order) => {
  if (io && order) {
    if (order.customerId) {
      io.to(order.customerId.toString()).emit('order_status_updated', order)
    }
    if (order.tailorId) {
      io.to(order.tailorId.toString()).emit('order_status_updated', order)
    }
    io.to(`order_${order.id}`).emit('order_status_updated', order)
  }
}

export const getIO = () => io
