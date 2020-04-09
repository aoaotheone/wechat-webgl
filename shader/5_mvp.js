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

function initShader(gl){
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

    const programInfo = {
        program: shaderProgram,
        attributeLocations: {
            a_Position: gl.getAttribLocation(shaderProgram, "a_Position"),
            a_Color: gl.getAttribLocation(shaderProgram, "a_Color")
        },
        uniformLocations: {
            u_mMatrix: gl.getUniformLocation(shaderProgram, "u_mMatrix"),
            u_vMatrix: gl.getUniformLocation(shaderProgram, "u_vMatrix"),
            u_pMatrix: gl.getUniformLocation(shaderProgram, "u_pMatrix"),
        }
    }
    return programInfo
}

function renderScene(gl, programInfo, vertices, m_Matrix, v_Matrix, p_Matrix){
    // 使用指定的着色器程序
    gl.useProgram(programInfo.program)

    let FSIZE = vertices.BYTES_PER_ELEMENT

    // 创建缓冲区对象
    let vertexBuffer = gl.createBuffer()
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

    // 解除绑定，释放缓冲区内存
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // 给uniform变量赋值
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_mMatrix, false, m_Matrix.elements)
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_vMatrix, false, v_Matrix.elements)
    gl.uniformMatrix4fv(programInfo.uniformLocations.u_pMatrix, false, p_Matrix.elements)

    // 清屏
    gl.clearColor(0., 0., 0., 1.)

    // 开启深度测试
    gl.enable(gl.DEPTH_TEST);
    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // 画三角
    gl.drawArrays(gl.TRIANGLES, 0, 9)
}

module.exports = {initShader, renderScene}