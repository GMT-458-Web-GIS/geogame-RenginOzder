// ---------------------
// ecoTask.js — AirGuard Smog Cleaner (HueQuest FINAL)
// ---------------------

document.addEventListener("DOMContentLoaded", () => {

  const ecoArea = document.getElementById("ecoTaskArea");
  const ecoOverlay = document.getElementById("ecoOverlay");

  let targetPM = 25;
  let currentPM = 0;
  let ecoActive = false;
  let smogLayer = null;

  // ✅ DIŞARIDAN HINT TETİKLEME
  window.startEcoTask = function () {
    if (!ecoOverlay || !ecoArea) {
      alert("EcoTask UI bulunamadı!");
      return;
    }

    ecoOverlay.classList.remove("hidden");
    ecoArea.innerHTML = "";
    ecoActive = true;
    window.ecoTaskReadyToClose = false;

    const q = window.getCurrentQuestion();
    const city = q ? q.name : "Mardin";

    // ✅ ECO AREA TEMEL STİL
    ecoArea.style.position = "relative";
    ecoArea.style.padding = "12px";
    ecoArea.style.color = "white";

    // ✅ ŞEHRE GÖRE UYDU ARKA PLAN (OTOMATİK)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
      .then(res => res.json())
      .then(loc => {
        if (loc.length > 0) {
          const lat = loc[0].lat;
          const lon = loc[0].lon;

          const bbox = `${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}`;

          ecoArea.style.backgroundImage = `
            url("https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${bbox}&bboxSR=4326&size=900,400&imageSR=4326&f=image")
          `;
          ecoArea.style.backgroundSize = "cover";
          ecoArea.style.backgroundPosition = "center";
        }
      });

    // ✅ BİLGİ ALANI
    const info = document.createElement("div");
    info.id = "airInfo";
    info.style.color = "white";
    info.style.background = "rgba(0,0,0,0.55)";
    info.style.padding = "8px";
    info.style.borderRadius = "6px";
    info.style.marginBottom = "10px";
    info.innerHTML = `
      <p><b>City cannot breathe, please clean…</b></p>
      <p>PM2.5: <span id="pmValue">--</span></p>
      <p>Clean the smog to unlock the hint 😶‍🌫️</p>
    `;
    ecoArea.appendChild(info);

    // ✅ SMOG KATMANI
    smogLayer = document.createElement("div");
    smogLayer.id = "smogLayer";
    smogLayer.style.width = "100%";
    smogLayer.style.height = "220px";
    smogLayer.style.background = "rgba(120,120,120,0.85)";
    smogLayer.style.cursor = "pointer";
    smogLayer.style.display = "flex";
    smogLayer.style.alignItems = "center";
    smogLayer.style.justifyContent = "center";
    smogLayer.style.fontSize = "20px";
    smogLayer.style.fontWeight = "bold";
    smogLayer.innerText = "💨 Clean the Smog! 💨";
    ecoArea.appendChild(smogLayer);

    smogLayer.addEventListener("mousemove", cleanSmog);

    // ✅ SAĞ ÜST X BUTONU
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "6px";
    closeBtn.style.right = "10px";
    closeBtn.style.fontSize = "22px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.color = "white";
    closeBtn.style.fontWeight = "bold";

    closeBtn.onclick = () => {
      ecoOverlay.classList.add("hidden");

      if (window.ecoTaskReadyToClose) {
        window.ecoTaskReadyToClose = false;
        if (window.ecoTaskCompleted) window.ecoTaskCompleted(); 
      }
    };

    ecoArea.appendChild(closeBtn);

    // ✅ OPENAQ GERÇEK VERİ + YEDEK SİMÜLASYON
    fetch(`https://api.openaq.org/v2/latest?limit=1&city=${city}`)
      .then(res => res.json())
      .then(data => {
        const pm = data.results?.[0]?.measurements?.find(m => m.parameter === "pm25");
        currentPM = pm ? Math.round(pm.value) : 65;
        document.getElementById("pmValue").textContent = currentPM;
      })
      .catch(() => {
        currentPM = Math.floor(Math.random() * 40) + 50;
        document.getElementById("pmValue").textContent = currentPM;
      });
  };

  // ✅ SMOG TEMİZLEME MEKANİĞİ
  function cleanSmog() {
    if (!ecoActive) return;

    currentPM -= 1;
    document.getElementById("pmValue").textContent = currentPM;

    const opacity = Math.max(currentPM / 100, 0.05);
    smogLayer.style.background = `rgba(120,120,120,${opacity})`;

    if (currentPM <= targetPM) {
      ecoActive = false;
      smogLayer.innerText = "🏞️ Atmosphere Clean! You may now close this window.";
      window.ecoTaskReadyToClose = true; 
    }
  }

});
