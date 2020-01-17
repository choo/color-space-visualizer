import * as THREE from "three";

export const PLANE_THICKNESS = 1;
export const PLANE_SIZE = 5

export const createCubeMesh = (size, color, x, y, z) => {
  const geometry = new THREE.CubeGeometry(size, size, size);
  const material = new THREE.MeshLambertMaterial({color: color});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.material.transparent = true;
  mesh.position.set(x, y, z);
  return mesh;
};

export const createAxisArrow = (origin, direction, color, len, modelName) => {
  const originVec = new THREE.Vector3(...origin);
  const dirVec = new THREE.Vector3(...direction);
  const arrow = new THREE.ArrowHelper(dirVec, originVec, len, color, 6, 4 );
  arrow.line.material.linewidth = 2;
  arrow.userData.model = modelName;
  arrow.visible = false;
  return arrow;
};

export const createTickPlane = (dirIdx, color, position,
    modelName, axisName, axisValue) => {
  const size = [PLANE_SIZE, PLANE_SIZE, PLANE_SIZE];
  size[dirIdx] = PLANE_THICKNESS;
  const geometry = new THREE.BoxGeometry(...size);
  const material = new THREE.MeshLambertMaterial(
      {color: color, side: THREE.DoubleSide});
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(...position);
  plane.visible = false;
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.material.transparent = true;
  plane.userData = {
    isTick: true,
    model: modelName,
    axis: axisName,
    value: axisValue,
    position: plane.position,
  };
  return plane;
};
