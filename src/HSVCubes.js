import * as THREE from "three";
import {hsv2rgb} from './ColorUtils';

const n = 6;   // number of cubes in circle
const maxRadius = 60;

const steps = 7;
const height = 140;
const offset = 10;


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

const createAxes = () => {
  const ret = [];
  const conf = [
    {
      dir: new THREE.Vector3(...[0, 1, 0]),
      origin: new THREE.Vector3(...[0, offset, 0]),
      len: 180,
      color: 0xffffff,
    },
  ];
  for (const c of conf) {
    const axis = new THREE.ArrowHelper(c.dir, c.origin, c.len, c.color, 6, 4 );
    axis.userData.model = 'HSV';
    axis.visible = false;
    ret.push(axis);
  }
  ret.push(createHueRing());
  return ret;
};

const createColorHueRing = () => {
  const N = steps * n;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const color = new THREE.Color();
  const colors = [];
  for (let i = 0; i <= N; i++) {
    const degree = 360.0 / N * i;
    const [x, y, z] = getCubePosition(degree, 100.0, 100.0);
    vertices.push(x, y, z);
    color.setHSL(i / N, 1.0, 0.5);
    colors.push( color.r, color.g, color.b );
  }
  geometry.setAttribute( 'position',
      new THREE.Float32BufferAttribute( vertices, 3 ) );
  geometry.setAttribute( 'color',
      new THREE.Float32BufferAttribute( colors, 3 ) );
  const material = new THREE.LineBasicMaterial(
      { color: 0xffffff, vertexColors: THREE.VertexColors } );
  const line = new THREE.Line(geometry, material);
  line.material.linewidth = 2;
  line.userData.model = 'HSV';
  line.visible = false;
  return line;
};

const createHueRing = () => {
  const N = steps * n;
  const geometry = new THREE.Geometry();
  for (let i = 0; i <= N; i++) {
    const degree = 360.0 / N * i;
    const [x, y, z] = getCubePosition(degree, 100.0, 100.0);
    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 } );
  const line = new THREE.Line(geometry, material);
  line.material.linewidth = 2;
  line.userData.model = 'HSV';
  line.visible = false;
  return line;
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
    height * (value / 100.0) + offset,
    Math.sin(radian) * radius
  ];
};

export {addHSVProps, createAxes};
