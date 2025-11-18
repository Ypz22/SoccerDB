async function loadTeams() {
  try {
    const res = await fetch('/api/teams');
    const teams = await res.json();

    const table = document.getElementById('teamsTable');
    table.innerHTML = '';

    teams.forEach(t => {
      table.innerHTML += `
                <tr>
                    <td>${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.city}</td>
                    <td>${t.year_foundation}</td>
                </tr>
            `;
    });

  } catch (err) {
    console.error('Error cargando equipos:', err);
  }
}

window.onload = loadTeams;
