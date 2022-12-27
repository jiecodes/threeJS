<template>
  <div id="app">
    <div class="canvasContainer" ref="canvasContainer"></div>
    <div class="content">
      <h2>汽车展示与选配</h2>
      <p>车身颜色</p>
      <div class="select">
        <div class="content_item" v-for="(item, index) in colors" :key="index" @click="selectColor(index)">
          <div class="content_item_color" :style="{ backgroundColor: item }"></div>
        </div>
      </div>
      <h2>选择贴膜材质</h2>
      <div class="select">
        <div class="content_item" v-for="(item, index) in materials" :key="index" @click="selectMaterial(index)">
          <div class="content_item_color">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from "vue";
const canvasContainer = ref(null)
// 加载 gltf文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 解压
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

  // 创建材质   物理网格材质
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  })
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  })
  const hoodMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  })
  const wheelsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.1,
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.1,
    transimission: 1,
    transparent: true,
  })
  

  let wheels = [];
  let carBody, frontCar, hoodCar, glassCar;

const colors = ['red', 'blue', 'green', 'gray', 'purple']
let selectColor = (index) => {
  bodyMaterial.color.set(colors[index]);
  frontMaterial.color.set(colors[index]);
  hoodMaterial.color.set(colors[index]);
  wheelsMaterial.color.set(colors[index]);
  glassMaterial.color.set(colors[index]);
}

// 贴膜材质
let materials = [{name: '磨砂',value: 1}, {name: '冰晶', value: 0}]
let selectMaterial = (index) => {
  bodyMaterial.clearcoatRoughness = materials[index].value
  frontMaterial.clearcoatRoughness = materials[index].value
  hoodMaterial.clearcoatRoughness = materials[index].value
}

onMounted(() => {
  // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 相机位置
  camera.position.set(0, 2, 6)
  // 更新摄像头的宽高比例
  camera.aspect = window.innerWidth / window.innerHeight
  // 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
  camera.updateProjectionMatrix();
  // 相机放到场景中 
  scene.add(camera)

  // 初始化渲染器     抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 渲染背景
  renderer.setClearColor('#000')
  scene.background = new THREE.Color('#ccc')
  scene.environment = new THREE.Color('#ccc')

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(10, 10)
  gridHelper.material.opacity = 0.2    // 透明度
  gridHelper.material.transparent = true    // 透明度为true
  // 网格添加到场景中
  scene.add(gridHelper)

  // 适配页面
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight; // 相机 方面
    camera.updateProjectionMatrix();
  })

  // 渲染器添加到页面
  canvasContainer.value.appendChild(renderer.domElement)

  // 添加控制器 可以360度查看汽车
  const controls = new OrbitControls(camera, renderer.domElement)
  // 控制器阻尼
  controls.enableDamping = true
  controls.update();





  // 添加汽车模型  gltf   初始化 
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./assets/draco/gltf/')
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load('./assets/model/bmw01.glb', (gltf) => {
    const bmw = gltf.scene
    console.log(gltf)
    bmw.traverse((child) => {
     if (child.isMesh) {
       console.log(child.name)
     };
      // 判断是否是轮毂
     if (child.isMesh && child.name.includes("轮毂")) {
       wheels.material = wheelsMaterial
       wheels.push(child);
     }
    //判断是否是车身
    if (child.isMesh && child.name.includes("Mesh002")){
      carBody = child;
      carBody.material = bodyMaterial
    }
    // 判断是否是前脸
    if (child.isMesh && child.name.includes("前脸")){
      child.material = frontMaterial
      frontCar = child;
    }
    // 判断是否引擎盖
    if (child.isMesh && child.name.includes("引擎盖_1")){
      child.material = hoodMaterial
      hoodCar = child;
    }
    // 判断是否挡风玻璃
    if (child.isMesh && child.name.includes("挡风玻璃")){
      child.material = glassMaterial
      glassCar = child;
    }
    });
    scene.add(bmw)
  })

  // 添加灯光 添加之前车是黑的
  const light1 = new THREE.DirectionalLight(0xffffff, 1)
  light1.position.set(0, 0, 10)
  scene.add(light1)
  const light2 = new THREE.DirectionalLight(0xffffff, 1)
  light2.position.set(0, 0, -10)
  scene.add(light2)
  const light3 = new THREE.DirectionalLight(0xffffff, 1)
  light3.position.set(10, 0, 0)
  scene.add(light3)
  const light4 = new THREE.DirectionalLight(0xffffff, 1)
  light4.position.set(-10, 0, 0)
  scene.add(light4)
  const light5 = new THREE.DirectionalLight(0xffffff, 1)
  // 头顶的灯光
  light5.position.set(0, 10, 0)
  scene.add(light5)
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
  light6.position.set(5, 10, 0)
  scene.add(light6)
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
  light7.position.set(0, 10, 5)
  scene.add(light7)
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
  light8.position.set(0, 10, -5)
  scene.add(light8)
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
  light9.position.set(-5, 10, 0)
  scene.add(light9)

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


})
// export default {
//   name: 'App',
//   components: {
//   },
// }
</script>

<style>
/* 导入基本css */
@import url(@/assets/css/base.css);

.content {
  position: fixed;
  top: 20px;
  right: 0;
}
.select {
  display: flex;
}
.content_item_color {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
}
</style>
