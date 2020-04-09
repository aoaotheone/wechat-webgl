let vert = 
    `void main(){
        gl_Position = vec4(0., 0., 0., 1.);
        gl_PointSize = 10.;
    }`

let frag = 
    `void main(){
        gl_FragColor = vec4(1., 1., 1., 1.);
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

    return shaderProgram
}

function renderScene(gl, shaderProgram){
    // 使用指定的着色器程序
    gl.useProgram(shaderProgram)

    // 清屏
    gl.clearColor(0., 0., 0., 1.)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 画点
    gl.drawArrays(gl.POINTS, 0, 1)
}

module.exports = {initShader, renderScene}