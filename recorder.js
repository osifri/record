let mediaRecorder;
let audioChunks = [];
let isLooping = false; // Track the looping state

document.getElementById("startRecord").onclick = startRecording;
document.getElementById("stopRecord").onclick = stopRecording;
document.getElementById("playLoop").onclick = toggleLoopPlayback;

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.onstart = () => {
        audioChunks = [];
        document.getElementById("stopRecord").disabled = false;
        document.getElementById("startRecord").disabled = true;
        document.getElementById("playLoop").disabled = true; // Disable loop playback button while recording
      };
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayback = document.getElementById("audioPlayback");
        audioPlayback.src = audioUrl;
        document.getElementById("playLoop").disabled = false; // Enable loop playback button after recording
      };
      mediaRecorder.start();
    }).catch(e => console.error(e));
}

function stopRecording() {
  mediaRecorder.stop();
  document.getElementById("stopRecord").disabled = true;
  document.getElementById("startRecord").disabled = false;
}

function toggleLoopPlayback() {
  isLooping = !isLooping; // Toggle looping state
  const audioPlayback = document.getElementById("audioPlayback");
  audioPlayback.loop = isLooping; // Set the loop attribute based on isLooping state
  if (isLooping) {
    audioPlayback.play(); // Start playback in loop if isLooping is true
    document.getElementById("playLoop").textContent = "Stop Loop";
  } else {
    audioPlayback.pause(); // Pause playback if loop is stopped
    audioPlayback.currentTime = 0; // Reset playback to the start
    document.getElementById("playLoop").textContent = "Play in Loop";
  }
}
