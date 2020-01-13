import {rgb2hex} from './ColorUtils';
import {createCubeMesh, createTickPlane, createAxisArrow, PLANE_SIZE, PLANE_THICKNESS} from './CubeUtils';

const NUM = 8;
const CUBE_SIZE = 3;

const SPACING = 8;
const OFFSET = [0, 80, 0];


const createRGBCubes = () => {
  const ret = []
  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      for (let k = 0; k < NUM; k++) {
        const color = getCubeColor(i, j, k);
        const [x, y, z] = getCubePosition(i, j, k);
        const cube = createCubeMesh(CUBE_SIZE, color, x, y, z);
        cube.userData.RGB = {
          color: color,
          position: [x, y, z],
          vals: {
            R: i,
            G: j,
            B: k,
          },
        };
        cube.userData.isCube = true;
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
  const origin = getCubePosition(0, 0, 0);
  const len = 120;
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  for (let i = 0; i < 3; i++) {
    const direction = [0, 0, 0];
    direction[i] = 1;
    const axis = createAxisArrow(origin, direction, colors[i], len, 'RGB');
    ret.push(axis);

    const ticks = makeAxisTick(i, colors[i]);
    for (const tick of ticks) {
      ret.push(tick);
    }
  }
  return ret
};


const makeAxisTick = (i, color) => {
  const ret = []
  for (let j = 0; j < NUM; j++) {
    const axis = 'RGB'.charAt(i);
    const idx = [0, 0, 0];
    idx[i] = j;
    const pos = getCubePosition(...idx);
    pos[(0 + i) % 3] += PLANE_THICKNESS / 2;
    pos[(1 + i) % 3] -= PLANE_SIZE / 2;
    pos[(2 + i) % 3] -= PLANE_SIZE / 2;

    const plane = createTickPlane(i, color, pos, 'RGB', axis, j);
    ret.push(plane);
  }
  return ret;
};


const getCubeColor = (i, j, k) => {
  const colorSpacing = 255.0 / (NUM - 1);
  return rgb2hex(
    Math.round(i * colorSpacing),
    Math.round(j * colorSpacing),
    Math.round(k * colorSpacing)
  );
};

const getCubePosition = (i, j, k) => {
  const totalSize = CUBE_SIZE * NUM + SPACING * (NUM - 1);
  return [
    CUBE_SIZE * (i + 1) + SPACING * i - (totalSize / 2) + OFFSET[0],
    CUBE_SIZE * (j + 1) + SPACING * j - (totalSize / 2) + OFFSET[1],
    CUBE_SIZE * (k + 1) + SPACING * k - (totalSize / 2) + OFFSET[2]
  ];
};

export {createRGBCubes, createRGBAxes};
