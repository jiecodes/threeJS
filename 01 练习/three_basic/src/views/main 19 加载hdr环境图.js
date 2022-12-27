// 入口文件
import * as THREE from "three"
// 导入轨道控制器 使用控制器查看3d物体
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 导入动画库 npm安装的  gsap
import gsap from 'gsap';
// 导入dat.gui  控制物体
import * as dat from 'dat.gui'
// 导入RGBE 用于加载hdr环境图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 加载hdr环境图
const rgbeLoader = new RGBELoader() 
// 异步加载方法
rgbeLoader.loadAsync('./textures/6fbf48314a06098fa51044f0cc00d203.jpeg').then(texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture
})
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

// 环境贴图
// 设置 cube纹理加载器    load加载方法 得到环境的纹理贴图
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
  './textures/fd16b7789ba82ca41985b23620460685.jpeg',
  './textures/fd16b7789ba82ca41985b23620460685.jpeg',
  './textures/fd16b7789ba82ca41985b23620460685.jpeg',
  './textures/fd16b7789ba82ca41985b23620460685.jpeg',
  './textures/fd16b7789ba82ca41985b23620460685.jpeg',
  './textures/fd16b7789ba82ca41985b23620460685.jpeg', 
])
// 几何体 (球缓冲几何体)          1半径 20,20经纬线
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
// 材质 (标准网格材质)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,       // 金属材质
  roughness: 0.1,       // 光滑 光照
  envMap: envMapTexture   // 贴上环境贴图
})
// 几何体 材质 添加到 物体中 
const sphere = new THREE.Mesh(sphereGeometry,material)
// 物体 添加到 场景中
scene.add(sphere)
// 灯光 下面有
// 场景光亮     添加场景背景
scene.background = envMapTexture
 



// 创建div 把进度百分比显示出来
// var div = document.createElement('div')     // 创建元素 div
// div.className = 'div1'
// div.style.width = '200px'               // div样式
// div.style.height = '200px'
// div.style.color = '#fff'
// div.style.position = 'fixed'
// div.style.top = 0
// div.style.left = 0
// document.body.appendChild(div)    // 把创建的div添加到body中
// // 纹理加载器(TextureLoader)
// let event = {};
// event.onLoad = function() {
//   console.log('图片加载完毕')
// }
// event.onProgress = function(url, num, total) {
//   console.log(url + '地址')
//   console.log(num + '加载到第几个 进度')
//   console.log(total + '加载总数')
//   let value = ((num / total) * 100).toFixed(2) + '%'
//   console.log('图片加载进度百分比' + value)
//   div.innerHTML = value       // div的内容是value
// }
// event.onError = function(e) {
//   console.log(e)
//   console.log('图片加载错误')
// }
// // 设置加载管理器(LoadingManager)
// const manager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)


// // 5 添加物体  
// // 导入纹理
// const textureLoader = new THREE.TextureLoader(manager)
// // 导入图片
// const doorColorTexture = textureLoader.load("./textures/f3a87bc27c98bc62cdbcc4fa05e282d4.jpeg")
// // 贴图 第二张图片
// const doorColorTexture1 = textureLoader.load("./textures/a2442e413e133a67b99e883f04ee2e5a.jpeg")
// // 导入置换图片
// const heightTexture = textureLoader.load("./textures/283507af6ac7d7354aa751e70e93d58f.jpeg")
// // console.log(doorColorTexture)

// // 标准网格材质(MeshStandardMaterial)  PBR  显示的是黑的 需要灯光和表面属性
// // 创建几何体
// const cubeGeometry = new THREE.BoxGeometry();
// // 耗内存
// // const cubeGeometry = new THREE.BoxGeometry(1,1,1,100,100,100);
// // 几何体 材质 标准网格材质
// const meshMaterial = new THREE.MeshStandardMaterial( {
//   color: 0xffffff, 
//   // 颜色贴图。   展示贴图
//   // map: doorColorTexture,
//   map: doorColorTexture1,
//   // 纹理透明
//   alphaMap: doorColorTexture1,
//   transparent: true,
//   // 贴图的第二个图片
//   aoMap: doorColorTexture, 
//   // 贴图的强度
//   aoMapIntensity: 0.5,
//   // opacity: 0.5,
//   // 平面图形显示后面
//   side: THREE.DoubleSide,
//   // 置换属性 突出的位置
//   displacementMap: heightTexture,
//   // 位移的比例
//   displacementScale: 0.05,
//   // 粗糙度
//   roughness: 0,
//   // 导入粗糙度贴图图片  可以和粗糙度 两个值相乘
//   // roughnessMap: 
//   // 金属材质
//   // metalness: 1,
//   // 金属材质贴图
//   // metalnessMap: 
//   // 导入的法线贴图
//   // normalMap: 
  
//  })
// //  meshMaterial.side = THREE.DoubleSide
// // 根据几何体 材质 创建物体
// const cube = new THREE.Mesh(cubeGeometry, meshMaterial)
// // 将几何体添加到 场景中
// scene.add(cube)
// // 给中心的几何体设置第二组uv 俩张图叠一起    2 x和y轴俩个值作为一个点
// cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

// // 添加平面     平面图形  1,1, x,y    200,200 突出长度
// const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200)
// // 将图形和材质添加到 平面内
// const plane = new THREE.Mesh(planeGeometry, meshMaterial);
// // 平面的位置
// plane.position.set(3, 0, 0)
// // 平面添加到场景中
// scene.add(plane)
// // 给平面设置第二组uv 俩张图叠一起
// planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
// console.log(plane)      // Mesh->geometry->attributes->uv

// 灯光    0x404040颜色     0.5强度
const light = new THREE.AmbientLight( 0x404040, 0.5); // soft white light
scene.add( light );
// 平行光（DirectionalLight）
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// 设置显示的位置 光照的位置
directionalLight.position.set(10, 10, 10)
scene.add( directionalLight );



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
// cube.rotation.set(Math.PI / 4, 0, 0, "YXZ" )

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
  color: "#ffffee",
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














