<template>
  <div id="app">
    <div class="canvasContainer" ref="canvasContainer"></div>
    <div class="header">
      <div class="logo">图标</div>
      <div class="right">
        <div class="right_item" v-for="(item, index) in rights">{{item}}</div>
      </div>
    </div>
    <div class="pages" ref="pages">
      <div class="page">
        <h2>哈哈哈哈哈哈哈</h2>
        <p>好玩的技术</p>
      </div>
      <div class="page">
        <h2>哈哈哈哈哈哈哈1</h2>
        <p>好玩的技术1</p>
      </div>
      <div class="page">
        <h2>哈哈哈哈哈哈哈2</h2>
        <p>好玩的技术2</p>
      </div>
    </div>
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

let rights = ['首页', '模型', '我的']


onMounted(() => {
  console.log(canvasContainer.value)
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
  // 把渲染器 渲染到页面中
  canvasContainer.value.appendChild(renderer.domElement)

  // 创建辅助 坐标轴
  let axes = new THREE.AxesHelper(5);
  scene.add(axes)
  
  // 添加控制器 可以360度查看汽车
  // const controls = new OrbitControls(camera, renderer.domElement)
  // // 控制器阻尼
  // controls.enableDamping = true
  // // 页面改变 控制器更新
  // controls.update();

  // 创建背景 星空
  let url = './assets/3DCool/25s.jpg'
  // 纹理地址
  let envTexture = new THREE.TextureLoader().load(url)
  // 球形包裹
  envTexture.mapping = THREE.EquirectangularRefractionMapping;
  // 场景背景  纹理背景
  scene.background = envTexture
  // 场景背景  纹理环境
  scene.environment = envTexture

  // 设置解压缩加载器 DRACOLoader
  let dracoLoader = new DRACOLoader();
  // 设置解压缩的 路径
  dracoLoader.setDecoderPath('./assets/draco/gltf/')
  // 设置解压缩的 配置类
  dracoLoader.setDecoderConfig({ type: "js"})
  // 加载 转换gltf文件  设置显示人物  glb转换gltg文件
  let gltfLoader = new GLTFLoader()
  // 解压 gltf文件
  gltfLoader.setDRACOLoader(dracoLoader);
  // 添加 转换gltf文件
  gltfLoader.load('./assets/3DCool/xz.glb', (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.position.set(3, 0, 0)
    // 模型加载到 场景中
    scene.add(gltf.scene)

    window.addEventListener('mousemove', (e) => {
      console.log(e)
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      // gsap 动画库 使用
      let timeline = gsap.timeline();
      // 设置物体旋转
      timeline.to(gltf.scene.rotation, { duration: 0.5, x: y, y: x, duration: 1,  })
    } )
  })
  // 添加 转换gltf文件
  gltfLoader.load('./assets/3DCool/xq6.glb', (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.position.set(3, -8, 0)
    // 模型加载到 场景中
    scene.add(gltf.scene)

    window.addEventListener('mousemove', (e) => {
      console.log(e)
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      // gsap 动画库 使用
      let timeline = gsap.timeline();
      // 设置物体旋转
      timeline.to(gltf.scene.rotation, { duration: 0.5, x: y, y: x, duration: 1,  })
    } )
  })
  // 添加 转换gltf文件
  gltfLoader.load('./assets/3DCool/gr75.glb', (gltf) => {
    // gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.position.set(3, -16, 0)
    // 模型加载到 场景中
    scene.add(gltf.scene)

    window.addEventListener('mousemove', (e) => {
      console.log(e)
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      // gsap 动画库 使用
      let timeline = gsap.timeline();
      // 设置物体旋转
      timeline.to(gltf.scene.rotation, { duration: 0.5, x: y, y: x, duration: 1,  })
    } )
  })

  // 监听鼠标滚动、
  let page = 0;     // 当前页数
  let timeline2 = gsap.timeline();        // 动画时间线
  window.addEventListener('mousewheel', (e) => {
    // console.log(e)
    if (e.wheelDelta < 0) {
      page++;
      if (page > 2) {
        page = 2
      }
    }
    if (e.wheelDelta > 0) {
      page--;
      if (page < 0) {
        page = 0
      }
    }
    if (!timeline2.isActive()) {
      // 动画
      timeline2.to(camera.position, {
        duration: 0.5,
        y: page * -8,
        duration: 1,  
      })
      gsap.to(pages.value, {
        duration: 1,
        y: -page * window.innerHeight,
        duration: 1,
      });
    }
  })

  loader.load('./assets/3DCool/moon.glb', (gltf) => {
    let moon = gltf.scene.children[0];
    for (let j = 0; j < 10; j++ ) {
      let moonInstance = new THREE.InstancedMesh(
        moon.geometry,
        moon.material,
        1000
      )
      // 循环100次
      for (let i = 0; i < 100; i++) {
        let x = Math.random() * 1000 - 500
        let y = Math.random() * 1000 - 500
        let z = Math.random() * 1000 - 500
        let matrix = new THREE.Matrix4();
        let size = Math.random() * 10 - 8;
        matrix.makeScale(size, size, size)
        matrix. makeTranslation(x, y, z);
        moonInstance. setMatrixAt(i, matrix);
      }
      gsap.to(moonInstance.position, {
        duration: Math.random() * 10 + 2,
        z: -1000,
        ease: 'linear',
        repeat: -1,
      })
      scene.add(moonInstance)
    }
  })

  // 模型加载到页面中 显示是黑色 添加灯光显示亮度
  let light1 = new THREE.DirectionalLight(0xffffff, 1)
  light1.position.set(0, 0, 1)
  scene.add(light1)
  let light2 = new THREE.DirectionalLight(0xffffff, 0.5)
  light2.position.set(0, 0, -1)
  scene.add(light2)
  // 环绕光
  let light3 = new THREE.AmbientLight(0xffffff, 0.5)
  light3.position.set(0, 0, -1)
  scene.add(light3)







  

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

.canvasContainer {
  width: 100vw;
  height: 100vh;
}
.header {
  color: white;
}
.logo {
  position: fixed;
  top: 20px;
  left: 45px;
}
.right {
  position: fixed;
  top: 20px;
  right: 30px;
  display: flex;
}
.right_item {
  padding-left: 20px;
}
/* .pages {
  position: fixed;
  left: 40%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
} */
.pages {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}
.pages .page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #fff;
  padding: 15%;
  box-sizing: border-box;
}

</style>