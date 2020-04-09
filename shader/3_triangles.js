let vert = 
    `attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
    }`

let frag = 
    `precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;   
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
            a_Position: gl.getAttribLocation(shaderProgram, "a_Position")
        },
        uniformLocations: {
            u_FragColor: gl.getUniformLocation(shaderProgram, "u_FragColor")
        }
    }
    return programInfo
}

function renderScene(gl, programInfo, vertices, color){
    // 使用指定的着色器程序
    gl.useProgram(programInfo.program)

    // 创建缓冲区对象
    let vertexBuffer = gl.createBuffer()
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW) // STATIC_DRAW表示只写入一次数据
    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(programInfo.attributeLocations.a_Position, 3, gl.FLOAT, false, 0, 0)
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(programInfo.attributeLocations.a_Position)


    // 给uniform变量赋值
    gl.uniform4f(programInfo.uniformLocations.u_FragColor, color.r, color.g, color.b, color.a)

    // 清屏
    gl.clearColor(0., 0., 0., 1.)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 画三角
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

module.exports = {initShader, renderScene}