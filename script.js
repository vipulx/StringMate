// Guitar string frequencies in Hz (Standard Tuning EADGBE)
const frequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];

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

            let closest = frequencies.reduce((prev, curr) => 
                Math.abs(curr - detectedFreq) < Math.abs(prev - detectedFreq) ? curr : prev
            );

            noteDisplay.textContent = `Detected: ${detectedFreq.toFixed(2)} Hz (Closest: ${closest} Hz)`;
            requestAnimationFrame(detectPitch);
        }
        
        detectPitch();
    } else {
        alert('Microphone access is not supported in this browser.');
    }
});
