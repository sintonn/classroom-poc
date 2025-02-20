<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, SceneLoader, Ray, AbstractMesh } from "@babylonjs/core";
import "@babylonjs/loaders";

const canvas = ref<HTMLCanvasElement | null>(null);
const state = reactive({ showLink: false, isFullScreen: false });
const inputMap: { [key: string]: boolean } = {}; // Input storage for movement

onMounted(() => {
  if (!canvas.value) return;

  const engine = new Engine(canvas.value, true);
  const scene = new Scene(engine);

  // Camera setup (First-Person View)
  const camera = new FreeCamera("freeCam", new Vector3(0, 1.6, -5), scene);
  camera.attachControl(canvas.value, true);
  camera.speed = 0.15;

  // Lighting
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Load Classroom Model & Track Object
  let targetObject: AbstractMesh | null = null;

  SceneLoader.ImportMesh("", "./assets/", "classroom.glb", scene, (meshes) => {
    console.log("Classroom Loaded", meshes);
    targetObject = meshes.find(mesh => mesh.name === "whiteboard"); // Change to your target object
  });

  // Camera movement handling
  const moveCamera = () => {
    if (inputMap["ArrowUp"] || inputMap["w"] || inputMap["up"]) {
      camera.position.addInPlace(camera.getDirection(Vector3.Forward()).scale(0.1));
    }
    if (inputMap["ArrowDown"] || inputMap["s"] || inputMap["down"]) {
      camera.position.addInPlace(camera.getDirection(Vector3.Backward()).scale(0.1));
    }
    if (inputMap["ArrowLeft"] || inputMap["a"] || inputMap["left"]) {
      camera.position.addInPlace(camera.getDirection(Vector3.Left()).scale(0.1));
    }
    if (inputMap["ArrowRight"] || inputMap["d"] || inputMap["right"]) {
      camera.position.addInPlace(camera.getDirection(Vector3.Right()).scale(0.1));
    }
  };

  // Check if Camera is Looking at Target
  scene.onBeforeRenderObservable.add(() => {
    moveCamera();

    if (!targetObject) return;

    const forwardRay = new Ray(camera.position, camera.getDirection(Vector3.Forward()), 5);
    const hit = scene.pickWithRay(forwardRay);

    state.showLink = hit?.pickedMesh === targetObject;
  });

  // Keyboard movement
  window.addEventListener("keydown", (event) => (inputMap[event.key] = true));
  window.addEventListener("keyup", (event) => (inputMap[event.key] = false));

  // Render loop
  engine.runRenderLoop(() => scene.render());

  window.addEventListener("resize", () => engine.resize());
});

// Handle fullscreen
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    canvas.value?.requestFullscreen();
    state.isFullScreen = true;
  } else {
    document.exitFullscreen();
    state.isFullScreen = false;
  }
};

// Mobile controls
const move = (direction: string, isPressed: boolean) => {
  inputMap[direction] = isPressed;
};
</script>

<template>
  <!-- Clickable Link (Only Shows When Looking at Target Object) -->
  <div v-if="state.showLink" class="overlay">
    <a href="https://example.com" target="_blank" class="clickable-link">Learn More</a>
  </div>

  <!-- Fullscreen Button -->
  <button class="fullscreen-btn" @click="toggleFullScreen">
    {{ state.isFullScreen ? "Exit Fullscreen" : "Go Fullscreen" }}
  </button>

  <!-- Mobile Controls -->
<!-- Mobile Controls (Now Works on Both Desktop & Mobile) -->
<div class="mobile-controls">
  <button 
    @mousedown="move('up', true)" @mouseup="move('up', false)"
    @touchstart="move('up', true)" @touchend="move('up', false)"
  >↑</button>

  <div>
    <button 
      @mousedown="move('left', true)" @mouseup="move('left', false)"
      @touchstart="move('left', true)" @touchend="move('left', false)"
    >←</button>

    <button 
      @mousedown="move('right', true)" @mouseup="move('right', false)"
      @touchstart="move('right', true)" @touchend="move('right', false)"
    >→</button>
  </div>

  <button 
    @mousedown="move('down', true)" @mouseup="move('down', false)"
    @touchstart="move('down', true)" @touchend="move('down', false)"
  >↓</button>
</div>

  <canvas ref="canvas" class="full-screen"></canvas>
</template>

<style scoped>
.full-screen {
  width: 100%;
  height: 100vh;
  display: block;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.clickable-link {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.clickable-link:hover {
  background: rgba(255, 255, 255, 0.8);
  color: black;
}

/* Fullscreen Button */
.fullscreen-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: black;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
}

.fullscreen-btn:hover {
  background: gray;
}

/* Mobile Controls */
.mobile-controls {
  position: fixed; /* Change from absolute to fixed */
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999; /* Ensure buttons stay on top */
  pointer-events: auto; /* Prevent clicks being blocked */
}

.mobile-controls div {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.mobile-controls button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  font-size: 24px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.mobile-controls button:hover {
  background: rgba(255, 255, 255, 0.8);
  color: black;
}
</style>
