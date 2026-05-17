import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { seedDatabase } from './seeder.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'horoscope_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database if needed
async function initializeDatabase() {
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  });

  try {
    await tempConnection.query('CREATE DATABASE IF NOT EXISTS horoscope_db');
    await tempConnection.query('USE horoscope_db');

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS zodiac_signs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        date_range VARCHAR(50) NOT NULL,
        color VARCHAR(20) NOT NULL,
        love INT NOT NULL,
        work INT NOT NULL,
        intuition INT NOT NULL,
        luck INT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        badge VARCHAR(50),
        description TEXT NOT NULL,
        gradient VARCHAR(255) NOT NULL,
        icon VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS tarot_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        message TEXT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        card_last4 VARCHAR(4),
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      )`
    ];

    for (const query of tables) {
      await tempConnection.query(query);
    }

    // Add role column if missing (existing DB)
    try { await tempConnection.query('ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT "user"'); } catch (e) {}

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
  } finally {
    await tempConnection.end();
  }
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'horoscope_secret_key_2026', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const connection = await pool.getConnection();
    const hashedPassword = await bcryptjs.hash(password, 10);

    await connection.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name || 'User', 'user']
    );

    const token = jwt.sign({ id: email }, process.env.JWT_SECRET || 'horoscope_secret_key_2026', {
      expiresIn: '7d'
    });

    connection.release();
    res.json({ success: true, token, user: { email, name: name || 'User', role: 'user' } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET || 'horoscope_secret_key_2026', {
      expiresIn: '7d'
    });

    connection.release();
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM products ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM products WHERE category = ? OR ? = "Tous" ORDER BY created_at DESC',
      [req.params.category, req.params.category]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Zodiac Routes
app.get('/api/zodiac', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM zodiac_signs ORDER BY id');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tarot Routes
app.get('/api/tarot', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM tarot_cards ORDER BY id');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { customer_name, email, address, total_price, items } = req.body;

  if (!customer_name || !email || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const connection = await pool.getConnection();

    const [userRows] = await connection.query('SELECT id FROM users WHERE email = ?', [req.user.id]);
    const userId = userRows.length > 0 ? userRows[0].id : null;

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, customer_name, email, address, card_last4, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, customer_name, email, address, '0000', total_price, 'confirmed']
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.qty, item.price]
      );
    }

    connection.release();
    res.json({ success: true, orderId, message: 'Commande créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin middleware
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'horoscope_secret_key_2026');
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT role FROM users WHERE email = ?', [decoded.id]);
    connection.release();
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Admin: list users
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: list orders with items
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [orders] = await connection.query(
      'SELECT o.*, u.email as user_email, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );
    const result = [];
    for (const order of orders) {
      const [items] = await connection.query(
        'SELECT oi.*, p.name as product_name, p.icon FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id]
      );
      result.push({ ...order, items });
    }
    connection.release();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed admin user if not exists
async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'horoscope_db',
    port: process.env.DB_PORT || 3306
  });
  try {
    const hashedPw = await bcryptjs.hash('ysra 123', 10);
    const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', ['zouaouiyosra053@gmail.com']);
    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['zouaouiyosra053@gmail.com', hashedPw, 'yosra', 'admin']
      );
    } else {
      await connection.query(
        'UPDATE users SET role = ?, password = ?, name = ? WHERE email = ?',
        ['admin', hashedPw, 'yosra', 'zouaouiyosra053@gmail.com']
      );
    }
    console.log('✓ Admin user ready (yosra)');
  } catch (error) {
    console.error('✗ Admin seed error:', error.message);
  } finally {
    await connection.end();
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

// Database tables info endpoint
app.get('/api/tables', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tables] = await connection.query("SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [process.env.DB_NAME || 'horoscope_db']);
    const result = [];
    for (const table of tables) {
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${table.TABLE_NAME}\``);
      result.push({
        name: table.TABLE_NAME,
        rows: countResult[0].count,
        created: table.CREATE_TIME
      });
    }
    connection.release();
    res.json({ database: process.env.DB_NAME || 'horoscope_db', tables: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.API_PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();
    await seedDatabase();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`✓ API server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
