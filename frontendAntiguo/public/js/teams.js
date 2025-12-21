/* eslint-env browser */
/* global fetch, document, window, confirm */

/* CARGAR Y ORDENAR */
async function loadTeams() {
  try {
    const res = await fetch('/api/teams');
    if (!res.ok) { throw new Error(`Error al obtener equipos: ${res.statusText}`); }

    let teams = await res.json();

    // 🔥 Ordenar por ID
    teams = teams.sort((a, b) => a.id - b.id);

    const table = document.getElementById('teamsTable');
    table.innerHTML = '';

    teams.forEach(t => {
      table.innerHTML += `
        <tr>
          <td>${t.id}</td>
          <td>${t.name}</td>
          <td>${t.city}</td>
          <td>${t.stadium}</td>
          <td>${t.year_foundation}</td>
          <td>
            <i class="fa-solid fa-pen-to-square action-btn edit" onclick="openTeamModal(${t.id})"></i>
            <i class="fa-solid fa-trash action-btn delete" onclick="deleteTeam(${t.id})"></i>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    throw new Error(`Error cargando equipos: ${err.message}`);
  }
}

/* AGREGAR */
document.getElementById('teamForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const newTeam = {
      name: document.getElementById('name').value,
      city: document.getElementById('city').value,
      stadium: document.getElementById('stadium').value,
      year_foundation: parseInt(document.getElementById('year').value)
    };

    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeam)
    });

    if (!res.ok) { throw new Error(`Error al agregar equipo: ${res.statusText}`); }

    e.target.reset();
    await loadTeams();

  } catch (err) {
    throw new Error(`Error al agregar equipo: ${err.message}`);
  }
});

/* ELIMINAR */
async function deleteTeam(id) {
  if (!confirm('¿Eliminar equipo?')) { return; }

  try {
    const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    if (!res.ok) { throw new Error(`Error al eliminar equipo: ${res.statusText}`); }

    await loadTeams();
  } catch (err) {
    throw new Error(`Error al eliminar equipo: ${err.message}`);
  }
}

/* ABRIR MODAL */
async function openTeamModal(id) {
  try {
    const res = await fetch(`/api/teams/${id}`);
    if (!res.ok) { throw new Error(`Error al obtener equipo: ${res.statusText}`); }

    const t = await res.json();

    document.getElementById('editId').value = t.id;
    document.getElementById('editName').value = t.name;
    document.getElementById('editCity').value = t.city;
    document.getElementById('editStadium').value = t.stadium;
    document.getElementById('editYear').value = t.year_foundation;

    document.getElementById('editModal').style.display = 'flex';
  } catch (err) {
    throw new Error(`Error abriendo modal: ${err.message}`);
  }
}

/* CERRAR */
function closeTeamModal() {
  document.getElementById('editModal').style.display = 'none';
}

/* GUARDAR CAMBIOS */
document.getElementById('editTeamForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const edited = {
      name: document.getElementById('editName').value,
      city: document.getElementById('editCity').value,
      stadium: document.getElementById('editStadium').value,
      year_foundation: parseInt(document.getElementById('editYear').value)
    };

    const id = document.getElementById('editId').value;

    const res = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edited)
    });

    if (!res.ok) { throw new Error(`Error al actualizar equipo: ${res.statusText}`); }

    closeTeamModal();
    await loadTeams();

  } catch (err) {
    throw new Error(`Error guardando cambios: ${err.message}`);
  }
});

/* CARGA INICIAL */
window.onload = loadTeams;
window.deletePlayer = deleteTeam;
window.openModal = openTeamModal;
