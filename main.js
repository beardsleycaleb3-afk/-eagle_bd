/* ©eagle_bd: Sultan 47 - System Controller
 * Logic: Bridge between UI and H6_G Worker
 */

// 1. Initialize the Invisible Heart (Worker)
const sultanWorker = new Worker('worker.js');

// 2. Terminal Output Logic
const output = document.getElementById('output');
const glyphInput = document.getElementById('glyph-input');

function logToTerminal(msg) {
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    output.appendChild(entry);
    output.scrollTop = output.scrollHeight;
}

// 3. Listen for Worker Handshake
sultanWorker.onmessage = function(e) {
    if (e.data.status === "RESET") {
        logToTerminal(`!! CRITICAL: ${e.data.error}`);
        glyphInput.style.color = "#f00"; // Red Flash on Failure
    } else {
        logToTerminal(`OK: Mirror Parity Confirmed.`);
        glyphInput.style.color = "#00ff41";
    }
};

// 4. Touch/Input Simulation for 14:4 Strands
// This is the "Sticker" that sends the Nu-un subnets to the Vault
window.addEventListener('touchstart', () => {
    // Example: Sending the "God String" to the Gate
    const bootStrand = "x1X1(w0W9(B0(o1O9)))";
    logToTerminal(`SENDING STRAND: ${bootStrand}`);
    sultanWorker.postMessage(bootStrand);
});

// 5. Placeholder for Three.js (The Grid)
logToTerminal("SULTAN 47 CORE: ONLINE");
logToTerminal("14:4 MIRROR: ACTIVE");
