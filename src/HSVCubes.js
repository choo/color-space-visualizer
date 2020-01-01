import {hsv2rgb} from './ColorUtils';

const n = 6;   // number of cubes in circle
const maxRadius = 60;

const steps = 7;
const height = 140;
const offset = -10;


const addHSVProps = (cubes) => {
  const hsvProps = []
  for (let i = 0; i <= steps; i++) {
    const value = i / steps * 100.0;
    for (let j = 0; j <= i; j++) {
      const saturation = j / steps * 100.0;
      const numCubes = Math.max(j * n, 1);
      for (let k = 0; k < numCubes; k++) {
        const degree = 360.0 / numCubes * k;
        const color = hsv2rgb(degree, saturation, value);
        const [x, y, z] = getCubePosition(degree, saturation, value);
        hsvProps.push({
          color: color,
          position: [x, y, z],
        });
      }
    }
  }
  hsvProps.sort(_sortByColor);
  for (let i = 0; i < cubes.length; i++) {
    const cube = cubes[i];
    cube.userData.HSV = hsvProps[i];
  }
  return;
};

const _sortByColor = (a, b) => {
  if (a.color > b.color) {
      return 1;
  }
  if (a.color < b.color ) {
      return -1;
  }
  return 0;
};


const getCubePosition = (degree, saturation, value) =>{
  const radian = degree * Math.PI / 180.0;
  const radius = maxRadius * saturation / 100.0;
  return [
    Math.cos(radian) * radius,
    height * (value / 100.0) - offset,
    Math.sin(radian) * radius
  ];
};

export {addHSVProps};
