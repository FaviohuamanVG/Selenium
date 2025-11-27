let authToken = null;
let currentUser = null;
let teachers = [];
let editingTeacherId = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');
const teachersGrid = document.getElementById('teachersGrid');
const addTeacherBtn = document.getElementById('addTeacherBtn');
const teacherModal = document.getElementById('teacherModal');
const teacherForm = document.getElementById('teacherForm');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');

// API Base URL
const API_URL = 'http://localhost:3000/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    addTeacherBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    teacherForm.addEventListener('submit', handleTeacherSubmit);
    searchInput.addEventListener('input', handleSearch);

    // Close modal on outside click
    teacherModal.addEventListener('click', (e) => {
        if (e.target === teacherModal) {
            closeModalHandler();
        }
    });
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
        authToken = token;
        currentUser = user;
        showApp();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginScreen.style.display = 'flex';
    appScreen.style.display = 'none';
}

function showApp() {
    loginScreen.style.display = 'none';
    appScreen.style.display = 'block';
    userDisplay.textContent = currentUser;
    loadTeachers();
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data.username;

            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', currentUser);

            showApp();
            loginForm.reset();
        } else {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error || 'Error al iniciar sesión',
                background: '#1a1a1a',
                color: '#ffffff'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error de conexión. Asegúrate de que el servidor esté corriendo.',
            background: '#1a1a1a',
            color: '#ffffff'
        });
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLogin();
}

async function loadTeachers() {
    try {
        const response = await fetch(`${API_URL}/teachers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            teachers = await response.json();
            renderTeachers(teachers);
        } else if (response.status === 401 || response.status === 403) {
            handleLogout();
        } else {
            throw new Error('Error al cargar maestros');
        }
    } catch (error) {
        console.error('Load teachers error:', error);
        teachersGrid.innerHTML = '<div class="empty-state"><h3>Error al cargar los datos</h3></div>';
    }
}

function renderTeachers(teachersToRender) {
    if (teachersToRender.length === 0) {
        teachersGrid.innerHTML = `
            <div class="empty-state">
                <h3>No hay maestros registrados</h3>
                <p>Haz clic en "Agregar Maestro" para comenzar</p>
            </div>
        `;
        return;
    }

    teachersGrid.innerHTML = teachersToRender.map(teacher => `
        <div class="teacher-card" data-id="${teacher.id}">
            <div class="teacher-header">
                <div>
                    <div class="teacher-name">${escapeHtml(teacher.nombre)}</div>
                    <div class="teacher-specialty">${escapeHtml(teacher.especialidad)}</div>
                </div>
                <div class="teacher-actions">
                    <button class="btn-icon edit" data-action="edit" data-teacher-id="${teacher.id}" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete" data-action="delete" data-teacher-id="${teacher.id}" title="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H14M12.667 4V13.333C12.667 14 12 14.667 11.333 14.667H4.667C4 14.667 3.333 14 3.333 13.333V4M5.333 4V2.667C5.333 2 6 1.333 6.667 1.333H9.333C10 1.333 10.667 2 10.667 2.667V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="teacher-info">
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span>${escapeHtml(teacher.email)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Teléfono:</span>
                    <span>${escapeHtml(teacher.telefono)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Aula:</span>
                    <span>${escapeHtml(teacher.aula)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Horario:</span>
                    <span>${escapeHtml(teacher.horario)}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add event delegation for edit and delete buttons
    setupTeacherCardListeners();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = teachers.filter(teacher =>
        teacher.nombre.toLowerCase().includes(searchTerm) ||
        teacher.especialidad.toLowerCase().includes(searchTerm) ||
        teacher.email.toLowerCase().includes(searchTerm)
    );
    renderTeachers(filtered);
}

function setupTeacherCardListeners() {
    // Use event delegation to handle clicks on dynamically created buttons
    teachersGrid.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const teacherId = parseInt(button.dataset.teacherId);

        if (action === 'edit') {
            editTeacher(teacherId);
        } else if (action === 'delete') {
            deleteTeacher(teacherId);
        }
    });
}

function openModal(teacher = null) {
    editingTeacherId = teacher ? teacher.id : null;

    if (teacher) {
        modalTitle.textContent = 'Editar Maestro';
        document.getElementById('teacherId').value = teacher.id;
        document.getElementById('teacherName').value = teacher.nombre;
        document.getElementById('teacherEmail').value = teacher.email;
        document.getElementById('teacherSpecialty').value = teacher.especialidad;
        document.getElementById('teacherPhone').value = teacher.telefono;
        document.getElementById('teacherClassroom').value = teacher.aula;
        document.getElementById('teacherSchedule').value = teacher.horario;
    } else {
        modalTitle.textContent = 'Agregar Maestro';
        teacherForm.reset();
    }

    teacherModal.classList.add('active');
}

function closeModalHandler() {
    teacherModal.classList.remove('active');
    teacherForm.reset();
    editingTeacherId = null;
}

async function handleTeacherSubmit(e) {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('teacherName').value,
        email: document.getElementById('teacherEmail').value,
        especialidad: document.getElementById('teacherSpecialty').value,
        telefono: document.getElementById('teacherPhone').value,
        aula: document.getElementById('teacherClassroom').value,
        horario: document.getElementById('teacherSchedule').value
    };

    try {
        const url = editingTeacherId
            ? `${API_URL}/teachers/${editingTeacherId}`
            : `${API_URL}/teachers`;

        const method = editingTeacherId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeModalHandler();
            await loadTeachers();
        } else {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error || 'Error al guardar el maestro',
                background: '#1a1a1a',
                color: '#ffffff'
            });
        }
    } catch (error) {
        console.error('Save teacher error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error de conexión',
            background: '#1a1a1a',
            color: '#ffffff'
        });
    }
}

async function editTeacher(id) {
    const teacher = teachers.find(t => t.id === id);
    if (teacher) {
        openModal(teacher);
    }
}

async function deleteTeacher(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#ffffff'
    });

    if (!result.isConfirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/teachers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            await Swal.fire({
                title: '¡Eliminado!',
                text: 'El maestro ha sido eliminado.',
                icon: 'success',
                background: '#1a1a1a',
                color: '#ffffff',
                timer: 1500,
                showConfirmButton: false
            });
            await loadTeachers();
        } else {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error || 'Error al eliminar el maestro',
                background: '#1a1a1a',
                color: '#ffffff'
            });
        }
    } catch (error) {
        console.error('Delete teacher error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error de conexión',
            background: '#1a1a1a',
            color: '#ffffff'
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
