## HueQuest — First Draft / Design Document

HueQuest is a web-based, map-driven treasure hunt game designed to take the player on a humorous and lively journey across all 81 provinces of Türkiye. The game blends cultural exploration with light ecological awareness, but in a way that stays playful rather than didactic. Each province presents a short, funny question about a well-known cultural site, museum, natural landmark or culinary specialty. The tone is deliberately warm and slightly mischievous—HueQuest never asks the player to “recall factual data”; instead it teases, hints, jokes and nudges. The task is simple: find the correct location on the map using only your intuition, your sense of humor, and eventually a hint or two if you get stuck.

Hints, however, are not free. In HueQuest the player must earn them through tiny ecological mini-tasks, all of which take only a few seconds and are meant to feel more like toys than challenges. For example, a little patch of grass may appear cluttered with cigarette butts, and the game insists that “there’s no way I can concentrate on culture before you clean this mess.” Sometimes small clouds drift over the map and the player is asked to swipe them away; sometimes a lonely sapling needs watering; sometimes a plastic ring must be removed from a bird’s foot; sometimes bits of trash float in a cartoon sea and must be fished out. These tasks do not punish the player—they amuse, distract, and open the way for a new clue. Once the task is completed, the game grants a playful hint such as “now that the sky is finally clear, I’m getting a strong Ege breeze from this one” or “after rescuing that bird, my inner compass says this city is way up in the mountains.”

Each province allows a maximum of three hints, and the final hint is always slightly more direct than the rest—though never fully explicit. If the player still cannot locate the cultural site after using all three, the round ends with a deliberately dramatic “You lost… but at least the environment looks great now!” screen. The player then moves on to the next province, trying to maintain momentum and confidence. If all eighty-one provinces are successfully solved, HueQuest crowns the player with the title of “HueMaster,” a playful nod to both the name of the game and the idea of completing a full national cultural tour.

The spatial component of the game is entirely browser-based and uses OpenLayers (or Leaflet) to display Türkiye’s basemap and handle user interactions such as mouse clicks, map movement and marker placement. All cultural data used for the questions—museums, archaeological sites and natural landmarks—will be drawn from publicly available datasets such as the Kültür Portalı and other open data sources. Each province is associated with one curated cultural point, and each point has an accompanying humorous question and three progressively more helpful hints. All ecological mini-tasks operate as small HTML/JS overlays that temporarily sit above the map before returning control to the player.

HueQuest progresses province by province, and the scoring system reflects both speed and efficiency: players earn higher scores when they locate cultural points quickly and when they use fewer hints. The atmosphere remains light even in the scoring system—the game often comments on the player’s pace with lines like “wow, you found that faster than the tea gets cold in Rize” or “you took your time, but precision is an art.”

In terms of layout, the game occupies the screen with a clean central map and playful dialogue elements around it. The main question and collected hints appear on a soft, rounded panel near the top; the ecological mini-tasks slide in as small cartoon scenes; and a compact progress bar quietly tracks how many of the eighty-one provinces have been completed. Everything is designed to be readable, friendly and colorful—true to the “Hue” in HueQuest, which also echoes the name Rengin.

HueQuest fulfills all requirements of the design stage of the GeoGame assignment: it presents a clear interactive map component, a well-defined gameplay logic, a temporal-strategic scoring element, a coherent visual layout plan, an external data source, and a creative mechanic that ties spatial decisions to playful ecological actions. Although humorous and lighthearted in tone, the underlying design is carefully structured and entirely feasible to implement as a web-based GIS application. The game’s aim is not only to guide players across Türkiye’s cultural landscape, but also to give them a joyful sense of exploration—one province, one joke, and one tiny ecological act at a time.

Frontend Requirements
HueQuest’s frontend is designed as a full-screen, map-centric interface. The core element is an OpenLayers basemap that responds instantly to user interactions. Floating UI components sit above the map without obstructing exploration:

