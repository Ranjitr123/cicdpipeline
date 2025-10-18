require('dotenv').config();
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');


const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);


app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Node CRUD with JWT</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 1.1rem;
          opacity: 0.85;
        }

        .card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem 3rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          animation: fadeIn 1.2s ease-in-out;
        }

        .btn {
          margin-top: 1.5rem;
          background: #ffb347;
          color: #000;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background: #ffd452;
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚀 Node CRUD with JWT & bcrypt</h1>
        <p>Your backend server is running successfully!</p>
        <p>Connected to MongoDB and ready to handle API requests.</p>
        <button class="btn" onclick="window.location.href='https://github.com'">View Docs</button>
      </div>
    </body>
    </html>
  `);
});


async function start() {
try {
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crud_jwt';
await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('Connected to MongoDB');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
console.error('Failed to start server', err);
process.exit(1);
}
}


start();