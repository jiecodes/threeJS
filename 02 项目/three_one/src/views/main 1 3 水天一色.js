import * as THREE from "three" 
// 导入控制器 控制三维物体
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入官方的水面
import { Water } from 'three/examples/jsm/objects/Water2' 
// 添加模型前 需要导入gltf库
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader'
// 导入解压文件库
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入天空纹理 hdr图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机(看见内容)   透视相机   75相机角度    0.1,1000相机看到的最近距离和最远距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
// 相机位置
camera.position.set(-50, 190, 240)
// 更新摄像头的宽高比例
camera.aspect = window.innerWidth / window.innerHeight
// 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
camera.updateProjectionMatrix();
// 相机放到场景中 
scene.add(camera)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
})
// 渲染器 输出编码
renderer.outputEncoding = THREE.sRGBEncoding;
// 设置渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight);
// 监听屏幕大小发生改变 监听渲染器的宽高,相机的比例
window.addEventListener("resize", () => {
  // 页面自适应  更新摄像头的宽高比例
  camera.aspect = window.innerWidth / window.innerHeight; 
  // 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})
// 渲染器添加到页面
document.body.appendChild(renderer.domElement)

// 实例化控制器   把摄像机和渲染器添加到控制器中
const controls = new OrbitControls(camera, renderer.domElement)

// 渲染函数
function render() {
  // 渲染场景
  renderer.render(scene, camera)
  // 引擎自动更新渲染器   请求动画帧不断调用render函数 一帧一帧的渲染出来
  requestAnimationFrame(render)
}
render()

// 设置一个平面几何体     (100, 100) xy轴宽高
// const planeGeometry = new THREE.PlaneGeometry(100, 100)
// // 设置材质 基础材质(这种材质不受光照的影响。)
// const planeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   // 平面图形显示后面
//   side: THREE.DoubleSide,
// })
// // 平面几何体和材质 添加到 平面中
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// // 平面添加到 场景中 (一个白色的平面展示了)
// scene.add(plane)

// 创建一个巨大的天空球体 几何体 geometry   1000, 60, 60半径 经纬度
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60)
// 天空纹理
let texture = new THREE.TextureLoader().load('./texture/sky.jpeg')
// 天空材质     mesh 网格 basic 基本 material 材质
const skyMaterial = new THREE.MeshBasicMaterial({
  // 纹理 
  map: texture,
  // 平面图形显示后面
  // side: THREE.DoubleSide,
})
// 里面的黑的外面是亮的 翻转几何体
skyGeometry.scale(1,1,-1) 
// 创建物体 球
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial) 
// 物体球 添加到 场景中
scene.add(skySphere)


// 视频纹理
const video = document.createElement('video')
// 设置地址
video.src = './texture/skySilent.mp4'
// 视频循环播发
video.loop = true

// 浏览器默认禁止播放视频 设置当鼠标与浏览器有交互时 视频自动播放
window.addEventListener('click', () => {
  // 鼠标移动时播放视频  判断视频是否处于播放状态
  if (video.paused) {
    // 视频播放
    video.play();
    let texture = new THREE.VideoTexture(video)
    // 材质的纹理  = 视频纹理
    skyMaterial.map = new THREE.VideoTexture(video)
    // 天空材质 纹理 展示
    skyMaterial.map.needsUpdate = true
    // // 场景背景
    // scene.background = texture;
    // // 场景环境
    // scene.environment = texture
  } 
})

// 载入环境纹理 hdr
// 实例化 hdr
const hdrLoader = new RGBELoader();
// 导入 加载纹理
hdrLoader.loadAsync('./assets/050.hdr').then((texture) => {
  // 纹理映射、 天空球面
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // 场景背景
  scene.background = texture
  // 场景环境
  scene.environment = texture
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-100, 100, 10)
// 平行光 添加到 场景中
scene.add(light)

// 创建水面   水几何体  圆形几何体
const waterGeometry = new THREE.CircleGeometry(300, 64)
const water = new Water(waterGeometry, {
  // 纹理宽高
  textureWidth: 1024,
  textureHeight: 1024,
  // 水面颜色
  color: 0xeeeeff,
  // 水面流动方向
  flowDirection: new THREE.Vector2(1, 1),
  // 水面波纹大小
  scale: 1,
})
// 修改水面 y值 抬高水面
water.position.y = 3
// 水面旋转至水平
water.rotation.x = -Math.PI / 2
// 水面添加到场景中
scene.add(water)

// 添加小岛模型  盒子几何体
const isLandGeometry = new THREE.BoxGeometry(10, 10, 10)
// 实例化 gltf 载入库
const gltfLoader = new GLTFLoader();
// 实例化 draco 载入库
const dracoLoader = new DRACOLoader()
// 添加 draco 载入库
dracoLoader.setDecoderPath('./draco/')
// gltf库 解压 draco文件
gltfLoader.setDRACOLoader(dracoLoader)
// 加载模型地址
gltfLoader.load('./model/island2.glb', (gltf) => {
  scene.add(gltf.scene)
})




