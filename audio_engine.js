/**
 * DBM Sovereign Audio Engine
 * Features: File Upload, Frequency Analysis, and 87 BPM Sync
 */

const DBM_Audio = {
    context: null,
    analyser: null,
    source: null,
    dataArray: null,
    isPlaying: false,

    init: function(audioElement) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.context.createAnalyser();
        
        // Connect Audio Element -> Analyser -> Speakers
        this.source = this.context.createMediaElementSource(audioElement);
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);

        // FFT Size: Higher = more precision for high frequencies
        this.analyser.fftSize = 256; 
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
    },

    getFrequencyData: function() {
        if (!this.isPlaying) return { low: 0, mid: 0, high: 0 };
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Extract ranges for physics
        const low = this.dataArray.slice(0, 10).reduce((a, b) => a + b) / 10;   // Kick/BPM
        const mid = this.dataArray.slice(10, 50).reduce((a, b) => a + b) / 40;  // Melodic
        const high = this.dataArray.slice(50, 100).reduce((a, b) => a + b) / 50; // Jitter
        
        return { low, mid, high };
    }
};

// UI INTEGRATION
const audioInput = document.createElement('input');
audioInput.type = 'file';
audioInput.accept = 'audio/*';
audioInput.style.cssText = "position:absolute; bottom:20px; left:20px; z-index:100;";
document.body.appendChild(audioInput);

const audioTag = new Audio();
audioTag.controls = true;
audioTag.style.cssText = "position:absolute; bottom:20px; left:200px; z-index:100;";
document.body.appendChild(audioTag);

audioInput.onchange = function() {
    const files = this.files;
    audioTag.src = URL.createObjectURL(files[0]);
    if (!DBM_Audio.context) DBM_Audio.init(audioTag);
    DBM_Audio.isPlaying = true;
    audioTag.play();
};
