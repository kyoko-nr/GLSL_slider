precision mediump float;

uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uNoiseTexture;
uniform vec2 uResolution;
uniform float uTime;
uniform float uRatio;
uniform bool uForward;

#define PI 3.14159265
#define ImageWidth 2400.0
#define ImageHeight 1600.0

float easeOutExpo(float x) {
  if(x == 1.0) {
    return 1.0;
  }
  return 1.0 - pow(2.0, -10.0 * x);
}

vec2 fitToDisplay(vec2 uv, vec2 resolution) {
  float dAspect = resolution.x / resolution.y;
  float iAspect = ImageWidth / ImageHeight;
  vec2 ration = vec2(
    min(dAspect / iAspect, 1.0),
    min(iAspect / dAspect, 1.0)
  );

  vec2 newUv = vec2(
    (uv.x - 0.5) * ration.x + 0.5,
    (uv.y - 0.5) * ration.y + 0.5
  );

  return newUv;
}

void main() {
  vec2 tempUv = gl_FragCoord.xy / uResolution;
  vec2 uv = fitToDisplay(tempUv, uResolution);

  vec4 noise = texture2D(uNoiseTexture, uv);

  // 画像のディストーションの強さ
  float intensity = 0.06;

  // uTimeを0.0〜1.0の値にする
  // sinedTimeが0.0の時にsignedTimeMinusは1.0、1.0の時に0.0になる
  float sinedTime =(sin(uRatio) + 1.0) * 0.5;
  // float sinedTime =(sin(uTime) + 1.0) * 0.5;
  float sinedTimeMinus = (cos(uRatio + (PI * 0.5)) + 1.0) * 0.5;
  // float sinedTimeMinus = (cos(uTime + (PI * 0.5)) + 1.0) * 0.5;

  // ノイズテクスチャのrgの量とuvの距離を取る
  float dist = distance(uv, vec2(noise.r, noise.g));
  // テクスチャ0と1で逆方向に動かす
  float dist0 = dist * sinedTime;
  float dist1 = dist * sinedTimeMinus * -1.0;

  vec2 coord0 = uv + dist0 * intensity;
  vec2 coord1 = uv + dist1 * intensity;

  vec4 texture0 = texture2D(uTexture0, coord0);
  vec4 texture1 = texture2D(uTexture1, coord1);

  vec4 mixed = mix(texture0, texture1, sinedTime);
  gl_FragColor = mixed;
}