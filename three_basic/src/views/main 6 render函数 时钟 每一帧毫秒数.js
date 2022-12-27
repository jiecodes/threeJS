// 入口文件
import * as THREE from "three"
// 导入轨道控制器 使用控制器查看3d物体
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(THREE)

// 了解three.js中最基本的内容  使用three.js
// 1 创建three一个场景
const scene = new THREE.Scene()
// 2 创建相机   视野角度  宽高(屏幕的宽高) 近光 远光
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
// 3 设置相机对象 位置  x y z
camera.position.set(0, 0, 10)
// 4 相机添加到场景中
scene.add(camera)

// 5 添加物体  
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry();
// 几何体 材质
const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} )
// 根据几何体 材质 创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 将几何体添加到 场景中
scene.add(cube)

// 6 初始化渲染器   坐标轴辅助器,把锯齿去掉{antialias: true}
const renderer = new THREE.WebGLRenderer({antialias: true});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
console.log(renderer)     // 看 domElement:canvas
// 将webgl渲染的 canvas 内容添加到 body
document.body.appendChild(renderer.domElement)         // 文档的body节点添加一个子节点

// 7 使用渲染器 通过相机将场景渲染进来 平面图形    渲染器.渲染(场景,通过相机)
// renderer.render(scene, camera)


// 8 创建轨道控制器     使用控制器查看3d物体  (相机, 用于事件监听的HTML元素)
const controls = new OrbitControls(camera, renderer.domElement)

// 设置时钟 clock跟踪时间处理动画
const clock = new THREE.Clock();

// 7 使用一个 渲染器函数  
function render(time) {

  // 7 使用渲染器 通过相机将场景渲染进来 平面图形    渲染器.渲染(场景,通过相机)
  renderer.render(scene, camera)
  // 浏览器 自带的方法  下一帧(一秒60帧)自动执行这个函数    可以不断的执行渲染器函数
  requestAnimationFrame(render)

  // 设置物体移动 每一帧调用这个
  cube.position.x += 0.008
  // 物体转换
  cube.rotation.x += 0.01
  // if (cube.position.x > 5) {
  //   cube.position.x = 0
  // }

  // console.log(time)   // 每一帧之间的毫秒数
  let t = time / 1000 % 5
  if (cube.position.x > 5) {
    cube.position.x = 0
  } 

  // 获取时钟运行的总时长
  let timeLength = clock.getElapsedTime();
  // 俩次获取时间的间隔、
  let deltaTime = clock.getDelta()
}
// 开启 渲染器函数 
render()

// 9 坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5); 
// 添加到场景中
scene.add(axesHelper);

// 10 设置物体移动    cube 物体
console.log(cube)   // 看 position 属性 位置     scale 缩放    rotation 旋转
cube.position.set(5, 0, 0)    // set 方法
cube.position.x = 3           // 属性

// 11 设置物体缩放  x y z
cube.scale.set(3, 1, 1)
cube.scale.x = 1;

// 12 设置物体旋转    Object3D rotation   Math.PI 180度     Math.PI / 4, 0, 0, x,y,z轴    "YXZ" 旋转顺序
cube.rotation.set(Math.PI / 4, 0, 0, "YXZ" )











