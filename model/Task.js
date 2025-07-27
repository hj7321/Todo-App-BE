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

// 단일 필드 인덱스 정의 (검색용)
taskSchema.index({ title: 1 });
taskSchema.index({ content: 1 });

// Task 모델 생성
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
