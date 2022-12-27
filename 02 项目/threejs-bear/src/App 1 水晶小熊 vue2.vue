<template>
  <div id="app">
    <div class="canvasContainer" ref="canvasContainer"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
// import { onMounted, onUnmounted, ref } from "vue";
// const canvasContainer = ref(null)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// onMounted(() => {

// })
export default {
  name: 'App',
  components: {
  },
  mounted() {
  // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 相机位置
  camera.position.set(1.5, 1, 1.5)
  // 更新摄像头的宽高比例
  camera.aspect = window.innerWidth / window.innerHeight
  // 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
  camera.updateProjectionMatrix();
  // 相机放到场景中 
  scene.add(camera)

  // 背景纹理 初始化
  const loader = new THREE.TextureLoader();
  // 导入纹理
  const bgTexture = loader.load('/assets/imgs/050.jpg')
  // 设置纹理图片是全景的 反射 EquirectangularRefractionMapping
  bgTexture.mapping = THREE.EquirectangularRefractionMapping;

  // 场景的背景 环境纹理
  scene.background = bgTexture
  scene.environment = bgTexture

  // 添加环境光
  const ambient = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambient)

  // 加载小熊模型  
  const gltfLoader = new GLTFLoader();
  // 加载图片
  gltfLoader.load('/assets/model/bear.gltf', (gltf) => {
    console.log(gltf)
    const model = gltf.scene.children[0]
    // 找到小熊
    console.log(model)
    // 设置水晶小熊  设置材质 
    model.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      // 环境纹理
      envMap: bgTexture, 
      // 折射率
      refractionRatio: 0.7,
      // 反射率
      reflectivity: 0.7,
      // 投影
      opacity: 0.5,
    })
    // 小熊比例
    model.scale.set(2,2,2)
    scene.add(model)
  })

  // 初始化渲染器     抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 适配页面
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight; // 相机 方面
    camera.updateProjectionMatrix();
  })

  // 渲染器添加到页面
  this.$refs.canvasContainer.appendChild(renderer.domElement)

  // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // 控制器阻尼
  controls.enableDamping = true

  // 渲染函数
  const render = () => {
    // 更新控制器
    controls.update();
    // 渲染场景
    renderer.render(scene, camera)
    // 循环渲染
    requestAnimationFrame(render)
  }
  render()
  }
  
}
</script>

<style>
/* 导入基本css */
@import url(@/assets/css/base.css);
</style>
