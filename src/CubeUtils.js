import * as THREE from "three";

export const OBJ_NAME = 'COLOR_CUBE';
export const PLANE_THICKNESS = 1;
export const PLANE_SIZE = 5

export const createCubeMesh = (size, color, x, y, z) => {
  const geometry = new THREE.CubeGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({color: color});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.material.transparent = true;
  mesh.position.set(x, y, z);
  mesh.name = OBJ_NAME;
  return mesh;
};

export const createTickPlane = (dirIdx, color, position, modelName) => {
  const size = [PLANE_SIZE, PLANE_SIZE, PLANE_SIZE];
  size[dirIdx] = PLANE_THICKNESS;
  const geometry = new THREE.BoxGeometry(...size);
  const material = new THREE.MeshPhongMaterial(
      {color: color, side: THREE.DoubleSide});
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(...position);
  plane.userData.model = modelName;
  plane.visible = false;
  plane.castShadow = true;
  plane.receiveShadow = true;
  return plane;
};

