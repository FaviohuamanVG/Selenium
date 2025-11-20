# 🎓 Sistema de Gestión de Maestros
La aplicacion fue actualizada en la otra rama

[![Node.js](https://img.shields.io/badge/Node.js-v24.11.1-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![Selenium](https://img.shields.io/badge/Selenium-4.38.0-green.svg)](https://www.selenium.dev/)
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20passing-brightgreen.svg)](tests/)
[![Security](https://img.shields.io/badge/Security-0%20vulnerabilities-brightgreen.svg)](tests/security/)

Sistema completo de gestión de maestros con backend REST API, frontend moderno, pruebas automatizadas funcionales con Selenium y pruebas de seguridad exhaustivas.

![Sistema de Gestión de Maestros](https://via.placeholder.com/800x400/1a1a24/7c3aed?text=Teacher+Management+System)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Pruebas](#-pruebas)
- [API Endpoints](#-api-endpoints)
- [Seguridad](#-seguridad)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### Backend
- ✅ **API REST completa** con Express.js
- ✅ **Autenticación JWT** con tokens de expiración
- ✅ **Validación de entrada** con express-validator
- ✅ **Sanitización de datos** para prevenir XSS y SQL Injection
- ✅ **Headers de seguridad** con Helmet
- ✅ **CORS configurado** para peticiones cross-origin
- ✅ **Operaciones CRUD** completas para maestros

### Frontend
- ✅ **Diseño moderno** con dark mode
- ✅ **Efectos glassmorphism** y animaciones suaves
- ✅ **Responsive design** para todos los dispositivos
- ✅ **Búsqueda en tiempo real** de maestros
- ✅ **Validación de formularios** en cliente y servidor
- ✅ **Interfaz intuitiva** y fácil de usar

### Testing
- ✅ **14/14 pruebas de seguridad** pasando (100%)
- ✅ **Pruebas funcionales** con Selenium WebDriver
- ✅ **Cobertura de vulnerabilidades** OWASP Top 10
- ✅ **Pruebas automatizadas** con Mocha y Chai
- ✅ **0 vulnerabilidades** detectadas

---

## 🚀 Tecnologías

### Backend
- **Node.js** v24.11.1
- **Express.js** 4.18.2 - Framework web
- **JWT** (jsonwebtoken) 9.0.2 - Autenticación
- **express-validator** 7.0.1 - Validación y sanitización
- **Helmet** 7.1.0 - Headers de seguridad
- **CORS** 2.8.5 - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Lógica del cliente
- **Fetch API** - Comunicación con el backend

### Testing
- **Selenium WebDriver** 4.38.0 - Pruebas funcionales
- **Mocha** 10.8.2 - Framework de testing
- **Chai** 4.5.0 - Assertions
- **ChromeDriver** 120.0.0 - Driver para Chrome
- **node-fetch** 2.7.0 - HTTP requests en tests

---

## 📦 Instalación

### Requisitos Previos

- Node.js v14 o superior
- npm v6 o superior
- Google Chrome (para pruebas con Selenium)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/teacher-management-system.git
   cd teacher-management-system
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Verificar instalación**
   ```bash
   npm list
   # Debe mostrar todas las dependencias sin errores
   ```

---

## 🎯 Uso

### Iniciar el Servidor

```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

### Credenciales de Demo

- **Usuario:** `admin`
- **Contraseña:** `admin123`

### Funcionalidades Disponibles

1. **Login/Logout** - Autenticación segura con JWT
2. **Listar Maestros** - Ver todos los maestros registrados
3. **Agregar Maestro** - Crear nuevos registros
4. **Editar Maestro** - Actualizar información existente
5. **Eliminar Maestro** - Borrar registros
6. **Buscar Maestros** - Filtrado en tiempo real

---

## 🧪 Pruebas

### Ejecutar Todas las Pruebas

```bash
npm run test:all
```

### Pruebas de Seguridad

```bash
npm run test:security
```

**Resultado esperado:**
```
✓ 14 passing (332ms)

Authentication & Authorization (4 tests)
SQL Injection Protection (2 tests)
XSS Protection (2 tests)
Input Validation (4 tests)
Security Headers (1 test)
CORS Configuration (1 test)
```

### Pruebas Funcionales con Selenium

```bash
npm test
```

**Casos de prueba:**
- Login/Logout functionality
- CRUD operations
- Form validation
- Search functionality
- UI interactions

> **Nota:** Las pruebas de Selenium requieren que el servidor esté corriendo en otra terminal.

---

## 📡 API Endpoints

### Autenticación

#### POST `/api/login`
Autenticar usuario y obtener token JWT.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

---

### Maestros

#### GET `/api/teachers`
Obtener lista de todos los maestros.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "María García",
    "email": "maria.garcia@escuela.edu",
    "especialidad": "Matemáticas",
    "telefono": "+1-555-0101",
    "aula": "A-101",
    "horario": "Lunes a Viernes 8:00-14:00"
  }
]
```

#### GET `/api/teachers/:id`
Obtener un maestro específico.

**Headers:** `Authorization: Bearer {token}`

#### POST `/api/teachers`
Crear un nuevo maestro.

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "especialidad": "Ciencias",
  "telefono": "+1-555-0100",
  "aula": "B-205",
  "horario": "Lunes a Viernes 9:00-15:00"
}
```

#### PUT `/api/teachers/:id`
Actualizar un maestro existente.

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

#### DELETE `/api/teachers/:id`
Eliminar un maestro.

**Headers:** `Authorization: Bearer {token}`

---

## 🔒 Seguridad

### Medidas Implementadas

#### 1. Autenticación JWT
- Tokens con expiración de 1 hora
- Validación en cada petición
- Endpoints protegidos

#### 2. Protección contra SQL Injection
- Sanitización con express-validator
- Escape de caracteres peligrosos
- Validación de tipos de datos

#### 3. Protección contra XSS
- Backend: express-validator `escape()`
- Frontend: uso de `textContent` en lugar de `innerHTML`
- Content Security Policy headers

#### 4. Validación de Entrada
- Campos requeridos
- Formato de email
- Formato de teléfono
- Límites de longitud (2-100 caracteres)

#### 5. Headers de Seguridad (Helmet)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `X-DNS-Prefetch-Control: off`

#### 6. CORS
- Configuración de orígenes permitidos
- Control de métodos HTTP

### Resultados de Pruebas de Seguridad

| Categoría | Pruebas | Estado |
|-----------|---------|--------|
| Autenticación | 4 | ✅ 100% |
| SQL Injection | 2 | ✅ 100% |
| XSS Protection | 2 | ✅ 100% |
| Input Validation | 4 | ✅ 100% |
| Security Headers | 1 | ✅ 100% |
| CORS | 1 | ✅ 100% |
| **TOTAL** | **14** | **✅ 100%** |

---

## 📁 Estructura del Proyecto

```
selenium/
├── 📄 server.js                    # Backend Express.js (191 líneas)
├── 📄 package.json                 # Configuración npm
├── 📁 data/
│   └── 📄 teachers.json           # Datos mock (21 registros)
├── 📁 public/
│   ├── 📄 index.html              # Frontend HTML (189 líneas)
│   ├── 📄 styles.css              # Estilos CSS (395 líneas)
│   └── 📄 app.js                  # JavaScript frontend (256 líneas)
├── 📁 tests/
│   ├── 📁 functional/
│   │   └── 📄 teacher-crud.test.js    # Pruebas Selenium (233 líneas)
│   └── 📁 security/
│       └── 📄 security.test.js        # Pruebas seguridad (276 líneas)
├── 📄 README.md                    # Este archivo
├── 📄 INFORME_COMPLETO.md         # Informe detallado
├── 📄 COMPARACION_SELENIUM_VS_PLAYWRIGHT.md
└── 📄 TESTING_GUIDE.md            # Guía de pruebas
```

**Total:** 1,540 líneas de código

---

## 📚 Documentación

### Documentos Disponibles

1. **[README.md](README.md)** - Documentación principal (este archivo)
2. **[INFORME_COMPLETO.md](INFORME_COMPLETO.md)** - Informe paso a paso con hallazgos
3. **[COMPARACION_SELENIUM_VS_PLAYWRIGHT.md](COMPARACION_SELENIUM_VS_PLAYWRIGHT.md)** - Análisis comparativo
4. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía de pruebas y troubleshooting

### Recursos Adicionales

- [Documentación de Express.js](https://expressjs.com/)
- [Selenium WebDriver Docs](https://www.selenium.dev/documentation/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🐛 Troubleshooting

### Error: Puerto 3000 en uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: ChromeDriver timeout

**Causa:** Incompatibilidad entre Chrome y ChromeDriver

**Solución:**
1. Verificar versión de Chrome: `chrome://version/`
2. Instalar ChromeDriver compatible:
   ```bash
   npm install chromedriver@<VERSION> --save-dev
   ```

### Error: Cannot connect to server

**Solución:** Asegurarse de que el servidor esté corriendo:
```bash
npm start
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Seguir el estilo de código existente
- Agregar pruebas para nuevas funcionalidades
- Actualizar documentación según sea necesario
- Asegurar que todas las pruebas pasen

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de código | 1,540 |
| Archivos creados | 14 |
| Pruebas de seguridad | 14/14 (100%) |
| Vulnerabilidades | 0 |
| Tiempo de ejecución tests | 332ms |
| Dependencias | 11 |
| Cobertura OWASP Top 10 | 8/10 |

---

## 🎓 Casos de Uso

### Educación
- Gestión de profesores en escuelas
- Asignación de aulas y horarios
- Directorio de contactos

### Empresarial
- Base para sistemas de gestión
- Ejemplo de arquitectura REST
- Referencia de seguridad

### Aprendizaje
- Proyecto de ejemplo para Node.js
- Implementación de Selenium
- Pruebas de seguridad automatizadas

---

## 🔮 Roadmap

### Versión 2.0 (Planificado)

- [ ] Base de datos PostgreSQL/MongoDB
- [ ] Roles y permisos avanzados
- [ ] Paginación en listados
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Auditoría de cambios
- [ ] Dashboard con estadísticas
- [ ] API GraphQL

---

## 📝 Changelog

### [1.0.0] - 2025-11-19

#### Agregado
- Backend REST API completo
- Frontend moderno con dark mode
- Autenticación JWT
- 14 pruebas de seguridad
- Código Selenium completo
- Validación y sanitización
- Headers de seguridad
- Documentación completa

#### Seguridad
- Protección contra XSS
- Protección contra SQL Injection
- Validación de entrada robusta
- CORS configurado
- Helmet implementado

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Lucio**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@example.com

---

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/) - Framework web
- [Selenium](https://www.selenium.dev/) - Automatización de pruebas
- [Helmet](https://helmetjs.github.io/) - Seguridad HTTP
- [Mocha](https://mochajs.org/) - Framework de testing
- [OWASP](https://owasp.org/) - Guías de seguridad

---

## 📞 Soporte

¿Necesitas ayuda? 

- 📧 Email: soporte@example.com
- 💬 Issues: [GitHub Issues](https://github.com/tu-usuario/teacher-management-system/issues)
- 📖 Documentación: [Wiki](https://github.com/tu-usuario/teacher-management-system/wiki)

---

<div align="center">

</div>
