import * as THREE from "three" 
// 导入控制器 控制三维物体
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机(看见内容)   透视相机   75相机角度    0.1,1000相机看到的最近距离和最远距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 相机位置位置
camera.position.set(-50, -50, 100)
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
const skyGeometry = new THREE.SphereGeometry(60, 60, 60)
// 天空材质     mesh 网格 basic 基本 material 材质
const skyMaterial = new THREE.MeshBasicMaterial({
  // 纹理 
  map: new THREE.TextureLoader().load('./texture/sky.jpeg'),
  // 平面图形显示后面
  side: THREE.DoubleSide,
})
// 里面的黑的外面是亮的 翻转几何体
skyGeometry.scale(1,1,-1) 
// 创建物体 球
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial) 
// 物体球 添加到 场景中
scene.add(skySphere)





