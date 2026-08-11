import mongoose from "mongoose";
declare const Chat: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<{
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    title: string;
    messages: mongoose.Types.DocumentArray<{
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }, {}, {}> & {
        createdAt: NativeDate;
        role: "user" | "assistant";
        content: any;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Chat;
//# sourceMappingURL=Chat.d.ts.map