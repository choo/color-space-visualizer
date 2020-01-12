import * as THREE from "three";
import {rgb2hex} from './ColorUtils';
import {createCubeMesh} from './CubeUtils';

const n = 8;
const cubeSize = 3;

const spacing = 8;
const offset = [0, 80, 0];

const totalSize = cubeSize * n + spacing * (n - 1);
const colorSpacing = 255.0 / (n - 1);


const createRGBCubes = () => {
  const ret = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        const color = getCubeColor(i, j, k);
        const [x, y, z] = getCubePosition(i, j, k);
        const cube = createCubeMesh(cubeSize, color, x, y, z);
        cube.userData.RGB = {
          color: color,
          position: [x, y, z],
        };
        ret.push(cube);
      }
    }
  }
  ret.sort(_sortByColor);
  return ret;
};

const _sortByColor = (a, b) => {
  if (a.userData.RGB.color > b.userData.RGB.color) {
      return 1;
  }
  if (a.userData.RGB.color < b.userData.RGB.color ) {
      return -1;
  }
  return 0;
};


const createRGBAxes = () => {
  const ret = [];
  const origin = new THREE.Vector3(...getCubePosition(0, 0, 0));
  const len = 120;
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  for (let i = 0; i < 3; i++) {
    const vec = [0, 0, 0];
    vec[i] = 1;
    const dirVec = new THREE.Vector3(...vec);
    const axis = new THREE.ArrowHelper( dirVec, origin, len, colors[i], 6, 4 );
    axis.line.material.linewidth = 2;
    axis.userData.model = 'RGB';
    axis.visible = false;
    ret.push(axis);

    // Add axis ticks
    const ticks = makeAxisTick(i, colors[i]);
    for (const tick of ticks) {
      ret.push(tick);
    }
  }
  return ret
};


const makeAxisTick = (i, color) => {
  const ret = []
  const THICKNESS = 1;
  const SIZE = 5
  for (let j = 0; j < n; j++) {

    const sizes = [0, 0, 0];
    sizes[(0 + i) % 3] = THICKNESS;
    sizes[(1 + i) % 3] = SIZE;
    sizes[(2 + i) % 3] = SIZE;

    const idx = [0, 0, 0];
    idx[i] = j;
    const pos = getCubePosition(...idx);
    pos[(0 + i) % 3] += THICKNESS / 2;
    pos[(1 + i) % 3] -= SIZE / 2; // + 1.5;
    pos[(2 + i) % 3] -= SIZE / 2; // + 1.5;

    const geometry = new THREE.BoxGeometry( ...sizes );
    const material = new THREE.MeshPhongMaterial(
        {color: color, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(...pos);
    plane.userData.model = 'RGB';
    plane.visible = false;
    plane.castShadow = true;
    plane.receiveShadow = true;
    ret.push(plane);
  }
  return ret;
};


const getCubeColor = (i, j, k) => {
  return rgb2hex(
    Math.round(i * colorSpacing),
    Math.round(j * colorSpacing),
    Math.round(k * colorSpacing)
  );
};

const getCubePosition = (i, j, k) => {
  return [
    cubeSize * (i + 1) + spacing * i - (totalSize / 2) + offset[0],
    cubeSize * (j + 1) + spacing * j - (totalSize / 2) + offset[1],
    cubeSize * (k + 1) + spacing * k - (totalSize / 2) + offset[2]
  ];
};

export {createRGBCubes, createRGBAxes};
