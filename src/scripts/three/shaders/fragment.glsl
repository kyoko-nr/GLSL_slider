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
  float intensity = 0.1;

  float prevTime = clamp(uRatio, 0.0, 1.0);
  float nextTime = clamp(1.0 - uRatio, 0.0, 1.0);

  // ノイズテクスチャのrgの量とuvの距離を取る
  float dist = distance(uv, vec2(noise.r, noise.g));
  // テクスチャ0と1で逆方向に動かす
  float prevDist = dist * prevTime * -1.0;
  float nextDist = dist * nextTime * -1.0;

  vec2 prevCoord = uv + prevDist * intensity;
  vec2 nextCoord = uv + nextDist * intensity;

  vec4 texture0 = texture2D(uTexture0, uForward ? prevCoord : nextCoord);
  vec4 texture1 = texture2D(uTexture1, uForward ? nextCoord : prevCoord);

  vec4 mixed = mix(texture0, texture1, uForward ? prevTime : nextTime);
  gl_FragColor = mixed;
}