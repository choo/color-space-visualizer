import {hsv2rgb, sortByColor} from './ColorUtils'
import {createCubeMesh} from './CubeUtils'

const n = 6;   // number unit of point in circle
const maxRadius = 60;

//const steps = 8;
const steps = 7;
const height = 140;
//const height = 90;

const offset = -10;

const cubeSize = 3;


const createHSVCubes = () => {
  const ret = []
  for (let i = 0; i <= steps; i++) {
    const value = i / steps * 100.0;
    for (let j = 0; j <= i; j++) {
    // for cylider formation
    //for (let j = 0; j <= steps; j++) {
      const saturation = j / steps * 100.0;
      const numCubes = Math.max(j * n, 1);
      //const numCubes = Math.max(n, 1);
      //const numCubes = 15
      for (let k = 0; k < numCubes; k++) {
        const degree = 360.0 / numCubes * k;
        const color = hsv2rgb(degree, saturation, value);
        //const pos = getCubePosition(degree, saturation, value);
        const [x, y, z] = getCubePosition(degree, saturation, value);
        const cube = createCubeMesh(cubeSize, color, x, y, z);
        ret.push(cube);
      }
    }
  }
  return ret;
};

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
  hsvProps.sort(sortByColor);
  for (let i = 0; i < cubes.length; i++) {
    const cube = cubes[i];
    cube.userData.HSV = hsvProps[i];
  }
  return;
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

export {createHSVCubes, addHSVProps};
