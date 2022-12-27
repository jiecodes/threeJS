// 3D导弹飞行


import * as THREE from "three" 
// 导入控制器 控制三维物体
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 添加模型前 需要导入gltf库  把glb转换为gltf文件
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader'
// 导入解压文件库
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入天空纹理 hdr图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入 着色器 显示爆炸
import fragmentShader from '../shaders/ew/fragmentShader.glsl'
import vertexShader from "../shaders/ew/vertexShader.glsl";
import { SpriteMaterial } from "three";

// 申明导弹 俄罗斯地图 乌克兰地图 曲线
let missile, mapels, mapwkl, curvePath


// 1 初始化场景
const scene = new THREE.Scene();
// 2 初始化相机(看见内容)   透视相机   75相机角度    0.1,1000相机看到的最近距离和最远距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
// 相机位置
camera.position.set(0, 0, 5)
// 更新摄像头的宽高比例
camera.aspect = window.innerWidth / window.innerHeight
// 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
camera.updateProjectionMatrix();
// 相机放到场景中 
scene.add(camera)

// 3 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // 可以看到背景图
  // alpha: true,
})
// 渲染器 输出编码
renderer.outputEncoding = THREE.sRGBEncoding;
// 设置渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染器添加到页面
document.body.appendChild(renderer.domElement)

// 4 实例化控制器   把摄像机和渲染器添加到控制器中
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// 5 加载模型 glb文件 转换为gltf文件
let gltfLoader = new GLTFLoader();
// 加入 图片
gltfLoader.load('./assets/ew/ew8.glb', (gltf) => {
  // scene.add(gltf.scene)
  console.log(gltf.scene)
  // 导弹
  missile = gltf.scene.children[3]
  // 俄罗斯地图
  mapels = gltf.scene.children[0]
  // 乌克兰地图
  mapwkl = gltf.scene.children[1]
  // 曲线
  curvePath = gltf.scene.children[2]
  scene.add(missile)
  scene.add(mapels)
  scene.add(mapwkl)

  // 根据点 生成 曲线  geometry-attributes-position-count
  let points = []
  // 将点添加到数组中
  for (let i = curvePath.geometry.attributes.position.count - 1;i >= 0; i--) {
    points.push(
      new THREE.Vector3 (
        curvePath.geometry.attributes.position.array[i * 3],
        curvePath.geometry.attributes.position.array[i * 3 + 1],
        curvePath.geometry.attributes.position.array[i * 3 + 2],
      )
    )
  }
  // 创建曲线
  curvePath = new THREE.CatmullRomCurve3(points)
}) 

// 创建灯光 一个平行光
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
// 光源位置
dirLight.position.set(0, 10, 5)
scene.add(dirLight)
// 再添加一个平行光
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1)
// 光源位置
dirLight2.position.set(0, -10, -5)
scene.add(dirLight2)

// 设置shader材质
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      // value: new THREE.Vector2(800, 800),
    },
    iTime: {
      value: 0,
    },
    iChannel0: {
      value: new THREE.TextureLoader().load("assets/ew/ichannel0.png"),
    },
    iChannel1: {
      value: new THREE.TextureLoader().load("assets/ew/ichannel1.png"),
    },
    iChannel2: {
      value: new THREE.TextureLoader().load("assets/ew/ichannel2.png"),
    },
    iMouse: {
      value: new THREE.Vector2(0, 0),
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});
// 添加平面到场景
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);

// 添加sprite
// 创建精灵材质
const params = {
  iTime: {
    value: 0,
  },
};
let spriteMaterial = new SpriteMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending,
});
spriteMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  };
  shader.uniforms.iTime = params.iTime;
  shader.uniforms.iChannel0 = {
    value: new THREE.TextureLoader().load("assets/ew/ichannel0.png"),
  };
  shader.uniforms.iChannel1 = {
    value: new THREE.TextureLoader().load("assets/ew/ichannel1.png"),
  };
  shader.uniforms.iChannel2 = {
    value: new THREE.TextureLoader().load("assets/ew/ichannel2.png"),
  };
  shader.uniforms.iMouse = { value: new THREE.Vector2(0, 0) };
  console.log(shader.vertexShader);
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    varying vec2 vUv;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <uv_vertex>",
    `
    #include <uv_vertex>
    vUv = uv;
    `
  );
  shader.fragmentShader = fragmentShader;
};
// const sprite = new THREE.Sprite(planeMaterial);
const sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(-5.5, 0.8, 0);

// 设置爆炸 精灵图
// let spriteMaterial = new THREE.SpriteMaterial({
//   // map: new THREE.TextureLoader().load('./assets/fire.png'),
//   color: 0xffffff,
//   transparent: true,
//   blending: THREE.AdditiveBlending,
// })
// let sprite = new THREE.Sprite(spriteMaterial)

// 添加声音
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("assets/ew/bomb.mp3", (buffer) => {
  sound.setBuffer(buffer);
  // sound.setLoop(true);
  sound.setVolume(0.5);
  // sound.play();
});
 
// 创建 clock 导弹运动
const clock = new THREE.Clock();

// 渲染函数
function render() {
  // 获取总耗时
  let delta = clock.getDelta();
  // 设置5秒循环一次
  let t = clock.getElapsedTime() % 5;
  t = t / 5;
  // 设置导弹飞行路径 
  // 先判断 curvePath 是否存在,如果存在设置导弹飞行路径
  if (curvePath) {
    // 导弹飞行路径
    missile.position.copy(curvePath.getPointAt(t))
    // 小于1 设置导弹飞行方向
    if (t + 0.1 < 1) {
      // 导弹飞行方向
      missile.lookAt(curvePath.getPointAt(t + 0.01))
    }
    if (t > 0.95) {
      scene.add(sprite);
      // 判断声音是否播放，如果没有播放则播放
      if (!sound.isPlaying) {
        sound.play();
      }
    }
  }
  params.iTime.value = t * 10;
  // 渲染场景
  renderer.render(scene, camera)
  // 引擎自动更新渲染器   请求动画帧不断调用render函数 一帧一帧的渲染出来
  requestAnimationFrame(render)
}
render()

// 监听屏幕大小发生改变 监听渲染器的宽高,相机的比例
window.addEventListener("resize", () => {
  // 页面自适应  更新摄像头的宽高比例
  camera.aspect = window.innerWidth / window.innerHeight; 
  // 页面大小发生变化,重新进行计算 更新摄像头的视觉范围
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})