A Question Panel at the top center containing the cultural question and unlocked hints.
A Hint Button, positioned near the panel, which triggers ecological mini-tasks.
A Progress Tracker showing “Province X of 81.”
Animated Feedback Badges appearing after correct or incorrect guesses.
Hint Micro-Task Overlay, which darkens the map and displays the animated task.
The interface remains fluid, playful, colorful, and highly readable. No page reloads occur; all interactions happen through JavaScript events and dynamic DOM updates.

**Layout Description & Sketches (to be added as PNG)**
*1. Main Game Screen*
A full-screen Türkiye map is the background. The Question Panel floats at the top as a rounded, semi-transparent box. The Hint Button hovers to its right. A small progress indicator sits at the bottom left. The rest of the screen is dedicated to exploration and clicking potential answers. image
<img width="1899" height="907" alt="Ekran görüntüsü 2025-11-16 131818" src="https://github.com/user-attachments/assets/064b7a20-8669-4c8a-bc35-a683c6f70550" />

*2. Ecological Mini-Task Overlay*
When requesting a hint, the map dims and a playful animated environment appears—trash to clean, clouds to swipe, a sapling to water, a sea to tidy up. Completing the task fades the overlay back into the map, unlocking the hint. image image image
<img width="1910" height="896" alt="Ekran görüntüsü 2025-11-16 133652" src="https://github.com/user-attachments/assets/f0ec4690-26de-4f6e-a7e9-91fb8ccd34ec" />
<img width="1910" height="901" alt="Ekran görüntüsü 2025-11-16 133830" src="https://github.com/user-attachments/assets/badb991e-578c-4279-a97e-3b85e87fa987" />
<img width="1917" height="901" alt="Ekran görüntüsü 2025-11-16 133848" src="https://github.com/user-attachments/assets/f36c517f-8434-4203-93af-7fc746ae2e90" />

*3. Final Score / HueMaster Screen*
Once all provinces are completed, a celebratory overlay appears with a large HueMaster badge, the final score, and a chart visualizing player performance. A restart and “replay provinces” option is included. image
<img width="1911" height="897" alt="Ekran görüntüsü 2025-11-16 133100" src="https://github.com/user-attachments/assets/e37d7095-0775-43dc-9331-d9237a792492" />

**Game Progression**
HueQuest progresses province by province, in a fixed sequence or randomized order. For each province:

The game displays one cultural question.
The player navigates the map and clicks the location they believe is correct.
If incorrect, they may request a hint, unlocked through an ecological mini-task.
Up to three hints are available.
If all hints are used and the location is still not found, the game marks the province as failed and automatically moves on.
The game ends when all 81 provinces have been attempted. Speed and number of hints affect scoring.

**Number of Questions**
There are 81 questions — one for each province of Türkiye.
No sub-questions or bonus rounds are included at this stage.

**Life System**
HueQuest does not use traditional “lives.”
Instead, each province grants three hints, which act as a soft life system:

Hint 1 → vague, humorous
Hint 2 → slightly more helpful
Hint 3 → almost direct but still playful
Failing after all hints simply moves the game forward—no hard game over.

JavaScript Libraries Used (Expanded)
Core Mapping

OpenLayers — main mapping engine

GeoJSON (native) — data structure for cultural points

Geospatial Logic

Turf.js — distance, geometry checks, buffer regions

UI & Animation

GSAP (GreenSock) — smooth animations for panels, overlays

Anime.js — lightweight hint reveal and micro-task animations

Howler.js — optional sound effects (success, failure, hint unlock)

Data Visualization (bonus for advanced geovisualisation)

D3.js — animated scoring charts

Chart.js — simpler bar/pie charts for final screen

Deck.gl — GPU-accelerated map layers, glowing outlines, province highlights

Three.js — optional 3D HueMaster badge or fun transitions

State & Storage
LocalStorage API — basic save system
LocalForage — async saving for larger datasets 

<img width="541" height="576" alt="HueQuest_EcoIcons_Flowchart drawio" src="https://github.com/user-attachments/assets/c18d9511-aa69-401c-ba17-f1e40faad09a" />

