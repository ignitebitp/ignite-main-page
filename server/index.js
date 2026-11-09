import app from './app.js';
import connectDB from './db.js';
import startScheduler from './lib/scheduler.js';

const PORT = process.env.PORT || 5000;

// Connect to DB and start standalone server (when run via node server/index.js)
connectDB().then(() => {
  startScheduler();
  app.listen(PORT, () => {
    console.log(`🚀 Standalone server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start standalone server:', err);
});
