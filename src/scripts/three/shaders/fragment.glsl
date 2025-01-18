precision mediump float;

uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uNoiseTexture;
uniform vec2 uResolution;
uniform float uTime;

#define PI 3.14159265

float easeOutExpo(float x) {
  if(x == 1.0) {
    return 1.0;
  }
  return 1.0 - pow(2.0, -10.0 * x);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec4 noise = texture2D(uNoiseTexture, uv);

  // 画像のディストーションの強さ
  float intensity = 0.06;

  // uTimeを0.0〜1.0の値にする
  float sinedTime =(sin(uTime) + 1.0) * 0.5;
  float sinedTimeMinus = (cos(uTime + (PI * 0.5)) + 1.0) * 0.5;

  // ノイズテクスチャのrgの量とuvの距離を取る
  float dist = distance(uv, vec2(noise.r, noise.g));
  // テクスチャ0と1で逆方向に動かす
  float dist0 = dist * sinedTime;
  float dist1 = dist * sinedTimeMinus;

  vec2 coord0 = uv + dist0 * intensity;
  vec2 coord1 = uv + dist1 * intensity;

  vec4 texture0 = texture2D(uTexture0, coord0);
  vec4 texture1 = texture2D(uTexture1, coord1);

  vec4 mixed = mix(texture0, texture1, sinedTime);
  gl_FragColor = mixed;
}