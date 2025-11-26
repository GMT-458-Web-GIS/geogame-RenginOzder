// ---------------------
// HueQuest main script
// ---------------------

// --- Game state ---
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// --- HTML elements ---
const startModal = document.getElementById("startModal");
const startBtn = document.getElementById("startBtn");
const questionPanel = document.getElementById("questionPanel");
const scoreSpan = document.getElementById("score");
const progressNum = document.getElementById("progressNum");
const totalNum = document.getElementById("totalNum");
const hintBtn = document.getElementById("hintBtn");
const hintBox = document.getElementById("hintText");
const passBtn = document.getElementById("passBtn");
const ecoOverlay = document.getElementById("ecoOverlay");
const ecoTaskArea = document.getElementById("ecoTaskArea");
const cancelEco = document.getElementById("cancelEco");

// ---------------------
// Load questions
// ---------------------
fetch("question.json")
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data);
    totalNum.textContent = questions.length;

    // ✅ Butonu AKTİF hale getir
    startBtn.disabled = false;

    // ✅ TEK ve DOĞRU start event
    startBtn.onclick = () => {
      if (questions.length === 0) {
        alert("Questions not loaded!");
        return;
      }

      startModal.classList.add("hidden");
      score = 0;
      currentQuestionIndex = 0;
      scoreSpan.textContent = score;
      showNextQuestion();
    };
  })
  .catch(err => {
    console.error("Failed to load questions:", err);
    alert("question.json yüklenmedi!");
  });

// ---------------------
// Shuffle helper
// ---------------------
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ---------------------
// Show next question
// ---------------------
function showNextQuestion() {
  if (currentQuestionIndex >= questions.length) {
    questionPanel.textContent = "🎉 You finished the game!";
    return;
  }
  const q = questions[currentQuestionIndex];
  questionPanel.textContent = q.question || "Question not found!";
  hintBox.textContent = "none";
  progressNum.textContent = currentQuestionIndex + 1;
}

// ---------------------
// Load question (global, sadece showNextQuestion'i çağırır)
// ---------------------
function loadQuestion() {
  showNextQuestion();
}


// ---------------------
// Map setup (OpenLayers)
// ---------------------
const map = new ol.Map({
  target: "map",
  layers: [ new ol.layer.Tile({ source: new ol.source.OSM() }) ],
  view: new ol.View({
    center: ol.proj.fromLonLat([35,39]),
    zoom: 5
  })
});

