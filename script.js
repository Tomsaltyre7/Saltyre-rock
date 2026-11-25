// Run this code after the HTML page has loaded.
document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to Saltyre Rock!");

  const mapOpenButton = document.querySelector("#map-open");
  const mapDialog = document.querySelector("#map-dialog");
  const mapCloseButton = document.querySelector(".map-dialog-close");

  if (mapOpenButton && mapDialog && mapCloseButton) {
    mapOpenButton.addEventListener("click", () => {
      mapDialog.showModal();
      mapCloseButton.focus();
    });

    mapCloseButton.addEventListener("click", () => {
      mapDialog.close();
    });

    mapDialog.addEventListener("click", (event) => {
      if (event.target === mapDialog) mapDialog.close();
    });
  }

  const bellButton = document.querySelector("#church-bell-play");
  if (!bellButton) return;

  let audioContext;

  function ringBell(startTime) {
    // Several slightly inharmonic partials create the shimmer of a real bell.
    const partials = [
      { ratio: 1, volume: 0.34, decay: 4.2 },
      { ratio: 2.01, volume: 0.2, decay: 2.8 },
      { ratio: 2.4, volume: 0.15, decay: 2.1 },
      { ratio: 3.01, volume: 0.1, decay: 1.5 },
      { ratio: 4.15, volume: 0.055, decay: 0.9 },
    ];
    const fundamental = 440;

    partials.forEach(({ ratio, volume, decay }) => {
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      const peak = volume * 0.22;

      oscillator.type = "sine";
      oscillator.frequency.value = fundamental * ratio;
      envelope.gain.setValueAtTime(0.0001, startTime);
      envelope.gain.exponentialRampToValueAtTime(peak, startTime + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);
      oscillator.connect(envelope);
      envelope.connect(audioContext.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + decay + 0.05);
    });
  }

  bellButton.addEventListener("click", async () => {
    bellButton.disabled = true;
    bellButton.textContent = "Ringing…";

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("Web Audio is not supported in this browser.");
      audioContext ??= new AudioContextClass();
      await audioContext.resume();

      const firstStrike = audioContext.currentTime + 0.08;
      // Five measured tolls, with overlapping resonance between strikes.
      for (let toll = 0; toll < 5; toll += 1) {
        ringBell(firstStrike + toll * 1.8);
      }
    } catch (error) {
      console.error("Could not play the church bell:", error);
      bellButton.textContent = "Audio unavailable";
      bellButton.disabled = false;
      return;
    }

    window.setTimeout(() => {
      bellButton.textContent = "Play church bell";
      bellButton.disabled = false;
    }, 5 * 1800 + 4200);
  });
});
