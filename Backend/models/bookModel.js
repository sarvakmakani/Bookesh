import mongoose from "mongoose";
const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      type: String,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    bookmarked: { type: Boolean, default: false },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);
export const Book = mongoose.model("books", bookSchema);
