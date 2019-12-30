import * as THREE from "three";

export const OBJ_NAME = 'COLOR_CUBE';

export const createCubeMesh = (size, color, x, y, z) => {
  const geometry = new THREE.CubeGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({color: color});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  mesh.name = OBJ_NAME;
  return mesh;
};
