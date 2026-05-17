import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { seedDatabase } from './seeder.js';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool, Client } = pkg;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 5000;

let pool;

async function initializeDatabase() {
  const sslConfig = process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {};

  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres',
    ...sslConfig
  });
  await adminClient.connect();

  try {
    const dbName = process.env.DB_NAME || 'horoscope_db';
    const res = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rows.length === 0) {
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log('✓ Database created');
    }
  } finally {
    await adminClient.end();
  }

  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'horoscope_db',
    port: parseInt(process.env.DB_PORT) || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    ...sslConfig
  });

  const client = await pool.connect();
  try {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS zodiac_signs (
        id SERIAL PRIMARY KEY,
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
        id SERIAL PRIMARY KEY,
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
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        message TEXT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        card_last4 VARCHAR(4),
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of tables) {
      await client.query(query);
    }

    try {
      await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT \'user\'');
    } catch (e) {}

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
  } finally {
    client.release();
  }
}

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

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, name || 'User', 'user']
    );

    const token = jwt.sign({ id: email }, process.env.JWT_SECRET || 'horoscope_secret_key_2026', {
      expiresIn: '7d'
    });

    res.json({ success: true, token, user: { email, name: name || 'User', role: 'user' } });
  } catch (error) {
    if (error.code === '23505') {
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
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET || 'horoscope_secret_key_2026', {
      expiresIn: '7d'
    });

    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE category = $1 OR $1 = \'Tous\' ORDER BY created_at DESC',
      [req.params.category]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/zodiac', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM zodiac_signs ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tarot', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarot_cards ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { customer_name, email, address, total_price, items } = req.body;

  if (!customer_name || !email || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [req.user.id]);
    const userId = userResult.rows.length > 0 ? userResult.rows[0].id : null;

    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, customer_name, email, address, card_last4, total_price, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [userId, customer_name, email, address, '0000', total_price, 'confirmed']
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.qty, item.price]
      );
    }

    res.json({ success: true, orderId, message: 'Commande créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'horoscope_secret_key_2026');
    const result = await pool.query('SELECT role FROM users WHERE email = $1', [decoded.id]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT o.*, u.email as user_email, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );
    const result = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        'SELECT oi.*, p.name as product_name, p.icon FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
        [order.id]
      );
      result.push({ ...order, items: itemsResult.rows });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function seedAdmin() {
  const client = await pool.connect();
  try {
    const hashedPw = await bcryptjs.hash('ysra 123', 10);
    const result = await client.query('SELECT id FROM users WHERE email = $1', ['zouaouiyosra053@gmail.com']);
    if (result.rows.length === 0) {
      await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        ['zouaouiyosra053@gmail.com', hashedPw, 'yosra', 'admin']
      );
    } else {
      await client.query(
        'UPDATE users SET role = $1, password = $2, name = $3 WHERE email = $4',
        ['admin', hashedPw, 'yosra', 'zouaouiyosra053@gmail.com']
      );
    }
    console.log('✓ Admin user ready (yosra)');
  } catch (error) {
    console.error('✗ Admin seed error:', error.message);
  } finally {
    client.release();
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

app.get('/api/tables', async (req, res) => {
  try {
    const tablesResult = await pool.query(
      "SELECT table_name, (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const result = [];
    for (const table of tablesResult.rows) {
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${table.table_name}"`);
      result.push({
        name: table.table_name,
        rows: parseInt(countResult.rows[0].count, 10),
        created: null
      });
    }
    res.json({ database: process.env.DB_NAME || 'horoscope_db', tables: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    await initializeDatabase();
    await seedDatabase();
    await seedAdmin();

    // Serve frontend static files in production (MUST be after all API routes)
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(__dirname, '../dist');
      if (existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }

    app.listen(PORT, () => {
      console.log(`✓ API server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
