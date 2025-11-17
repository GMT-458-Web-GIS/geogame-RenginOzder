// ecoTask.js

// Eco task setup
export function initEcoTask({
  ecoOverlay,      // Overlay div
  ecoTaskArea,     // Task area div
  hintCallback     // Bu callback, task tamamlandığında çalışacak
}) {
  // Task öğeleri (örnek: çöp, bulut, fidan, deniz)
  const taskElements = [
    { type: "trash", label: "🗑️" },
    { type: "cloud", label: "☁️" },
    { type: "sapling", label: "🌱" },
    { type: "sea", label: "🌊" }
  ];

  // Overlay içini temizle
  ecoTaskArea.innerHTML = "";

  // Her öğeyi ekle
  taskElements.forEach(item => {
    const el = document.createElement("div");
    el.classList.add("eco-item", item.type);
    el.textContent = item.label;
    el.dataset.collected = "false";
    ecoTaskArea.appendChild(el);

    // Tıklama eventi
    el.addEventListener("click", () => {
      if (el.dataset.collected === "false") {
        el.dataset.collected = "true";
        el.classList.add("collected");
      }

      // Task tamam mı?
      const remaining = ecoTaskArea.querySelectorAll("[data-collected='false']");
      if (remaining.length === 0) {
        // Tüm görev tamamlandı
        ecoOverlay.classList.add("hidden");
        if (typeof hintCallback === "function") {
          hintCallback();  // Hint açılacak
        }

        // Sıfırla
        ecoTaskArea.querySelectorAll(".eco-item").forEach(it => {
          it.dataset.collected = "false";
          it.classList.remove("collected");
        });
      }
    });
  });

  // Cancel butonu
  const cancelBtn = ecoOverlay.querySelector("#cancelEco");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      ecoOverlay.classList.add("hidden");
    });
  }
}

// Overlay’i gösterme fonksiyonu
export function openEcoOverlay(ecoOverlay) {
  ecoOverlay.classList.remove("hidden");
}
