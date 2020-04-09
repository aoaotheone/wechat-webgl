let vert = 
    `attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.;
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

function renderScene(gl, programInfo, position, color){
    // 使用指定的着色器程序
    gl.useProgram(programInfo.program)

    // 给attribute变量赋值
    gl.vertexAttrib3f(programInfo.attributeLocations.a_Position, position.x, position.y, position.z)

    // 给uniform变量赋值
    gl.uniform4f(programInfo.uniformLocations.u_FragColor, color.r, color.g, color.b, color.a)

    // 清屏
    gl.clearColor(0., 0., 0., 1.)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 画点
    gl.drawArrays(gl.POINTS, 0, 1)
}

module.exports = {initShader, renderScene}