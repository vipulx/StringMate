// Guitar string frequencies in Hz and corresponding note names (Standard Tuning E A D G B E)
const notes = [
    { name: "Low E", frequency: 82.41 },
    { name: "A", frequency: 110.00 },
    { name: "D", frequency: 146.83 },
    { name: "G", frequency: 196.00 },
    { name: "B", frequency: 246.94 },
    { name: "High E", frequency: 329.63 }
];

const startButton = document.getElementById('start-button');
const noteDisplay = document.getElementById('note-display');

startButton.addEventListener('click', async () => {
    if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        function detectPitch() {
            analyser.getByteTimeDomainData(dataArray);
            let maxVal = Math.max(...dataArray);
            let detectedFreq = (maxVal / 255) * 500;  // Simplified frequency estimation

            let closestNote = notes.reduce((prev, curr) => 
                Math.abs(curr.frequency - detectedFreq) < Math.abs(prev.frequency - detectedFreq) ? curr : prev
            );

            noteDisplay.textContent = `Detected: ${detectedFreq.toFixed(2)} Hz (Closest: ${closestNote.name} - ${closestNote.frequency} Hz)`;
            requestAnimationFrame(detectPitch);
        }
        
        detectPitch();
    } else {
        alert('Microphone access is not supported in this browser.');
    }
});
