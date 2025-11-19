const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key-change-in-production';
const DATA_FILE = path.join(__dirname, 'data', 'teachers.json');

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Helper functions
async function readTeachers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeTeachers(teachers) {
  await fs.writeFile(DATA_FILE, JSON.stringify(teachers, null, 2));
}

// Routes

// Login endpoint (simplified for demo)
app.post('/api/login', [
  body('username').trim().notEmpty().escape(),
  body('password').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  
  // Simple demo credentials
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// GET all teachers
app.get('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const teachers = await readTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los datos' });
  }
});

// GET single teacher
app.get('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const teachers = await readTeachers();
    const teacher = teachers.find(t => t.id === parseInt(req.params.id));
    
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: 'Maestro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los datos' });
  }
});

// POST new teacher
app.post('/api/teachers', [
  authenticateToken,
  body('nombre').trim().notEmpty().escape().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('especialidad').trim().notEmpty().escape(),
  body('telefono').trim().matches(/^[+]?[\d\s-()]+$/),
  body('aula').trim().notEmpty().escape(),
  body('horario').trim().notEmpty().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const teachers = await readTeachers();
    const newTeacher = {
      id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
      ...req.body
    };
    
    teachers.push(newTeacher);
    await writeTeachers(teachers);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

// PUT update teacher
app.put('/api/teachers/:id', [
  authenticateToken,
  body('nombre').trim().notEmpty().escape().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('especialidad').trim().notEmpty().escape(),
  body('telefono').trim().matches(/^[+]?[\d\s-()]+$/),
  body('aula').trim().notEmpty().escape(),
  body('horario').trim().notEmpty().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const teachers = await readTeachers();
    const index = teachers.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index !== -1) {
      teachers[index] = { id: parseInt(req.params.id), ...req.body };
      await writeTeachers(teachers);
      res.json(teachers[index]);
    } else {
      res.status(404).json({ error: 'Maestro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar los datos' });
  }
});

// DELETE teacher
app.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const teachers = await readTeachers();
    const filteredTeachers = teachers.filter(t => t.id !== parseInt(req.params.id));
    
    if (filteredTeachers.length < teachers.length) {
      await writeTeachers(filteredTeachers);
      res.json({ message: 'Maestro eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Maestro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar los datos' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