// ---------------------
// Turkey cities markers
// ---------------------
const cities = {
"Adana":[35.3213,37.0000],"Adıyaman":[38.2766,37.7648],"Afyonkarahisar":[30.5423,38.7560],
  "Ağrı":[43.0510,39.7191],"Amasya":[35.8353,40.6537],"Ankara":[32.8597,39.9334],
  "Antalya":[30.7016,36.8969],"Artvin":[41.1828,41.1828],"Aydın":[27.8456,37.8450],
  "Balıkesir":[27.8923,39.6483],"Bilecik":[29.9761,40.1500],"Bingöl":[40.4989,38.8847],
  "Bitlis":[42.1120,38.4000],"Bolu":[31.6066,40.7378],"Burdur":[30.2834,37.7200],
  "Bursa":[29.0629,40.1950],"Çanakkale":[26.4142,40.1550],"Çankırı":[33.6167,40.6000],
  "Çorum":[34.9530,40.5500],"Denizli":[29.0864,37.7765],"Diyarbakır":[40.2221,37.9138],
  "Edirne":[26.5550,41.6818],"Elazığ":[39.2220,38.6740],"Erzincan":[39.4910,39.7500],
  "Erzurum":[41.2700,39.9000],"Eskişehir":[30.5200,39.7767],"Gaziantep":[37.3833,37.0662],
  "Giresun":[38.3895,40.9128],"Gümüşhane":[39.4890,40.4600],"Hakkari":[43.7400,37.5740],
  "Hatay":[36.2028,36.1731],"Isparta":[30.5655,37.7648],"Mersin":[34.6401,36.8121],
  "İstanbul":[28.9784,41.0082],"İzmir":[27.1456,38.4237],"Kars":[43.0970,40.6012],
  "Kastamonu":[33.7750,41.3780],"Kayseri":[35.4930,38.7320],"Kırklareli":[27.2250,41.7350],
  "Kırşehir":[34.1700,39.1410],"Kocaeli":[29.9400,40.7650],"Konya":[32.4833,37.8667],
  "Kütahya":[29.9833,39.4167],"Malatya":[38.3550,38.3550],"Manisa":[27.4316,38.6190],
  "Kahramanmaraş":[36.9260,37.5850],"Mardin":[40.7430,37.3120],"Muğla":[28.3667,37.2150],
  "Muş":[41.4900,38.7430],"Nevşehir":[34.7180,38.6240],"Niğde":[34.6800,37.9660],
  "Ordu":[37.8781,40.9850],"Rize":[40.5100,41.0200],"Sakarya":[30.4030,40.7760],
  "Samsun":[36.3300,41.2860],"Siirt":[41.9333,37.9333],"Sinop":[35.1550,42.0230],
  "Sivas":[37.0167,39.7480],"Tekirdağ":[27.5150,40.9833],"Tokat":[36.5550,40.3130],
  "Trabzon":[39.7300,41.0000],"Tunceli":[39.1070,39.1080],"Şanlıurfa":[38.7920,37.1670],
  "Uşak":[29.4030,38.6740],"Van":[43.3833,38.4940],"Yozgat":[34.8070,39.8200],
  "Zonguldak":[31.7860,41.4500],"Aksaray":[34.0260,38.3680],"Bayburt":[40.2580,40.2570],
  "Karaman":[33.2150,37.1810],"Kırıkkale":[33.5160,39.8450],"Batman":[41.1370,37.8870],
  "Şırnak":[42.4880,37.5030],"Bartın":[32.3330,41.6330],"Ardahan":[42.7020,41.1100],
  "Iğdır":[44.0080,39.9170],"Yalova":[29.2740,40.6500],"Karabük":[32.6150,41.2000],
  "Kilis":[36.7160,36.7160],"Osmaniye":[36.2330,37.0740],"Düzce":[31.1660,40.8430]
};


const markers = [];
for (const [name, coords] of Object.entries(cities)) {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(coords)),
    name: name
  });
  markers.push(marker);
}

const vectorSource = new ol.source.Vector({ features: markers });
const markerLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 4,
      fill: new ol.style.Fill({ color: 'rgba(0,0,0,0)' }), // içi boş
      stroke: new ol.style.Stroke({ color: '#0d1b4c', width: 2 }) // lacivert
    })
  })
});
map.addLayer(markerLayer);

// ---------------------
// Map click handler
// ---------------------
map.on('singleclick', function(evt) {
  map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    const cityName = feature.get('name');
    if (!cityName || questions.length === 0) return;

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    if (cityName === currentQ.name) {
      score += 10;
      scoreSpan.textContent = score;
      alert(`✅ Correct! ${cityName}`);
      currentQuestionIndex++;
      showNextQuestion();
    } else {
      alert(`❌ Wrong! Try again.`);
    }
  });
});

// ---------------------
// Hint & Eco mini-task
// ---------------------
hintBtn.addEventListener("click", () => ecoOverlay.classList.remove("hidden"));

ecoTaskArea.querySelectorAll(".trash").forEach(el => {
  el.addEventListener("click", () => {
    el.classList.add("collected");
    const remaining = ecoTaskArea.querySelectorAll(".trash:not(.collected)");
    if (remaining.length === 0) {
      ecoOverlay.classList.add("hidden");
      const currentQ = questions[currentQuestionIndex];
      hintBox.textContent = currentQ ? currentQ.hints.join(', ') : "No hint available";
      score = Math.max(score - 20,0);
      scoreSpan.textContent = score;
      ecoTaskArea.querySelectorAll(".trash").forEach(t => t.classList.remove("collected"));
    }
  });
});

cancelEco.addEventListener("click", () => ecoOverlay.classList.add("hidden"));

passBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  showNextQuestion();
});
