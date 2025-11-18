/* eslint-env browser */
/* global fetch, document, window, confirm */

const API_URL = '/api/directors';

async function loadDirectors() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
        let directors = await res.json();
        directors = directors.sort((a, b) => a.id - b.id);

        const table = document.getElementById('directorsTable');
        table.innerHTML = '';

        directors.forEach(t => {
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
        const table = document.getElementById('directorsTable');
        table.innerHTML = '<tr><td colspan="9">Error al cargar datos o no hay conexión.</td></tr>';
        throw new Error(`Error cargando directores técnicos: ${err.message}`);
    }
}

document.getElementById('directorForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newDirector = {
        name: document.getElementById('name').value,
        nationality: document.getElementById('nationality').value,
        age: parseInt(document.getElementById('age').value),
        currentTeam: document.getElementById('currentTeam').value,
        yearsExperience: parseInt(document.getElementById('yearsExperience').value),
        email: document.getElementById('email').value,
        cellphone: document.getElementById('cellphone').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDirector)
        });
        if (!res.ok) { throw new Error(`Error creando director: ${res.status}`); }
    } catch (err) {
        throw new Error(`Error al crear director técnico: ${err.message}`);
    }

    e.target.reset();
    await loadDirectors();
});

async function deleteDirector(id) {
    if (!confirm(`¿Eliminar Director Técnico con ID ${id}?`)) { return; }

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) { throw new Error(`Error eliminando director: ${res.status}`); }
    } catch (err) {
        throw new Error(`Error al eliminar director técnico: ${err.message}`);
    }

    await loadDirectors();
}

async function openDirectorModal(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) { throw new Error('Director no encontrado.'); }
        const t = await res.json();

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
        throw new Error(`Error abriendo modal: ${err.message}`);
    }
}

function closeDirectorModal() {
    document.getElementById('editModal').style.display = 'none';
}

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
        if (!res.ok) { throw new Error(`Error actualizando director: ${res.status}`); }
    } catch (err) {
        throw new Error(`Error al actualizar director técnico: ${err.message}`);
    }

    closeDirectorModal();
    await loadDirectors();
});

window.onload = loadDirectors;
window.deletePlayer = deleteDirector;
window.openModal = openDirectorModal;
