<template>
  <div id="app">
    <div class="canvasContainer" ref="canvasContainer"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from "vue";
const canvasContainer = ref(null)
const pages = ref(null)
// 导入动画库 npm安装的  gsap
import gsap from 'gsap';
// 用加载器  加载hdr文件  设置背景
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 加载 转换gltf文件  设置显示人物  glb转换gltg文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 解压
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// 添加控制器 可以360度查看汽车
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 反射的库
import { Reflector } from 'three/examples/jsm/objects/Reflector'

// 经纬度转换3D坐标 函数
const lon2xyz = (R, longitude, latitude) => { 
  let lon = (longitude * Math.PI) / 180; // 转弧度值
  const lat = (latitude * Math.PI) / 180; // 转弧度值
  lon = -lon; // js坐标系z坐标轴对应经度-90度，而不是90度 
  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);  
  // 返回球面坐标
  return new THREE.Vector3(x, y, z);
};


onMounted(() => {
  console.log(canvasContainer.value)
    // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 相机位置     宽高  300 距离
  camera.position.set(0, 50, 300)
  // 更新摄像头的宽高比例
  camera.aspect = window.innerWidth / window.innerHeight 
  // 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
  camera.updateProjectionMatrix();
  // 相机放到场景中 
  scene.add(camera)

  // 初始化渲染器     抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 把渲染器 渲染到页面中
  canvasContainer.value.appendChild(renderer.domElement)

  // 创建辅助 坐标轴
  let axes = new THREE.AxesHelper(5);
  scene.add(axes)
  
  // 添加控制器 可以360度查看汽车
  const controls = new OrbitControls(camera, renderer.domElement)
  // 控制器 自旋转  球体可以自旋转
  controls.autoRotate = true;
  // 控制器阻尼
  controls.enableDamping = true
  // 页面改变 控制器更新
  controls.update();

  // 创建背景 星空
  // let url = './assets/3DCool/25s.jpg'
  // // 纹理地址
  // let envTexture = new THREE.TextureLoader().load(url)
  // // 球形包裹
  // envTexture.mapping = THREE.EquirectangularRefractionMapping;
  // // 场景背景  纹理背景
  // scene.background = envTexture
  // // 场景背景  纹理环境
  // scene.environment = envTexture

  // // 设置解压缩加载器 DRACOLoader
  // let dracoLoader = new DRACOLoader();
  // // 设置解压缩的 路径
  // dracoLoader.setDecoderPath('./assets/draco/gltf/')
  // // 设置解压缩的 配置类
  // dracoLoader.setDecoderConfig({ type: "js"})
  // // 加载 转换gltf文件  设置显示人物  glb转换gltg文件
  // let gltfLoader = new GLTFLoader()
  // // 解压 gltf文件
  // gltfLoader.setDRACOLoader(dracoLoader);
  // // 添加 转换gltf文件

  

  // 渲染函数
  const render = () => {
    requestAnimationFrame(render)
    // 在渲染器中渲染出 场景和相机
    renderer.render(scene, camera)
  }
  render()
})

// export default {

// }
</script>

<style>
/* 导入基本css */
@import url(@/assets/css/base.css);

</style>