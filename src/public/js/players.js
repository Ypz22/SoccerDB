/* eslint-env browser */
/* global fetch, document, window, confirm */

const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

/* CARGAR Y ORDENAR */
async function loadPlayers() {
  try {
    const res = await fetch('/api/players');
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
    logger.error('Error cargando jugadores:', err);
  }
}

/* AGREGAR */
document.getElementById('playerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPlayer = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    edad: parseInt(document.getElementById('edad').value),
    altura: parseFloat(document.getElementById('altura').value),
    pierna_buena: document.getElementById('pierna_buena').value,
    club: document.getElementById('club').value
  };

  await fetch('/api/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPlayer)
  });

  e.target.reset();
  loadPlayers();
});

/* ELIMINAR */
async function deletePlayer(id) {
  if (!confirm('¿Eliminar jugador?')) { return; };

  await fetch(`/api/players/${id}`, {
    method: 'DELETE'
  });

  loadPlayers();
}

/* ABRIR MODAL */
async function openModal(id) {
  const res = await fetch(`/api/players/${id}`);
  const p = await res.json();

  document.getElementById('editId').value = p.id;
  document.getElementById('editNombre').value = p.nombre;
  document.getElementById('editApellido').value = p.apellido;
  document.getElementById('editEdad').value = p.edad;
  document.getElementById('editAltura').value = p.altura;
  document.getElementById('editPiernaBuena').value = p.pierna_buena;
  document.getElementById('editClub').value = p.club;

  document.getElementById('editModal').style.display = 'flex';
}

/* CERRAR */
function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

/* GUARDAR CAMBIOS */
document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const edited = {
    nombre: document.getElementById('editNombre').value,
    apellido: document.getElementById('editApellido').value,
    edad: parseInt(document.getElementById('editEdad').value),
    altura: parseFloat(document.getElementById('editAltura').value),
    pierna_buena: document.getElementById('editPiernaBuena').value,
    club: document.getElementById('editClub').value
  };

  const id = document.getElementById('editId').value;

  await fetch(`/api/players/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(edited)
  });

  closeModal();
  loadPlayers();
});

/* CARGA INICIAL */
window.onload = loadPlayers;
window.deletePlayer = deletePlayer;
window.openModal = openModal;

