const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const FILE = "./tasks.json";

// Read Tasks
const readTasks = () => {
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
};

// Save Tasks
const saveTasks = (tasks) => {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
};

// GET ALL TASKS
app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

// ADD TASK
app.post("/tasks", (req, res) => {
  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks(tasks);

  res.json(newTask);
});

// DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();

  tasks = tasks.filter(
    (task) => task.id != req.params.id
  );

  saveTasks(tasks);

  res.json({ message: "Deleted" });
});

// UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();

  const updatedTasks = tasks.map((task) => {
    if (task.id == req.params.id) {
      return {
        ...task,
        text: req.body.text,
      };
    }

    return task;
  });

  saveTasks(updatedTasks);

  res.json({ message: "Updated" });
});

// TOGGLE COMPLETE
app.patch("/tasks/:id", (req, res) => {
  const tasks = readTasks();

  const updatedTasks = tasks.map((task) => {
    if (task.id == req.params.id) {
      return {
        ...task,
        completed: !task.completed,
      };
    }

    return task;
  });

  saveTasks(updatedTasks);

  res.json({ message: "Toggled" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});