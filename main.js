<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>-eagle_bd — Sultan 47 Sovereign Engine v19.2</title>
<style>
  body { margin:0; background:#0f380f; font-family:'Courier New',monospace; color:#9bbc0f; overflow:hidden; }
  canvas { image-rendering:pixelated; border:4px solid #8bac0f; margin:auto; }
  .ui { background:#0f380f; border-top:4px solid #8bac0f; padding:8px; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
  button { background:#8bac0f; color:#0f380f; border:3px solid #0f380f; font-weight:bold; padding:12px 18px; font-size:18px; cursor:pointer; }
  button:active { transform:scale(0.95); }
  #textOutputEl { position:absolute; top:20px; left:50%; transform:translateX(-50%); background:#0f380f; border:4px solid #9bbc0f; padding:12px 24px; font-size:18px; max-width:80%; display:none; z-index:100; }
  #menuOverlayEl, #battleMenuEl, #skillTreeEl { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15,56,15,0.97); display:none; flex-direction:column; align-items:center; padding-top:10px; z-index:200; overflow:hidden; }
  #skillTreeCanvas { border:3px solid #9bbc0f; background:#0a1f0a; image-rendering:pixelated; }
  .log { background:#000; color:#9bbc0f; padding:8px; margin:4px; max-height:160px; overflow-y:auto; width:90%; font-size:15px; }
</style>
</head>
<body>

<div id="gameContainer">
  <canvas id="overworldCanvasEl" width="320" height="240"></canvas>
  <div class="ui">
    <button id="btnUp">↑</button>
    <button id="btnLeft">←</button>
    <button id="btnAEl">A</button>
    <button id="btnRight">→</button>
    <button id="btnDown">↓</button>
    <button id="btnBEl">B (Party)</button>
    <button onclick="toggleDungeon()">Dungeon</button>
  </div>
  <div id="textOutputEl"></div>
  <div id="menuOverlayEl"></div>
  <div id="battleMenuEl">
    <div style="color:#a9364a;font-size:22px;margin:10px;">BATTLE</div>
    <div id="battleLogEl" class="log"></div>
    <div id="battleActions" style="width:90%;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;"></div>
  </div>
  <div id="skillTreeEl">
    <div style="color:#9bbc0f;font-size:22px;margin-bottom:8px;">SOVEREIGN SKILL TREE</div>
    <canvas id="skillTreeCanvas" width="300" height="420"></canvas>
    <div style="margin-top:10px;">
      <span id="skillPointsDisplay" style="color:#a9364a;font-size:18px;"></span>
      <button onclick="closeSkillTree()" style="margin-left:20px;">Close Tree</button>
    </div>
  </div>
</div>

<script>
// =============================================
// Sultan 47 Sovereign Engine v19.2 — VISUAL SKILL TREE GRAPH
// =============================================

const DOM = {
  canvas: document.getElementById('overworldCanvasEl'),
  textOutput: document.getElementById('textOutputEl'),
  menuOverlay: document.getElementById('menuOverlayEl'),
  battleMenu: document.getElementById('battleMenuEl'),
  battleLog: document.getElementById('battleLogEl'),
  battleActions: document.getElementById('battleActions'),
  skillTreeEl: document.getElementById('skillTreeEl'),
  skillTreeCanvas: document.getElementById('skillTreeCanvas'),
  skillPointsDisplay: document.getElementById('skillPointsDisplay')
};

const ctx = DOM.canvas.getContext('2d');
const skillCtx = DOM.skillTreeCanvas.getContext('2d');

const TILE_SIZE = 16;
const MAP_W = 20;
const MAP_H = 15;

// Audio, TILE_IMAGES, ENEMY_SPRITES, player, companions, EQUIPMENT, RECIPES, ENEMY_TYPES, worldMap, dungeonMap, etc.
// (All kept identical to previous version — paste them here from v19.1 if needed)

let skillPoints = { player: 3, 1: 3, 2: 3 }; // starting points for demo
let currentSkillUnit = null; // the unit whose tree is open (-1 = player, 0/1 = companions)

// ====================== SKILL TREES (same as v19.1) ======================
function defineSkillTrees() {
  companions[0].skills = [ // Kael
    { id:1, name:"Power Strike", branch:"DPS", dmg:12, cost:2, effect:null, unlocked:true, reqLvl:1, reqSkill:null, x:80, y:60 },
    { id:2, name:"Shield Bash", branch:"Defender", dmg:7, cost:1, effect:"stun", unlocked:true, reqLvl:1, reqSkill:null, x:220, y:60 },
    { id:3, name:"Iron Fortress", branch:"Defender", dmg:0, cost:3, effect:"taunt+def", unlocked:false, reqLvl:3, reqSkill:2, x:220, y:150 },
    { id:4, name:"Recursion Slash", branch:"DPS", dmg:18, cost:4, effect:"reflect", unlocked:false, reqLvl:5, reqSkill:1, x:80, y:150 },
    { id:5, name:"Strand Breaker", branch:"DPS", dmg:25, cost:6, effect:"stun2", unlocked:false, reqLvl:8, reqSkill:4, x:80, y:240 },
    { id:6, name:"Sovereign Guard", branch:"Defender", dmg:0, cost:5, effect:"ult_def", unlocked:false, reqLvl:10, reqSkill:3, x:220, y:240 },
    { id:7, name:"Blade of Mirrors", branch:"DPS", dmg:30, cost:7, effect:"multi", unlocked:false, reqLvl:12, reqSkill:5, x:80, y:330 }
  ];

  companions[1].skills = [ // Lirael
    { id:1, name:"Firebolt", branch:"DPS", dmg:10, cost:2, effect:null, unlocked:true, reqLvl:1, reqSkill:null, x:80, y:60 },
    { id:2, name:"Group Heal", branch:"Healer", dmg:-9, cost:3, effect:null, unlocked:true, reqLvl:1, reqSkill:null, x:220, y:60 },
    { id:3, name:"Mirror Bolt", branch:"DPS", dmg:14, cost:3, effect:"copy", unlocked:false, reqLvl:4, reqSkill:1, x:80, y:150 },
    { id:4, name:"Strand Mend", branch:"Healer", dmg:-14, cost:4, effect:"cleanse+regen", unlocked:false, reqLvl:5, reqSkill:2, x:220, y:150 },
    { id:5, name:"Echo Cascade", branch:"DPS", dmg:22, cost:6, effect:"vampire", unlocked:false, reqLvl:8, reqSkill:3, x:80, y:240 },
    { id:6, name:"Void Symphony", branch:"Chaos", dmg:0, cost:5, effect:"ult_chaos", unlocked:false, reqLvl:10, reqSkill:4, x:220, y:240 },
    { id:7, name:"Reality Fracture", branch:"Chaos", dmg:35, cost:8, effect:"multi+stun", unlocked:false, reqLvl:12, reqSkill:5, x:150, y:330 }
  ];

  player.skills = [
    { id:1, name:"Sultan Slash", dmg:15, cost:3, effect:null, unlocked:true, reqLvl:1, reqSkill:null, x:150, y:80 },
    { id:2, name:"Royal Rally", dmg:-10, cost:4, effect:"partyheal", unlocked:false, reqLvl:6, reqSkill:1, x:150, y:200 },
    { id:3, name:"Strand Dominion", dmg:28, cost:6, effect:"multi", unlocked:false, reqLvl:12, reqSkill:2, x:150, y:320 }
  ];
}
defineSkillTrees();

// ====================== DRAW VISUAL SKILL TREE ======================
function drawSkillTree(unit) {
  currentSkillUnit = unit;
  const isPlayer = unit === player;
  const skills = unit.skills || [];
  const points = isPlayer ? skillPoints.player : skillPoints[unit.id] || 0;

  DOM.skillPointsDisplay.textContent = `Skill Points: ${points}`;

  skillCtx.clearRect(0, 0, DOM.skillTreeCanvas.width, DOM.skillTreeCanvas.height);

  // Background grid
  skillCtx.strokeStyle = '#1a4a1a';
  skillCtx.lineWidth = 1;
  for (let x = 20; x < 300; x += 40) {
    skillCtx.beginPath(); skillCtx.moveTo(x, 0); skillCtx.lineTo(x, 420); skillCtx.stroke();
  }
  for (let y = 20; y < 420; y += 40) {
    skillCtx.beginPath(); skillCtx.moveTo(0, y); skillCtx.lineTo(300, y); skillCtx.stroke();
  }

  // Draw connections first
  skillCtx.lineWidth = 4;
  skills.forEach(skill => {
    if (!skill.reqSkill) return;
    const parent = skills.find(s => s.id === skill.reqSkill);
    if (!parent) return;

    skillCtx.strokeStyle = skill.unlocked ? '#9bbc0f' : '#555';
    skillCtx.setLineDash(skill.unlocked ? [] : [6, 4]);
    skillCtx.beginPath();
    skillCtx.moveTo(parent.x, parent.y + 20);
    skillCtx.lineTo(skill.x, skill.y - 10);
    skillCtx.stroke();
    skillCtx.setLineDash([]);
  });

  // Draw nodes
  skills.forEach(skill => {
    const radius = 22;
    const canUnlock = !skill.unlocked && points > 0 && unit.lvl >= skill.reqLvl && 
                     (!skill.reqSkill || skills.find(s => s.id === skill.reqSkill && s.unlocked));

    // Glow for unlocked or unlockable
    if (skill.unlocked || canUnlock) {
      skillCtx.shadowColor = skill.unlocked ? '#9bbc0f' : '#a9364a';
      skillCtx.shadowBlur = 12;
    }

    skillCtx.fillStyle = skill.unlocked ? '#8bac0f' : canUnlock ? '#e0f8cf' : '#444';
    skillCtx.beginPath();
    skillCtx.arc(skill.x, skill.y, radius, 0, Math.PI * 2);
    skillCtx.fill();
    skillCtx.shadowBlur = 0;

    // Border
    skillCtx.strokeStyle = skill.unlocked ? '#0f380f' : '#666';
    skillCtx.lineWidth = 4;
    skillCtx.stroke();

    // Branch color accent
    skillCtx.fillStyle = getBranchColor(skill.branch);
    skillCtx.fillRect(skill.x - 14, skill.y - 14, 28, 6);

    // Text
    skillCtx.fillStyle = skill.unlocked ? '#0f380f' : '#9bbc0f';
    skillCtx.font = '10px Courier New';
    skillCtx.textAlign = 'center';
    skillCtx.fillText(skill.name.split(' ').join('\n'), skill.x, skill.y + 6);

    // Req level
    if (!skill.unlocked) {
      skillCtx.fillStyle = '#a9364a';
      skillCtx.fillText(`Lv${skill.reqLvl}`, skill.x, skill.y + 32);
    }
  });
}

function getBranchColor(branch) {
  if (branch === "DPS") return '#a9364a';
  if (branch === "Defender" || branch === "Healer") return '#306f98';
  if (branch === "Chaos") return '#9b4f9b';
  return '#9bbc0f';
}

// Click handler for skill tree canvas
DOM.skillTreeCanvas.addEventListener('click', (e) => {
  if (!currentSkillUnit) return;
  const rect = DOM.skillTreeCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const skills = currentSkillUnit.skills || [];
  const pointsKey = currentSkillUnit === player ? 'player' : currentSkillUnit.id;
  let points = currentSkillUnit === player ? skillPoints.player : skillPoints[currentSkillUnit.id] || 0;

  for (let skill of skills) {
    const dx = mx - skill.x;
    const dy = my - skill.y;
    if (dx*dx + dy*dy < 25*25) { // clicked inside node
      if (skill.unlocked) {
        DOM.textOutput.textContent = `${skill.name} is already mastered.`;
        DOM.textOutput.style.display = 'block';
        return;
      }
      if (points <= 0 || currentSkillUnit.lvl < skill.reqLvl || 
          (skill.reqSkill && !skills.find(s => s.id === skill.reqSkill && s.unlocked))) {
        DOM.textOutput.textContent = "Cannot unlock yet.";
        DOM.textOutput.style.display = 'block';
        return;
      }

      // Unlock!
      skill.unlocked = true;
      if (currentSkillUnit === player) skillPoints.player--;
      else skillPoints[currentSkillUnit.id]--;

      DOM.textOutput.textContent = `Mastered ${skill.name}!`;
      DOM.textOutput.style.display = 'block';

      drawSkillTree(currentSkillUnit); // refresh
      saveGame();
      return;
    }
  }
});

// ====================== OPEN SKILL TREE ======================
function openSkillTree(index) {
  const unit = index === -1 ? player : companions[index];
  DOM.skillTreeEl.style.display = 'flex';
  drawSkillTree(unit);
}

window.openSkillTree = openSkillTree; // for party menu

function closeSkillTree() {
  DOM.skillTreeEl.style.display = 'none';
  currentSkillUnit = null;
}

// ====================== PARTY MENU (updated) ======================
function openPartyMenu() {
  DOM.menuOverlay.style.display = 'flex';
  DOM.menuOverlay.innerHTML = `<div style="color:#9bbc0f;padding:12px;font-size:24px;">Sovereign Party — Tap for Skill Tree</div>`;

  let html = `<button onclick="openSkillTree(-1)" style="width:90%;margin:8px;background:#306f98">★ \( {player.name} Lv \){player.lvl} (Skill Tree)</button>`;

  companions.forEach((c, i) => {
    if (c.recruited) {
      html += `<button onclick="openSkillTree(\( {i})" style="width:90%;margin:8px;background: \){c.color}">\( {c.name} Lv \){c.lvl} — Skill Tree</button>`;
    }
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Return';
  closeBtn.onclick = () => DOM.menuOverlay.style.display = 'none';
  DOM.menuOverlay.innerHTML += html;
  DOM.menuOverlay.appendChild(closeBtn);
}

// ====================== LEVEL UP — Award Points ======================
function checkLevelUp(unit) {
  if (unit.xp < unit.nextXp) return;
  unit.lvl++;
  unit.xp -= unit.nextXp;
  unit.nextXp = Math.floor(unit.nextXp * 1.65);
  unit.maxHp += 8;
  unit.hp = unit.maxHp;
  unit.atk += 2;
  unit.def += 1;

  const key = unit === player ? 'player' : unit.id;
  skillPoints[key] = (skillPoints[key] || 0) + 1;

  logBattle(`${unit.name} → Level ${unit.lvl}! +1 Skill Point`);
  drawMap();
}

// Keep all other functions (battle, movement, crafting, dungeon, save/load, init, etc.) from previous versions.
// In init(), make sure to call defineSkillTrees();

function init() {
  // ... preload, loadGame, drawMap, button bindings ...
  defineSkillTrees();
  console.log('%c✅ Sultan 47 v19.2 — Visual Skill Tree Graph Activated', 'color:#9bbc0f;font-size:18px');
}

init();
</script>
</body>
</html>
