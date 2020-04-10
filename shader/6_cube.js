let vert = 
    `attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_mMatrix;
    uniform mat4 u_vMatrix;
    uniform mat4 u_pMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_pMatrix * u_vMatrix * u_mMatrix * a_Position; // 这里的乘法顺序不能变
        v_Color = a_Color;   
    }`

let frag = 
    `precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;   
    }`

const programInfo = {}
let gl
function initShader(webgl){
    gl = webgl
    // 创建定点着色器
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader, vert)
    gl.compileShader(vertShader)

    // 创建顶点着色器
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, frag)
    gl.compileShader(fragShader)

    // 创建着色器程序
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragShader)
    gl.linkProgram(shaderProgram)

    programInfo.program = shaderProgram,
    programInfo.attributeLocations = {
            a_Position: gl.getAttribLocation(shaderProgram, "a_Position"),
            a_Color: gl.getAttribLocation(shaderProgram, "a_Color")
    }
    programInfo.uniformLocations = {
            u_mMatrix: gl.getUniformLocation(shaderProgram, "u_mMatrix"),
            u_vMatrix: gl.getUniformLocation(shaderProgram, "u_vMatrix"),
            u_pMatrix: gl.getUniformLocation(shaderProgram, "u_pMatrix"),
    }
}



let indexBuffer, vertexBuffer, FSIZE
function renderScene(vertices, indices, m_Matrix, v_Matrix, p_Matrix){
    // 使用指定的着色器程序
    gl.useProgram(programInfo.program)

    FSIZE = vertices.BYTES_PER_ELEMENT

    // 创建缓冲区对象
    vertexBuffer = gl.createBuffer()
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW) // STATIC_DRAW表示只写入一次数据
    
    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(programInfo.attributeLocations.a_Position, 3, gl.FLOAT, false, 6*FSIZE, 0)
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(programInfo.attributeLocations.a_Position)
    
    // 将缓冲区对象分配给a_Color变量
    gl.vertexAttribPointer(programInfo.attributeLocations.a_Color, 3, gl.FLOAT, false, 6*FSIZE, 3*FSIZE)
    // 连接a_Color变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(programInfo.attributeLocations.a_Color)
    // // // 解除绑定，释放缓冲区内存
    // gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // 创建顶点索引缓冲区对象
    indexBuffer = gl.createBuffer()
    // 将顶点索引写入到缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    // 给uniform变量赋值
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_mMatrix, false, m_Matrix.elements)
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_vMatrix, false, v_Matrix.elements)
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_pMatrix, false, p_Matrix.elements)

    // 清屏
    gl.clearColor(0., 0., 0., 0.)

    // 开启深度测试
    gl.enable(gl.DEPTH_TEST)
    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // 通过率顶点索引画矩形体
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

function updateMvp (m_Matrix, v_Matrix, p_Matrix){
    gl.useProgram(programInfo.program)

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    
    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(programInfo.attributeLocations.a_Position, 3, gl.FLOAT, false, 6*FSIZE, 0)
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(programInfo.attributeLocations.a_Position)
    
    // 将缓冲区对象分配给a_Color变量
    gl.vertexAttribPointer(programInfo.attributeLocations.a_Color, 3, gl.FLOAT, false, 6*FSIZE, 3*FSIZE)
    // 连接a_Color变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(programInfo.attributeLocations.a_Color)

    // 将顶点索引写入到缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    // 给uniform变量赋值
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_mMatrix, false, m_Matrix.elements)
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_vMatrix, false, v_Matrix.elements)
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_pMatrix, false, p_Matrix.elements)

    // // 清屏颜色
    // gl.clearColor(0., 0., 0., 1.)

    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // 通过率顶点索引画矩形体
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0) // 8为矩形体顶点个数重复使用为36个
}

function Cube(width, height, depth){
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    this.minX = -0.5 * width
    this.maxX = 0.5 * width
    this.minY = -0.5 * height
    this.maxY = 0.5 * height
    this.minZ = -0.5 * depth
    this.maxZ = 0.5 *depth
    this.width = width
    this.height = height
    this.depth = depth
  }
  Cube.prototype = {
    constructor: Cube,
    getDefaultVertices: function(){
        return new Float32Array([
            this.maxX, this.maxY, this.maxZ, 1.0, 1.0, 1.0,  // v0 White
            this.minX, this.maxY, this.maxZ, 1.0, 0.0, 1.0,  // v1 Magenta
            this.minX, this.minY, this.maxZ, 1.0, 0.0, 0.0,  // v2 Red
            this.maxX, this.minY, this.maxZ, 1.0, 1.0, 0.0,  // v3 Yellow
            this.maxX, this.minY, this.minZ, 0.0, 1.0, 0.0,  // v4 Green
            this.maxX, this.maxY, this.minZ, 0.0, 1.0, 1.0,  // v5 Cyan
            this.minX, this.maxY, this.minZ, 0.0, 0.0, 1.0,  // v6 Blue
            this.minX, this.minY, this.minZ, 1.0, 0.0, 1.0   // v7 Black
          ])
    },
    indices: new Uint8Array([
      0, 1, 2, 0, 2, 3,    // 前
      0, 3, 4, 0, 4, 5,    // 右
      0, 5, 6, 0, 6, 1,    // 上
      1, 6, 7, 1, 7, 2,    // 左
      7, 4, 3, 7, 3, 2,    // 下
      4, 7, 6, 4, 6, 5     // 后
    ]),
    setPosition: function(x, y, z){
  
    }
  }

module.exports = {initShader, renderScene, updateMvp, Cube}