
// Play a sound
const audio = new Audio("audios/lock-in-audio.mp3"); // Replace with the path to your audio file
audio.play().catch((error) => {
    console.error("Error playing sound:", error);
});