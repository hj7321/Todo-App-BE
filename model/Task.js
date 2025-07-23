const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 텍스트 인덱스 추가 (검색용)
taskSchema.index({ title: "text", content: "text" });

// Task 모델 생성
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
