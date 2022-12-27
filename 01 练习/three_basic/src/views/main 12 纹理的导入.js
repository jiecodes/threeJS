// 入口文件
import * as THREE from "three"
// 导入轨道控制器 使用控制器查看3d物体
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 导入动画库 npm安装的  gsap
import gsap from 'gsap';
// 导入dat.gui  控制物体
import * as dat from 'dat.gui'


console.log(THREE)

// 了解three.js中最基本的内容  使用three.js       canvas
// 1 创建three一个场景
const scene = new THREE.Scene()
// 2 创建相机   视野角度  宽高(屏幕的宽高) 近光 远光
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
// 3 设置相机对象 位置  x y z
camera.position.set(0, 0, 10)
// 4 相机添加到场景中
scene.add(camera)

// 5 添加物体  
// 导入纹理
const textureLoader = new THREE.TextureLoader()
// 导入图片
const doorColorTexture = textureLoader.load("./textures/f3a87bc27c98bc62cdbcc4fa05e282d4.jpeg")
console.log(doorColorTexture)
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry();
// 几何体 材质
const cubeMaterial = new THREE.MeshBasicMaterial( {
  color: 0xffff00, 
  // 颜色贴图。   展示贴图
  map: doorColorTexture,
 } )
// 根据几何体 材质 创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 将几何体添加到 场景中
scene.add(cube)
// console.log(cubeGeometry)



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
// 设置控制器的阻尼(拖动慢慢停下来) 让控制器更加真实 然后动画循环里调用 .update()
controls.enableDamping = true;

// 设置时钟 clock跟踪时间处理动画
const clock = new THREE.Clock();

// 13 设置动画 gsap     设置物体的位置    x:5 x轴移动的位置 duration:5秒 移动一共要花费的时间     x: Math.PI * 2 旋转360度  ease动画快慢(gsap)
// var animation1 = gsap.to(cube.position, { x: 5, duration: 5, ease: "power1.out", 
//     // 设置重复次数 无限循环-1 
//     repeat: 2,
//     // 往返移动
//     yoyo: true,
//     // 延迟2秒运动
//     delay: 2,
//     onComplete: () => {
//       console.log('动画结束')
//     },
//     onStart: () => {
//       console.log('动画开始')
//     }
//   })
// gsap.to(cube.rotation, { x: Math.PI * 2 , duration: 5, ease: "power1.out",})
// window 添加窗口监听事件
window.addEventListener('dblclick', () => {
  console.log(animation1)
  if (animation1.isActive()) {
    // true   暂停动画 
    animation1.pause();
  } else {
    // 开启动画
    animation1.resume()
  }
})
 // window 添加窗口监听事件 点击画布进入全屏
window.addEventListener('dblclick', () => {
  // 单击 退出全屏      原生全屏属性 (document.fullscreenElement) 
  const fullscreenElement = document.fullscreenElement       // 获取是否全屏
  console.log(fullscreenElement)
  if (!fullscreenElement) {
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
})

// 7 使用一个 渲染器函数  
function render(time) {
  // 调用动画阻尼
  controls.update();

  // 7 使用渲染器 通过相机将场景渲染进来 平面图形    渲染器.渲染(场景,通过相机)
  renderer.render(scene, camera)
  // 浏览器 自带的方法  下一帧(一秒60帧)自动执行这个函数    可以不断的执行渲染器函数
  requestAnimationFrame(render)

  // 设置物体移动 每一帧调用这个
  // cube.position.x += 0.008
  // // 物体旋转
  // cube.rotation.x += 0.01
  // if (cube.position.x > 5) {
  //   cube.position.x = 0
  // }

  // // console.log(time)   // 每一帧之间的毫秒数
  // let t = time / 1000 % 5 
  // cube.position.x = t * 1
  // if (cube.position.x > 5) {
  //   cube.position.x = 0
  // } 

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
// console.log(cube)   // 看 position 属性 位置     scale 缩放    rotation 旋转
// cube.position.set(5, 0, 0)    // set 方法
// cube.position.x = 3           // 属性

// 11 设置物体缩放  x y z
cube.scale.set(3, 1, 1)
cube.scale.x = 1;

// 12 设置物体旋转    Object3D rotation   Math.PI 180度     Math.PI / 4, 0, 0, x,y,z轴    "YXZ" 旋转顺序
cube.rotation.set(Math.PI / 4, 0, 0, "YXZ" )

// 13 页面自适应 监听画面变化 更新渲染画面
window.addEventListener('resize', () => {
  // console.log('页面发生改变')
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})

// 14 dat.gui 初始化 控制物体      step 步长(每次移动的长度)
const gui = new dat.GUI()
gui.add(cube.position, "x").min(0).max(5).step(0.01).name('移动x轴。。')
  .onChange(vlaue => {
    console.log('值修改了' + vlaue)
  })
  .onFinishChange(vlaue => {
    console.log('完全停下来' + vlaue)
  })
// 修改物体颜色
const params = {
  color: "#ffff00",
  // 函数 让立方体运动起来   yoyo:往返移动  repeat:循环
  fun: () => {
    gsap.to(cube.position, {x: 5, duration: 2, yoyo: true, repeat: -1})
  }
}
gui.addColor(params, "color").onChange(value => {
  console.log("颜色值修改了" + value)
  cube.material.color.set(value) 
})
console.log(cube)   // Mesh 里面有 visible属性 
// 展示选项框 是否显示
gui.add(cube, 'visible').name('是否显示')
// 设置按钮点击触发某个事件
gui.add(params, 'fun').name('点击运动')
// 文件下 设置立方体镂空
var folder = gui.addFolder('立方体镂空')
folder.add(cube.material, 'wireframe')














