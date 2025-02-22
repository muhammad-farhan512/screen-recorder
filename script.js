let mediaRecorder;
let recordedChunks = [];
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const videoPlayback = document.getElementById("videoPlayback");
const downloadLink = document.getElementById("downloadLink");

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

async function startRecording() {
  // Capture the screen and audio simultaneously
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });
  const audioStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  // Combine the screen and audio streams
  const combinedStream = new MediaStream([
    ...screenStream.getVideoTracks(),
    ...audioStream.getAudioTracks(),
  ]);

  // Setup MediaRecorder
  mediaRecorder = new MediaRecorder(combinedStream);
  mediaRecorder.start();

  recordedChunks = [];
  mediaRecorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  });

  mediaRecorder.addEventListener("stop", () => {
    const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
    const videoUrl = URL.createObjectURL(videoBlob);
    videoPlayback.src = videoUrl;

    // Prepare the download link
    downloadLink.href = videoUrl;
    downloadLink.download = "screen-audio-recording.webm";
    downloadLink.style.display = "block";
    downloadLink.textContent = "Download Recording";
  });

  startButton.disabled = true;
  stopButton.disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();

  startButton.disabled = false;
  stopButton.disabled = true;
}
