<template>
  <div id="app">
    <div class="canvasContainer" ref="canvasContainer"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from "vue";
const canvasContainer = ref(null)
// 用加载器  加载hdr文件  设置背景
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 加载 转换gltf文件  设置显示人物
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 解压
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// 添加控制器 可以360度查看汽车
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 反射的库
import { Reflector } from 'three/examples/jsm/objects/Reflector'


onMounted(() => {
  console.log(canvasContainer.value)
    // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, canvasContainer.value.clientWidth / canvasContainer.value.clientHeight, 0.1, 1000)
  // 相机位置
  camera.position.set(0, 2, 6)
  // 更新摄像头的宽高比例
  camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight 
  // 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
  camera.updateProjectionMatrix();
  // 相机放到场景中 
  scene.add(camera)

  // 初始化渲染器     抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight)
  // 把渲染器 渲染到页面中
  canvasContainer.value.appendChild(renderer.domElement)

  // 创建辅助 坐标轴
  let axes = new THREE.AxesHelper(5);
  scene.add(axes)
  
  // 添加控制器 可以360度查看汽车
  const controls = new OrbitControls(camera, renderer.domElement)
  // 控制器阻尼
  controls.enableDamping = true
  // 页面改变 控制器更新
  controls.update();

  // 创建 rgbe 加载器 加载hdr文件(背景 夜景)
  let hdrLoader = new RGBELoader();
  // 加载 资源
  hdrLoader.load('./assets/robot/sky12.hdr', (texture) => {
    // 纹理映射成 球的样子 
    texture.mapping = THREE.EquirectangularRefractionMapping;
    // 场景背景
    scene.background = texture;
    // 场景环境
    scene.environment = texture;
  })

  // 添加机器人    设置解压缩的加载器
  let dracoLoader = new DRACOLoader();
  // 设置解压缩的 路径
  dracoLoader.setDecoderPath('./assets/draco/gltf/')
  // 设置解压缩的 配置类
  dracoLoader.setDecoderConfig({ type: "js"})
  // 实例化  加载 gltf文件
  let gltfLoader = new GLTFLoader();
  // 加载gltf文件 设置解压缩文件
  gltfLoader.setDRACOLoader(dracoLoader)
  // 加载文件路径  转换为gltf文件
  gltfLoader.load('./assets/robot/robot.glb',(gltf) => {
    let robot = gltf.scene;
    // robot.scale.set(0.1, 0.1, 0.1)
    // robot.position.set(0, 0, 0)
    scene.add(robot)
  })

  // 添加灯光(直线光) 显示了机器人是黑的 
  let light1 = new THREE.DirectionalLight(0xffffff, 0.3)
  light1.position.set(0, 10, 10)
  let light2 = new THREE.DirectionalLight(0xffffff, 0.3)
  light2.position.set(0, 10, -10)
  let light3 = new THREE.DirectionalLight(0xffffff, 0.8)
  light3.position.set(10, 10, 10)
  scene.add(light1, light2, light3)

  // 添加视频  添加光阵
  let video = document.createElement("video")
  video.src = './assets/robot/zp2.mp4'
  video.loop = true         // 循环播放
  video.muted = true       // 静音 只有静音才能自动播放
  video.play()              // 播放
  // 创建视图纹理 播放视频
  let videoTexture = new THREE.VideoTexture(video)
  // 创建一个平面几何体  视频
  const videoGeoPlane = new THREE.PlaneBufferGeometry(16 / 1.5, 9 / 1.5)
  // 创建 材质
  const videoMaterial = new THREE.MeshBasicMaterial({
    // 显示的视频纹理
    map: videoTexture,
    // 透明度
    transparent: true,
    alphaMap: videoTexture,   // 透明度映射
    // 平面图形显示后面
    side: THREE.DoubleSide,
  })
  // 创建视频物体  平面几何体和材质
  const VideoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial)
  VideoMesh.position.set(0, 0.2, 0)
  VideoMesh.rotation.set(Math.PI / 2, 0, 0)      // 旋转
  // 视频物体添加到 场景中
  scene.add(VideoMesh)

  // 添加镜面反射  反射面几何体
  let reflectorGeometry = new THREE.PlaneBufferGeometry(100, 100) 
  // 反射面 平面
  let reflectorPlane = new Reflector(reflectorGeometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0xffffff,
  })
  reflectorPlane.rotation.set(-Math.PI / 2, 0, 0)
  scene.add(reflectorPlane)

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
.canvasContainer {
  width: 100vw;
  height: 100vh;
}
</style>