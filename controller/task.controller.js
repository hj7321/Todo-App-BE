const Task = require("../model/Task");

const taskController = {};

// 1. 할 일 생성 (Create)
taskController.createTask = async (req, res) => {
  try {
    const { title, content, priority, isComplete } = req.body;
    const newTask = await Task.create({
      title,
      content,
      priority,
      isComplete,
      author: req.userId,
    });
    res.status(201).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 2. 전체 할 일들 가져오기 (Read)
taskController.getTasks = async (req, res) => {
  try {
    const taskList = await Task.find({})
      .populate("author", "username email")
      .lean()
      .select("-__v");
    res.status(200).json({ status: "ok", data: taskList });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 3. 내가 작성한 할 일들만 가져오기 (Read)
taskController.getMyTasks = async (req, res) => {
  try {
    const myTaskList = await Task.find({ author: req.userId }).select("-__v");
    res.status(200).json({ status: "ok", data: myTaskList });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 4. 검색어를 기준으로 할 일들 가져오기 (Read)
taskController.searchTasks = async (req, res) => {
  try {
    // 1) 쿼리 파라미터 추출
    const { q, mine } = req.query;

    // 2) 검색어 유효성 검사
    if (!q || !q.trim())
      return res
        .status(400)
        .json({ status: "fail", message: "Required q parameter" });

    // 3) 기본 필터 정의: 텍스트 검색
    const filter = { $text: { $search: q } };

    // 4) 조건 추가: mine === true면 내 글만 검색
    if (mine === "true") filter.author = req.userId;

    // 5) 쿼리 실행: 조건에 맞는 Task 조회
    const tasks = await Task.find(filter, {
      score: { $meta: "textScore" },
    })
      .sort({ score: { $meta: "textScore" } })
      .select("-__v");

    res.status(200).json({ status: "ok", data: tasks });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// 5. 내가 작성한 할 일 수정하기 (Update)
taskController.updateTask = async (req, res) => {
  try {
    // 1) URL 경로 /tasks/:id에서 id 추출
    const { id } = req.params;

    // 2) DB에서 해당 Task 조회
    const task = await Task.findById(id);

    // 3) task가 없으면 404 에러 반환
    if (!task)
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found" });

    // 4) 로그인 사용자(req.userId)가 작성자가 아니면 403 에러 반환
    if (!task.author.equals(req.userId))
      return res.status(403).json({ status: "fail", message: "Not your task" });

    // 5) 전달된 필드를 구조분해
    const { title, content, priority, isComplete } = req.body;

    // 6) task 객체 속성 업데이트
    if (title !== undefined) task.title = title;
    if (content !== undefined) task.content = content;
    if (priority !== undefined) task.priority = priority;
    if (isComplete !== undefined) task.isComplete = isComplete;

    // 7) 변경사항 저장
    await task.save();
    res.status(200).json({ status: "ok", data: task });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 6. 내가 작성한 할 일 삭제하기 (Delete)
taskController.deleteTask = async (req, res) => {
  try {
    // 1) URL 경로 /tasks/:id에서 id 추출
    const { id } = req.params;

    // 2) DB에서 해당 Task 조회
    const task = await Task.findById(id);

    // 3) task가 없으면 404 에러 반환
    if (!task)
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found" });

    // 4) 로그인 사용자(req.userId)가 작성자가 아니면 403 에러 반환
    if (!task.author.equals(req.userId))
      return res.status(403).json({ status: "fail", message: "Not your task" });

    // 5) 해당 task 삭제
    await task.deleteOne();
    res.status(200).json({ status: "ok", data: task });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = taskController;
