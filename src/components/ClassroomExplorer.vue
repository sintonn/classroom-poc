<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, SceneLoader, Ray, AbstractMesh } from "@babylonjs/core";
import "@babylonjs/loaders";

const canvas = ref<HTMLCanvasElement | null>(null);
const state = reactive({ showLink: false });

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
  
  SceneLoader.ImportMesh("", "/assets/", "classroom.glb", scene, (meshes) => {
    console.log("Classroom Loaded", meshes);

  });

  // Check if Camera is Looking at Target
  scene.onBeforeRenderObservable.add(() => {
    if (!targetObject) return;

    // Cast a ray from the camera's position in the direction it is looking
    const forwardRay = new Ray(camera.position, camera.getDirection(Vector3.Forward()), 5); // Adjust distance
    const hit = scene.pickWithRay(forwardRay);

if (hit && hit.pickedMesh === targetObject) {
  state.showLink = true;
} else {
  state.showLink = false;
}


    // Show link only if the ray hits the target object
    state.showLink = hit?.pickedMesh === targetObject;
  });

  // Render loop
  engine.runRenderLoop(() => scene.render());

  window.addEventListener("resize", () => engine.resize());
});
</script>

<template>
  <!-- Clickable Link (Only Shows When Looking at Target Object) -->
  <div v-if="state.showLink" class="overlay">
    <a href="https://example.com" target="_blank" class="clickable-link">Learn More</a>
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
</style>
