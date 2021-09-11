let fft;
let audioIn;
async function setup() {
  createCanvas(800, 800);
  background(200);
  textAlign(CENTER);

  await AudioPicker.getSources();
  audioIn = AudioPicker.audioIn;
  AudioPicker.createButtons(() => {
    fft = new p5.FFT();
    fft.setInput(audioIn);
  }).addStyleToButtons((btn, index, length) => {
    btn.position(0, height - (length - index) * 30);
    btn.size(width, 28);
  });
}

function draw() {
  background(200);
  if (!AudioPicker.isMicAllowed) {
    text("↑ allow to use your microphone", width / 2, height / 2);
    return;
  }
  if (AudioPicker.isPicked) {
    showSpectrum();
    showLevelText();
  } else {
    text("↓ select audio device ↓", width / 2, height / 2);
  }
}

function showLevelText() {
  fill(255);
  noStroke();
  text(audioIn.getLevel(), width / 2, height / 2);
}

function showSpectrum() {
  const spectrum = fft.analyze();
  noFill();
  stroke(255);

  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    const x = map(i, 0, spectrum.length, 0, width);
    const amp = spectrum[i];
    const y = map(amp, 0, 255, height - 10, height * 0.4);
    vertex(x, y);
  }
  endShape();
}
