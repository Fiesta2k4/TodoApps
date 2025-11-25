// app.js
// Backend tối giản: Node.js + Express + Mongoose (MongoDB)
const express = require('express');
const client = require('prom-client');
const mongoose = require('mongoose');
const path = require('path');

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI ||  'mongodb://root:example@mongodb/todos?authSource=admin';

const app = express();
app.use(express.json());

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status']
});
register.registerMetric(httpRequests);

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequests.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});


// Phục vụ file tĩnh (index.html trong cùng thư mục)
app.use(express.static(path.join(__dirname)));

// Kết nối MongoDB
async function connectDB() {
  await mongoose.connect(MONGODB_URI, {
    // các tuỳ chọn mặc định của Mongoose 7+ là đủ cho demo
  });
  console.log('✅ Connected to MongoDB');
}

// Định nghĩa Schema/Model
const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

// API: Lấy danh sách
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }).lean();
    res.json(todos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// API: Tạo mới
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
    const created = await Todo.create({ text: text.trim() });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, done } = req.body;
    const update = {};
    if (typeof text === 'string') update.text = text.trim();
    if (typeof done === 'boolean') update.done = done;

    const updated = await Todo.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid id' });
  }
});

// API: Xoá
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Todo.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid id' });
  }
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running: http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
})();
