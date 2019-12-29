import * as THREE from "three";


export const createCubeMesh = (size, color, x, y, z) => {
  const geometry = new THREE.CubeGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({color: color});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return mesh;
};

export const OBJ_NAME = 'CUBES';
