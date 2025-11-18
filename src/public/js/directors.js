/* eslint-env browser */
/* global fetch, document, window, confirm */
const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const API_URL = '/api/directors';


async function loadDirectors() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        let directors = await res.json();

        // Ordenar por ID (asumiendo que el ID es numérico)
        directors = directors.sort((a, b) => a.id - b.id);

        const table = document.getElementById('directorsTable'); // Cambiado a directorsTable
        table.innerHTML = '';

        directors.forEach(t => {
            // Adaptar las propiedades a Director Técnico
            // *** CAMBIO CLAVE: Usamos t.currentteam y t.yearsexperience (minúsculas)
            // *** Si no funciona, pruebe con t.current_team y t.years_experience
            table.innerHTML += `
                <tr>
                    <td>${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.nationality}</td>
                    <td>${t.age}</td>
                    <td>${t.currentteam || t.currentTeam || 'N/A'}</td> 
                    <td>${t.yearsexperience || t.yearsExperience || 'N/A'}</td>
                    <td>${t.email}</td>
                    <td>${t.cellphone}</td>
                    <td>
                        <i class="fa-solid fa-pen-to-square action-btn edit" onclick="openDirectorModal(${t.id})"></i>
                        <i class="fa-solid fa-trash action-btn delete" onclick="deleteDirector(${t.id})"></i>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        logger.error('Error cargando directores técnicos:', err);
        const table = document.getElementById('directorsTable');
        table.innerHTML = '<tr><td colspan="9">Error al cargar datos o no hay conexión.</td></tr>';
    }
}

/* =========================================================
 * AGREGAR (POST) - (Esta sección usa camelCase, lo cual está bien para enviar)
 * ========================================================= */
document.getElementById('directorForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newDirector = {
        name: document.getElementById('name').value,
        nationality: document.getElementById('nationality').value,
        age: parseInt(document.getElementById('age').value),
        currentTeam: document.getElementById('currentTeam').value,
        yearsExperience: parseInt(document.getElementById('yearsExperience').value),
        email: document.getElementById('email').value,
        cellphone: document.getElementById('cellphone').value,
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDirector)
        });

        if (res.status === 201) {
            logger.info('Director Técnico creado con éxito.');
        } else if (res.status === 500) {
            const errorData = await res.json();
            logger.error('Error 500 al crear:', errorData.error);
        } else {
            logger.error('Error inesperado al crear Director Técnico. Status:', res.status);
        }

    } catch (err) {
        logger.error('Error de red al intentar crear Director Técnico:', err);
    }


    e.target.reset();
    loadDirectors();
});

/* =========================================================
 * ELIMINAR (DELETE)
 * ========================================================= */
async function deleteDirector(id) {
    // Usar un modal personalizado en lugar de window.confirm() en una aplicación final
    if (!confirm(`¿Eliminar Director Técnico con ID ${id}?`)) { return; }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (res.status === 200) {
            logger.info('Director Técnico eliminado con éxito.');
        } else if (res.status === 404) {
            logger.info('Error 404: Director Técnico no encontrado.');
        } else {
            logger.error('Error inesperado al eliminar Director Técnico. Status:', res.status);
        }

    } catch (err) {
        logger.error('Error de red al intentar eliminar Director Técnico:', err);
    }

    loadDirectors();
}

/* =========================================================
 * ABRIR MODAL Y CARGAR DATOS
 * ========================================================= */
async function openDirectorModal(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            throw new Error('Director no encontrado.');
        }
        const t = await res.json(); // Director data

        // *** CAMBIO CLAVE: Usamos t.currentteam y t.yearsexperience (minúsculas)
        document.getElementById('editId').value = t.id;
        document.getElementById('editName').value = t.name;
        document.getElementById('editNationality').value = t.nationality;
        document.getElementById('editAge').value = t.age;
        document.getElementById('editCurrentTeam').value = t.currentteam || t.currentTeam;
        document.getElementById('editYearsExperience').value = t.yearsexperience || t.yearsExperience;
        document.getElementById('editEmail').value = t.email;
        document.getElementById('editCellphone').value = t.cellphone;

        document.getElementById('editModal').style.display = 'flex';

    } catch (err) {
        logger.error('Error al abrir modal:', err);
    }
}

/* =========================================================
 * CERRAR MODAL
 * ========================================================= */
function closeDirectorModal() {
    document.getElementById('editModal').style.display = 'none';
}

/* =========================================================
 * GUARDAR CAMBIOS (PUT) - (Esta sección usa camelCase, lo cual está bien para enviar)
 * ========================================================= */
document.getElementById('editDirectorForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const edited = {
        name: document.getElementById('editName').value,
        nationality: document.getElementById('editNationality').value,
        age: parseInt(document.getElementById('editAge').value),
        currentTeam: document.getElementById('editCurrentTeam').value,
        yearsExperience: parseInt(document.getElementById('editYearsExperience').value),
        email: document.getElementById('editEmail').value,
        cellphone: document.getElementById('editCellphone').value
    };

    const id = document.getElementById('editId').value;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(edited)
        });

        if (res.status === 200) {
            logger.info('Director Técnico actualizado con éxito.');
        } else if (res.status === 404) {
            logger.info('Error 404: Director Técnico no encontrado para actualizar.');
        } else {
            logger.error('Error inesperado al actualizar Director Técnico. Status:', res.status);
        }

    } catch (err) {
        logger.error('Error de red al intentar actualizar Director Técnico:', err);
    }

    closeDirectorModal();
    loadDirectors();
});

/* =========================================================
 * CARGA INICIAL
 * ========================================================= */
window.onload = loadDirectors;
window.deletePlayer = deleteDirector;
window.openModal = openDirectorModal;
