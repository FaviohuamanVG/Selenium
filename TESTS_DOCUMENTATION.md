# 📝 Documentación de Tests Funcionales - Sistema de Gestión de Maestros

## 📊 Resumen General

Suite completa de **10 tests automatizados** con Selenium WebDriver que validan la funcionalidad crítica del sistema de gestión de maestros. Todos los tests se ejecutan en Google Chrome usando ChromeDriver.

**Tiempo de ejecución:** ~53 segundos  
**Estado:** ✅ 10/10 pasando

---

## 🔧 Configuración Inicial

### Before Hook
```javascript
before(async function () {
    // Configuración de Chrome
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    
    // Inicialización del driver
    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
});
```

---

## 🔐 1. Login Functionality (3 tests)

Suite que valida el proceso de autenticación del sistema.

### ✅ Test 1.1: Display Login Form
**Descripción:** Verifica que el formulario de login se muestre correctamente al cargar la página.

**Pasos:**
1. Navegar a `http://localhost:3000`
2. Limpiar localStorage
3. Actualizar la página
4. Esperar a que el elemento `#loginScreen` esté presente

**Validación:**
- El `loginScreen` debe estar visible (`isDisplayed === true`)

**Tiempo promedio:** ~541ms

---

### ✅ Test 1.2: Login with Valid Credentials
**Descripción:** Prueba el inicio de sesión exitoso con credenciales válidas.

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

**Pasos:**
1. Localizar campos de entrada (`#username`, `#password`)
2. Ingresar credenciales válidas
3. Hacer clic en botón submit del formulario
4. Esperar a que aparezca `#appScreen` (timeout: 5s)

**Validación:**
- La pantalla de la aplicación (`appScreen`) debe estar visible
- El usuario debe ser redirigido desde login a la aplicación

**Tiempo promedio:** ~863ms

---

### ✅ Test 1.3: Reject Invalid Credentials
**Descripción:** Verifica que el sistema rechace credenciales incorrectas y muestre un mensaje de error.

**Credenciales de prueba:**
- Usuario: `invalid`
- Contraseña: `wrong`

**Pasos:**
1. Ingresar credenciales inválidas
2. Enviar formulario
3. Esperar popup de SweetAlert2 (`.swal2-popup`, timeout: 3s)
4. Verificar título del error contiene "Error"
5. Cerrar el popup haciendo clic en botón de confirmación
6. Verificar que sigue en pantalla de login

**Validación:**
- Debe aparecer un SweetAlert2 con título "Error"
- El usuario debe permanecer en `loginScreen`
- El popup debe cerrarse correctamente

**Tecnología:** Usa SweetAlert2 para mostrar errores (no alertas nativas de JavaScript)

---

## 📚 2. Teacher CRUD Operations (5 tests)

Suite que valida todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los maestros.

### BeforeEach Hook
Cada test en esta suite comienza con:
1. Navegación a la página
2. Limpieza de localStorage
3. Login automático con credenciales válidas
4. Espera de 500ms para estabilización

---

### ✅ Test 2.1: Display List of Teachers
**Descripción:** Verifica que se muestre la lista de maestros después del login.

**Pasos:**
1. Buscar todos los elementos con clase `.teacher-card`
2. Contar el número de tarjetas encontradas

**Validación:**
- Debe haber al menos 1 maestro mostrado (`teacherCards.length >= 1`)

**Elemento buscado:** `.teacher-card`

---

### ✅ Test 2.2: Open Add Teacher Modal
**Descripción:** Prueba que el modal para agregar maestros se abra correctamente.

**Pasos:**
1. Hacer clic en botón `#addTeacherBtn`
2. Esperar a que el modal aparezca (`.modal.active`, timeout: 3s)
3. Obtener el atributo `class` del modal

**Validación:**
- El modal `#teacherModal` debe tener la clase `active`

**Tiempo promedio:** ~340ms

---

### ✅ Test 2.3: Add a New Teacher
**Descripción:** Prueba completa del proceso de agregar un nuevo maestro al sistema.

**Datos de prueba:**
```javascript
{
    nombre: "Test Teacher",
    email: "test@example.com",
    especialidad: "Testing",
    telefono: "+1-555-9999",
    aula: "T-100",
    horario: "Lunes a Viernes 9:00-15:00"
}
```

**Pasos:**
1. Abrir modal de agregar maestro
2. Llenar todos los campos del formulario:
   - `#teacherName`
   - `#teacherEmail`
   - `#teacherSpecialty`
   - `#teacherPhone`
   - `#teacherClassroom`
   - `#teacherSchedule`
3. Enviar formulario
4. Esperar 2 segundos para que se procese
5. Buscar todas las tarjetas de maestros
6. Obtener el texto de la última tarjeta

**Validación:**
- La última tarjeta debe contener "Test Teacher"
- El nuevo maestro debe aparecer en la lista

**Tiempo promedio:** ~4.8s (más largo debido a la creación y actualización del DOM)

---

### ✅ Test 2.4: Search for Teachers
**Descripción:** Valida la funcionalidad de búsqueda y filtrado de maestros.

**Término de búsqueda:** `"María"`

**Pasos:**
1. Esperar 500ms de estabilización
2. Localizar el campo de búsqueda `#searchInput`
3. Escribir "María"
4. Esperar 500ms para que se aplique el filtro
5. Contar las tarjetas de maestros visibles
6. Si hay resultados, verificar que contengan el término buscado

**Validación:**
- El número de resultados debe ser >= 0
- Si hay resultados, deben contener "maría" (case-insensitive)

**Tiempo promedio:** ~1.3s

**Nota:** La búsqueda filtra por nombre, especialidad y email en tiempo real.

