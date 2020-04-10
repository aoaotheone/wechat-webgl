//index.js
//获取应用实例
const {Matrix4, Vector3, Vector4} = require("../../utils/cuon-matrix")
const app = getApp()
// const {initShader, renderScene} = require("../../shader/1_point")
// const {initShader, renderScene} = require("../../shader/2_point")
// const {initShader, renderScene} = require("../../shader/3_triangles")
// const {initShader, renderScene} = require("../../shader/4_triangles_varying")
// const {initShader, renderScene} = require("../../shader/5_mvp")
const {initShader, renderScene, updateMvp, Cube} = require("../../shader/6_cube")
let canvas, gl, width, height
Page({
  data: {
    selector: ["1_point","2_ponit(变量)","2_ponit(变量)","2_ponit(变量)","2_ponit(变量)"],
    height: 300
  },
  onLoad() {
  },
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#webglCanvas').node().exec((res) => {
      canvas = res[0].node
      // console.log(canvas)
      // console.log(wx.getSystemInfoSync())
      const info = wx.getSystemInfoSync()
      // canvas._width = info.safeArea.width
      width = info.safeArea.width
      height = info.safeArea.bottom
      canvas.height = info.safeArea.bottom
      canvas._height = info.safeArea.bottom
      this.setData({
        height
      })
      gl = canvas.getContext('webgl', { alpha: true })
      gl.clearColor(0., 0., 0., 0.)
      gl.clear(gl.COLOR_BUFFER_BIT)
      this.render_6_cube()
    })
  },
  render_1_point(){
    let shaderProgram = initShader(gl)
    renderScene(gl, shaderProgram)
  },
  render_2_point(){
    let programInfo = initShader(gl)
    let position = {
      x: 0.,
      y: 0.5,
      z: 0
    }
    let color = {
      r: 0.,
      g: 1.,
      b: 0.,
      a: 1.
    }
    renderScene(gl, programInfo, position, color)
  },
  render_3_triangles(){
    let programInfo = initShader(gl)
    let vertices = new Float32Array([
      0., 200 / height, 0., 
      -200 / width, -200 / height, 0.,
      200 / width, -200 / height, 0.
    ]);
    let color = {
      r: 0.,
      g: 1.,
      b: 0.,
      a: 1.
    }
    renderScene(gl, programInfo, vertices, color)
  },
  render_4_triangles_varying(){
    let programInfo = initShader(gl)
    let vertices = new Float32Array([
      0., 200 / height, 0., 1., 0., 0.,
      -200 / width, -200 / height, 0., 0., 1., 0.,
      200 / width, -200 / height, 0., 0., 0., 1.
    ])
    renderScene(gl, programInfo, vertices)
  },
  render_5_mvp(){
    let programInfo = initShader(gl)

    let vertices = new Float32Array([
      -1, 1.0, -2.0, 0.4, 1.0, 0.4,  //绿色在后
    -2, -1.0, -2.0, 0.4, 1.0, 0.4,
    0, -1.0, -2.0, 1.0, 0.4, 0.4,

    0.0, 1.0, 0., 1.0, 1.0, 0.4, //黄色在中
    -1, -1.0, 0., 1.0, 1.0, 0.4,
    1, -1.0, 0., 1.0, 0.4, 0.4,

    1, 1.0, 2.0, 0.4, 0.4, 1.0,  //蓝色在前
    0, -1.0, 2.0, 0.4, 0.4, 1.0,
    2, -1.0, 2.0, 1.0, 0.4, 0.4,
    ])

    // 模型矩阵
    let m_Matirx = new Matrix4()
    m_Matirx.setRotate(-45, 0, 0, 1) // 绕z-轴旋转45度
    // m_Matirx.setTranslate(0.5, 0, 0) // 绕z-轴旋转45度

    // 视图矩阵
    let v_Matrix = new Matrix4()
    v_Matrix.setLookAt(0, 0, 10, 0, 0, -100, 0, 1, 0) // 相机在（0，0，5），朝向（0， 0， -100）， y轴为天上

    // 投影矩阵
    let p_Matrix = new Matrix4()
    p_Matrix.setPerspective(60, width / height, 1, 100) // 同three.js透视相机参数

    renderScene(gl, programInfo, vertices, m_Matirx, v_Matrix, p_Matrix)
  },
  render_6_cube(){
    initShader(gl)

    // 模型矩阵
    let m_Matirx = new Matrix4()
    m_Matirx.setRotate(0, 0, 1, 0) // angel, x, y, z
    // m_Matirx.setTranslate(0.5, 0, 0) // 平移

    // 投影矩阵
    let fov = 60
    let p_Matrix = new Matrix4()
    p_Matrix.setPerspective(fov, width / height, 1, 100) // 同three.js透视相机参数

    // 视图矩阵
    // let angle = fovy / 2 * Math.PI / 180.0; 
    // let eyeHight = (cube.height() * 1.2) / 2.0 / angle

    let v_Matrix = new Matrix4()
    v_Matrix.setLookAt(0, 5, 10, 0, 0, 0, 0, 1, 0) // 相机在（0，0，5），朝向（0， 0， -100）， y轴为天上

    let cube = new Cube(2, 2, 2)
    renderScene(cube.getDefaultVertices(), cube.indices, m_Matirx, v_Matrix, p_Matrix)

    let angel = 0

    function loop(){
      angel++ 
      if(angel >= 360) angel = 0
      m_Matirx.setRotate(angel, 0, 1, 0)
      updateMvp(m_Matirx, v_Matrix, p_Matrix)
      canvas.requestAnimationFrame(loop)
    }
    loop()
  }
})
