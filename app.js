// app.js
    const hours = data.hours;
    const current = hours[0];

    // Actual
    document.getElementById("data").innerHTML = `
      🌡 Aire: ${current.airTemperature.noaa} °C<br>
      🌊 Agua: ${current.waterTemperature.noaa} °C<br>
      🌊 Oleaje: ${current.waveHeight.noaa} m<br>
      💨 Viento: ${current.windSpeed.noaa} m/s<br>
      🧭 Dirección: ${current.windDirection.noaa}°<br>
      📊 Presión: ${current.pressure.noaa} hPa
    `;

    drawWind(lat, lon, current.windDirection.noaa);

    // Forecast 12h
    let forecastHTML = "";
    hours.slice(0, 12).forEach(h => {
      forecastHTML += `
        🕒 ${h.time.slice(11,16)} | 🌊 ${h.waveHeight.noaa}m | 💨 ${h.windSpeed.noaa}m/s<br>
      `;
    });
    document.getElementById("forecast").innerHTML = forecastHTML;

    // Fishing logic
    evaluateFishing(current);

  } catch (err) {
    document.getElementById("data").innerHTML = "❌ Error cargando datos";
  }
}

function evaluateFishing(d) {
  let score = 0;

  if (d.waveHeight.noaa < 1.5) score++;
  if (d.windSpeed.noaa < 6) score++;
  if (d.pressure.noaa > 1010) score++;

  let result = "";

  if (score >= 3) result = "🔥 Muy buenas condiciones";
  else if (score === 2) result = "👍 Condiciones decentes";
  else result = "⚠️ Malas condiciones";

  document.getElementById("fishing").innerHTML = result;
}

function drawWind(lat, lon, deg) {
  if (windLayer) map.removeLayer(windLayer);

  const len = 0.2;
  const rad = deg * Math.PI / 180;

  const lat2 = lat + len * Math.cos(rad);
  const lon2 = lon + len * Math.sin(rad);

  windLayer = L.polyline([[lat, lon], [lat2, lon2]], {
    color: 'cyan', weight: 3
  }).addTo(map);
}

map.on('click', (e) => {
  const { lat, lng } = e.latlng;

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);

  getMarineData(lat, lng);
});

// Spots
fetch('./spots.json')
  .then(res => res.json())
  .then(spots => {
    spots.forEach(s => {
      L.marker([s.lat, s.lon]).addTo(map)
        .bindPopup(`<b>${s.name}</b><br>🐟 ${s.species.join(', ')}`);
    });
  })
  .catch(() => console.log("Error cargando spots"));

// Geolocalización
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 10);

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup("📍 Tu posición").openPopup();
  });
}
