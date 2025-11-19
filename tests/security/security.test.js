const assert = require('chai').assert;
const fetch = require('node-fetch');

describe('Security Tests - Teacher Management System', function () {
    const baseUrl = 'http://localhost:3000/api';
    let authToken = null;

    this.timeout(10000);

    before(async function () {
        // Get auth token for authenticated tests
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
        }
    });

    describe('Authentication & Authorization', function () {
        it('should reject requests without authentication token', async function () {
            const response = await fetch(`${baseUrl}/teachers`);

            assert.equal(response.status, 401, 'Should return 401 Unauthorized');
        });

        it('should reject requests with invalid token', async function () {
            const response = await fetch(`${baseUrl}/teachers`, {
                headers: { 'Authorization': 'Bearer invalid-token-12345' }
            });

            assert.equal(response.status, 403, 'Should return 403 Forbidden');
        });

        it('should accept requests with valid token', async function () {
            const response = await fetch(`${baseUrl}/teachers`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            assert.equal(response.status, 200, 'Should return 200 OK with valid token');
        });

        it('should reject login with invalid credentials', async function () {
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'hacker', password: 'wrongpass' })
            });

            assert.equal(response.status, 401, 'Should reject invalid credentials');
        });
    });

    describe('SQL Injection Protection', function () {
        it('should sanitize SQL injection attempt in teacher name', async function () {
            const sqlInjection = "'; DROP TABLE teachers; --";

            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: sqlInjection,
                    email: 'test@example.com',
                    especialidad: 'Test',
                    telefono: '+1-555-0000',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            // Should either reject or sanitize the input
            const isSecure = response.status === 400 || response.status === 201;
            assert.isTrue(isSecure, 'Should handle SQL injection attempt safely');

            if (response.status === 201) {
                const data = await response.json();
                // express-validator escape() converts dangerous chars to HTML entities
                const isEscaped = !data.nombre.includes("'") || data.nombre.includes('&#');
                assert.isTrue(isEscaped, 'Should escape or sanitize dangerous SQL characters');
            }
        });

        it('should handle SQL injection in email field', async function () {
            const sqlInjection = "admin' OR '1'='1";

            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: 'Test User',
                    email: sqlInjection,
                    especialidad: 'Test',
                    telefono: '+1-555-0000',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            // Should reject invalid email format
            assert.equal(response.status, 400, 'Should reject invalid email format');
        });
    });

    describe('XSS (Cross-Site Scripting) Protection', function () {
        it('should sanitize XSS attempt in teacher name', async function () {
            const xssPayload = '<script>alert("XSS")</script>';

            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: xssPayload,
                    email: 'xss@example.com',
                    especialidad: 'Test',
                    telefono: '+1-555-0000',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            if (response.status === 201) {
                const data = await response.json();
                // Check that script tags are escaped
                assert.notInclude(data.nombre, '<script>', 'Should escape script tags');
                assert.notInclude(data.nombre, '</script>', 'Should escape script tags');
            }
        });

        it('should sanitize XSS in specialty field', async function () {
            const xssPayload = '<img src=x onerror=alert(1)>';

            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: 'Test User',
                    email: 'test2@example.com',
                    especialidad: xssPayload,
                    telefono: '+1-555-0000',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            if (response.status === 201) {
                const data = await response.json();
                // express-validator escape() converts < to &lt; and > to &gt;
                const isEscaped = data.especialidad.includes('&lt;') || data.especialidad.includes('&gt;') || !data.especialidad.includes('<');
                assert.isTrue(isEscaped, 'Should escape HTML tags and event handlers');
            }
        });
    });

    describe('Input Validation', function () {
        it('should reject empty required fields', async function () {
            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: '',
                    email: '',
                    especialidad: '',
                    telefono: '',
                    aula: '',
                    horario: ''
                })
            });

            assert.equal(response.status, 400, 'Should reject empty required fields');
        });

        it('should validate email format', async function () {
            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: 'Test User',
                    email: 'not-an-email',
                    especialidad: 'Test',
                    telefono: '+1-555-0000',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            assert.equal(response.status, 400, 'Should reject invalid email format');
        });

        it('should validate phone number format', async function () {
            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: 'Test User',
                    email: 'valid@example.com',
                    especialidad: 'Test',
                    telefono: 'invalid-phone!@#',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            assert.equal(response.status, 400, 'Should reject invalid phone format');
        });

        it('should enforce name length limits', async function () {
            const longName = 'A'.repeat(200); // Exceeds max length

            const response = await fetch(`${baseUrl}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    nombre: longName,
                    email: 'test@example.com',
                    especialidad: 'Test',
                    telefono: '+1-555-0000',
                    aula: 'A-100',
                    horario: 'Test'
                })
            });

            assert.equal(response.status, 400, 'Should reject names exceeding max length');
        });
    });

    describe('Security Headers', function () {
        it('should include security headers in response', async function () {
            const response = await fetch(baseUrl.replace('/api', ''));

            const headers = response.headers;

            // Check for common security headers set by Helmet
            assert.exists(headers.get('x-content-type-options'), 'Should have X-Content-Type-Options header');
            assert.exists(headers.get('x-frame-options'), 'Should have X-Frame-Options header');
        });
    });

    describe('CORS Configuration', function () {
        it('should have CORS enabled', async function () {
            const response = await fetch(`${baseUrl}/teachers`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            const corsHeader = response.headers.get('access-control-allow-origin');
            assert.exists(corsHeader, 'Should have CORS headers');
        });
    });
});
