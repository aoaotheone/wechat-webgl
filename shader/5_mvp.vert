attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_mMatrix;
uniform mat4 u_vMatrix;
uniform mat4 u_pMatrix;
varying vec4 v_Color;
void main(){
    gl_Position = u_mMatrix * u_vMatrix * u_pMatrix * a_Position;
    v_Color = a_Color;   
}