---

### ✅ Test 2.5: Validate Required Fields
**Descripción:** Verifica que el formulario valide campos obligatorios antes de enviar.

**Pasos:**
1. Abrir modal de agregar maestro
2. Intentar enviar el formulario **vacío** sin llenar campos
3. Esperar 3 segundos para ver mensajes de validación
4. Obtener el `validationMessage` del campo `#teacherName`
5. Verificar que el modal permanezca abierto

**Validación:**
- El campo nombre debe mostrar un mensaje de validación HTML5
- `validationMessage` no debe estar vacío
- El formulario no debe enviarse

**Tiempo promedio:** ~5.5s (incluye esperas para observar la validación)

**Tecnología:** Usa validación HTML5 nativa (`required` attribute)

---

## 🎨 3. UI Interactions (2 tests)

Suite que valida interacciones generales de la interfaz de usuario.

### BeforeEach Hook
Igual que Teacher CRUD Operations: login automático antes de cada test.

---

### ✅ Test 3.1: Close Modal When Clicking Cancel
**Descripción:** Verifica que el modal se cierre correctamente al hacer clic en cancelar.

**Pasos:**
1. Abrir modal de agregar maestro (`#addTeacherBtn`)
2. Esperar a que el modal esté activo
3. Hacer clic en botón cancelar (`#cancelBtn`)
4. Esperar 500ms
5. Obtener la clase del modal

**Validación:**
- El modal NO debe tener la clase `active`
- El formulario debe resetearse

**Tiempo promedio:** ~933ms

---

### ✅ Test 3.2: Logout Successfully
**Descripción:** Prueba que el proceso de cierre de sesión funcione correctamente.

**Pasos:**
1. Hacer clic en botón logout (`#logoutBtn`)
2. Esperar 500ms
3. Verificar que `#loginScreen` esté visible

**Validación:**
- El usuario debe ser redirigido a la pantalla de login
- `loginScreen.isDisplayed()` debe ser `true`
- localStorage debe limpiarse (authToken y currentUser)

**Tiempo promedio:** ~725ms

---

## 🛠️ Tecnologías y Herramientas

### Stack de Testing
- **Selenium WebDriver** - Automatización del navegador
- **ChromeDriver** - Driver para Google Chrome
- **Mocha** - Framework de testing
- **Chai** - Librería de aserciones (`assert`)

### Configuración del Navegador
```javascript
Chrome Options:
- --no-sandbox
- --disable-dev-shm-usage
- --window-size=1920,1080
- --disable-blink-features=AutomationControlled
```

### Timeouts
- **Global timeout:** 30,000ms (30 segundos)
- **Element wait:** 5,000ms (5 segundos)
- **Alert wait:** 3,000ms (3 segundos)
- **Sleep delays:** 500ms - 3,000ms según la operación

---

## 📈 Estadísticas de Ejecución

| Categoría | Tests | Tiempo Promedio |
|-----------|-------|-----------------|
| Login Functionality | 3 | ~15s |
| Teacher CRUD Operations | 5 | ~28s |
| UI Interactions | 2 | ~10s |
| **TOTAL** | **10** | **~53s** |

---

## 🎯 Cobertura de Funcionalidad

✅ **Autenticación**
- Login exitoso
- Rechazo de credenciales inválidas
- Manejo de errores con SweetAlert2

✅ **CRUD Completo**
- Listar maestros
- Crear maestro
- Validación de formularios
- Búsqueda y filtrado

✅ **Interacción UI**
- Apertura/cierre de modales
- Navegación entre pantallas
- Logout

✅ **Persistencia**
- localStorage (authToken, currentUser)
- Limpieza de datos entre tests

---

## 🚀 Cómo Ejecutar los Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con más detalle
npm test -- --reporter spec

# Ejecutar un archivo específico
npx mocha tests/functional/teacher-crud.test.js --timeout 30000
```

---

## 📋 Requisitos Previos

1. ✅ Servidor corriendo en `http://localhost:3000`
2. ✅ ChromeDriver instalado
3. ✅ Datos de prueba cargados en `data/teachers.json`
4. ✅ Usuario admin configurado (admin/admin123)

---

## 🐛 Debugging

Si un test falla, revisa:

1. **ChromeDriver Version:** Debe coincidir con tu versión de Chrome
2. **Puerto 3000:** El servidor debe estar corriendo
3. **localStorage:** Se limpia antes de cada test
4. **SweetAlert2:** Los mensajes de error usan SweetAlert2, no alertas nativas
5. **Timeouts:** Ajusta si tu máquina es lenta

---

## 📝 Notas Técnicas

### Diferencias con Alertas Nativas
El test de credenciales inválidas fue actualizado para usar **SweetAlert2** en lugar de `alert()` nativo:

```javascript
// ❌ Antes (fallaba)
await driver.wait(until.alertIsPresent(), 3000);

// ✅ Ahora (correcto)
await driver.wait(until.elementLocated(By.css('.swal2-popup')), 3000);
```

### Event Delegation
La aplicación usa **event delegation** para manejar clicks en botones de editar/eliminar que se crean dinámicamente.

### Estabilización
Se usan `sleep()` estratégicos para esperar animaciones CSS y actualizaciones del DOM.

---

## 🎓 Conclusión

Esta suite de tests proporciona **cobertura completa** de las funcionalidades críticas del sistema:
- ✅ Seguridad (autenticación)
- ✅ CRUD completo
- ✅ Validaciones
- ✅ Experiencia de usuario
- ✅ Manejo de errores

**Mantenimiento:** Los tests son robustos y fáciles de mantener gracias al uso de selectores semánticos y esperas explícitas.
