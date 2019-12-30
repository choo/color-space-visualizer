import {rgb2hex} from './ColorUtils'
import {createCubeMesh} from './CubeUtils'

const n = 8;
const cubeSize = 3;

//const spacing = 6;
const spacing = 8;
const offset = [0, 80, 0];

const totalSize = cubeSize * n + spacing * (n - 1);
const colorSpacing = 256 / n;


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



const getCubeColor = (i, j, k) => {
  return rgb2hex(
    i * colorSpacing,
    j * colorSpacing,
    k * colorSpacing
  );
};

const getCubePosition = (i, j, k) => {
  return [
    cubeSize * (i + 1) + spacing * i - (totalSize / 2) + offset[0],
    cubeSize * (j + 1) + spacing * j - (totalSize / 2) + offset[1],
    cubeSize * (k + 1) + spacing * k - (totalSize / 2) + offset[2]
  ];
};

export {createRGBCubes};
