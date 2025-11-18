/* eslint-env browser */
/* global fetch, document, window, confirm */


/* CARGAR Y ORDENAR */
async function loadTeams() {
  try {
    const res = await fetch('/api/teams');
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
    console.error('Error cargando equipos:', err);
  }
}

/* AGREGAR */
document.getElementById('teamForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newTeam = {
    name: document.getElementById('name').value,
    city: document.getElementById('city').value,
    stadium: document.getElementById('stadium').value,
    year_foundation: parseInt(document.getElementById('year').value)
  };

  await fetch('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTeam)
  });

  e.target.reset();
  loadTeams();
});

/* ELIMINAR */
async function deleteTeam(id) {
  if (!confirm('¿Eliminar equipo?')) { return; }

  await fetch(`/api/teams/${id}`, {
    method: 'DELETE'
  });

  loadTeams();
}

/* ABRIR MODAL */
async function openTeamModal(id) {
  const res = await fetch(`/api/teams/${id}`);
  const t = await res.json();

  document.getElementById('editId').value = t.id;
  document.getElementById('editName').value = t.name;
  document.getElementById('editCity').value = t.city;
  document.getElementById('editStadium').value = t.stadium;
  document.getElementById('editYear').value = t.year_foundation;

  document.getElementById('editModal').style.display = 'flex';
}

/* CERRAR */
function closeTeamModal() {
  document.getElementById('editModal').style.display = 'none';
}

/* GUARDAR CAMBIOS */
document.getElementById('editTeamForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const edited = {
    name: document.getElementById('editName').value,
    city: document.getElementById('editCity').value,
    stadium: document.getElementById('editStadium').value,
    year_foundation: parseInt(document.getElementById('editYear').value)
  };

  const id = document.getElementById('editId').value;

  await fetch(`/api/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(edited)
  });

  closeTeamModal();
  loadTeams();
});

/* CARGA INICIAL */
window.onload = loadTeams;
window.deletePlayer = deleteTeam;
window.openModal = openTeamModal;
