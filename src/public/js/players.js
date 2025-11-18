/* eslint-env browser */
/* global fetch, document, window, confirm */

/* CARGAR Y ORDENAR */
async function loadPlayers() {
  try {
    const res = await fetch('/api/players');
    if (!res.ok) { throw new Error(`Error al obtener jugadores: ${res.statusText}`); }

    let players = await res.json();

    // Ordenar IDs
    players = players.sort((a, b) => a.id - b.id);

    const table = document.getElementById('playersTable');
    table.innerHTML = '';

    players.forEach(p => {
      table.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.apellido}</td>
            <td>${p.edad}</td>
            <td>${p.altura}</td>
            <td>${p.pierna_buena}</td>
            <td>${p.club}</td>
            <td>
                <i class="fa-solid fa-pen-to-square action-btn edit" onclick="openModal(${p.id})"></i>
                <i class="fa-solid fa-trash action-btn delete" onclick="deletePlayer(${p.id})"></i>
            </td>
        </tr>
      `;
    });

  } catch (err) {
    throw new Error(`Error cargando jugadores: ${err.message}`);
  }
}

/* AGREGAR */
document.getElementById('playerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const newPlayer = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      edad: parseInt(document.getElementById('edad').value),
      altura: parseFloat(document.getElementById('altura').value),
      pierna_buena: document.getElementById('pierna_buena').value,
      club: document.getElementById('club').value
    };

    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlayer)
    });

    if (!res.ok) { throw new Error(`Error al agregar jugador: ${res.statusText}`); }

    e.target.reset();
    await loadPlayers();

  } catch (err) {
    throw new Error(`Error al agregar jugador: ${err.message}`);
  }
});

/* ELIMINAR */
async function deletePlayer(id) {
  if (!confirm('¿Eliminar jugador?')) { return; }

  try {
    const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
    if (!res.ok) { throw new Error(`Error al eliminar jugador: ${res.statusText}`); }

    await loadPlayers();
  } catch (err) {
    throw new Error(`Error al eliminar jugador: ${err.message}`);
  }
}

/* ABRIR MODAL */
async function openModal(id) {
  try {
    const res = await fetch(`/api/players/${id}`);
    if (!res.ok) { throw new Error(`Error al obtener jugador: ${res.statusText}`); }

    const p = await res.json();

    document.getElementById('editId').value = p.id;
    document.getElementById('editNombre').value = p.nombre;
    document.getElementById('editApellido').value = p.apellido;
    document.getElementById('editEdad').value = p.edad;
    document.getElementById('editAltura').value = p.altura;
    document.getElementById('editPiernaBuena').value = p.pierna_buena;
    document.getElementById('editClub').value = p.club;

    document.getElementById('editModal').style.display = 'flex';
  } catch (err) {
    throw new Error(`Error abriendo modal: ${err.message}`);
  }
}

/* CERRAR */
function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

/* GUARDAR CAMBIOS */
document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const edited = {
      nombre: document.getElementById('editNombre').value,
      apellido: document.getElementById('editApellido').value,
      edad: parseInt(document.getElementById('editEdad').value),
      altura: parseFloat(document.getElementById('editAltura').value),
      pierna_buena: document.getElementById('editPiernaBuena').value,
      club: document.getElementById('editClub').value
    };

    const id = document.getElementById('editId').value;

    const res = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edited)
    });

    if (!res.ok) { throw new Error(`Error al actualizar jugador: ${res.statusText}`); }

    closeModal();
    await loadPlayers();
  } catch (err) {
    throw new Error(`Error guardando cambios: ${err.message}`);
  }
});

/* CARGA INICIAL */
window.onload = loadPlayers;
window.deletePlayer = deletePlayer;
window.openModal = openModal;
