import mongoose, { Schema, model } from "mongoose";
const messageSchema = new Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: true });
const chatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    messages: [messageSchema],
}, {
    timestamps: true,
});
const Chat = mongoose.models.Chat || model("Chat", chatSchema);
export default Chat;
//# sourceMappingURL=Chat.js.map