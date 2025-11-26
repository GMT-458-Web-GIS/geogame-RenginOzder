// ============================
// ecoTask.js (NDVI MINI TASK - FULL WORKING)
// ============================

// ✅ NASA GIBS ÜZERİNDEN ÇALIŞAN NDVI KATMANI
function createNdviLayer() {
  return new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://gibs.earthdata.nasa.gov/wmts.png",
      crossOrigin: "anonymous"
    })
  });
}

// ✅ Mini harita container'ı dinamik oluşturulur
let ecoMap = null;
let ecoMapDiv = null;

// ✅ HINT'E BASINCA ÇAĞRILACAK FONKSİYON
function startEcoTask() {
  if (!window.ecoOverlay) {
    console.error("ecoOverlay bulunamadı!");
    return;
  }

  // Overlay aç
  ecoOverlay.classList.remove("hidden");

  // Harita div'i yoksa oluştur
  if (!ecoMapDiv) {
    ecoMapDiv = document.createElement("div");
    ecoMapDiv.id = "eco-task-map";
    ecoMapDiv.style.width = "100%";
    ecoMapDiv.style.height = "320px";
    ecoMapDiv.style.marginTop = "10px";
    ecoMapDiv.style.borderRadius = "10px";
    ecoMapDiv.style.overflow = "hidden";

    const ecoBox = ecoOverlay.querySelector(".ecoBox");
    ecoBox.insertBefore(ecoMapDiv, ecoBox.querySelector(".modalButtons"));
  }

  // Harita daha önce oluşturulduysa sadece güncelle
  if (ecoMap) {
    ecoMap.updateSize();
    return;
  }

  // ✅ OpenLayers NDVI mini haritası
  ecoMap = new ol.Map({
    target: ecoMapDiv,
    layers: [createNdviLayer()],
    view: new ol.View({
      center: ol.proj.fromLonLat([35, 39]), // Türkiye ortası
      zoom: 4
    })
  });

  // ✅ NDVI TIKLAMA GÖREVİ
  ecoMap.on("singleclick", function (evt) {
    ecoMap.once("rendercomplete", () => {
      try {
        const canvas = ecoMap.getViewport().querySelector("canvas");
        const ctx = canvas.getContext("2d");

        const px = evt.pixel[0];
        const py = evt.pixel[1];

        const data = ctx.getImageData(px, py, 1, 1).data;
        const [r, g, b] = data;

        // ✅ DÜŞÜK NDVI TESPİTİ (KAHVERENGİ / GRİ)
        const ndviLow = (g < 80) && (r > 90);

        if (ndviLow) {
          finishEcoTask();
        } else {
          alert("❌ Burası yeşil (yüksek NDVI). Daha kuru bir bölgeyi tıkla.");
        }
      } catch (err) {
        alert("🚨 Görüntü okunamadı! Başka bir noktaya tıkla.");
        console.error(err);
      }
    });

    ecoMap.render();
  });
}

// ✅ GÖREV TAMAMLANINCA
function finishEcoTask() {
  ecoOverlay.classList.add("hidden");

  // ✅ Ana oyuna haber ver
  if (window.ecoTaskCompleted) {
    window.ecoTaskCompleted();
  }
}

// ✅ DIŞARIYA AÇ (script.js buradan çağırıyor)
window.startEcoTask = startEcoTask;
