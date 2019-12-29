import React from "react";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

class ThreeSimpleBox extends React.Component {

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.rendererRender = () => {};

    this.attrs = {
      width :  800,
      height:  800,
      color : 0x303030,

      fov  : 60,   // field of view
      near : 1,    // near clip
      far  : 10000,// far clip

      cameraPosition: [240, 210, 200],
      cameraLookAt:   [0, 20, 0],

      lights: {
        ambient: [0xffffff, 1.0],  // color, strength
        point: {
          config: [0xffffff, 1, 100], // color, strength, distance, decay
          position: [0, 100, 0]
          //config: [0xffffff, 100, 100], // color, strength, distance, decay
          //position: [0, 200, 0]
        },
      },
    };
  }

  componentDidMount() {
    //const width = this.divRef.current.parentNode.offsetWidth;
    //const height = this.attrs.height;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = this.makeRenderer(width, height);
    const camera = this.makeCamera(width, height);
    this.scene = this.makeScene();

    this.rendererRender = () => {renderer.render(this.scene, camera);};
    this.addOrbitControl(camera, renderer.domElement, this.rendererRender);

    this.divRef.current.appendChild(renderer.domElement);
    this.rendererRender(); // initial render
  }

  makeRenderer (width, height) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(this.attrs.color, 1.0);
    return renderer;
  }

  makeCamera (width, height) {
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(
        this.attrs.fov, aspect, this.attrs.near, this.far);
    camera.position.set(...this.attrs.cameraPosition); // x, y, z
    return camera;
  }

  makeScene () {
    const scene = new THREE.Scene();

    /* light settings */
    if (this.attrs.lights.ambient) {
      const ambient = new THREE.AmbientLight(...this.attrs.lights.ambient);
      scene.add(ambient);
    }
    if (this.attrs.lights.point) {
      const light = new THREE.PointLight(...this.attrs.lights.point.config);
      light.position.set(...this.attrs.lights.point.position);
      scene.add(light);
    }

    /* scene settings */
    //scene.add(new THREE.AxesHelper(1000));
    scene.add(new THREE.GridHelper(1200, 60, 0x888888));

    const mesh = this.makeSimpleBox();
    scene.add(mesh);

    return scene;
  }

  addObject (obj) {
    this.scene.add(obj);
  }

  makeSimpleBox () {
    const geometry = new THREE.BoxGeometry(40, 60, 10);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 30, 0);
    mesh.rotation.set(0, Math.PI * 0.5, 0);
    return mesh;
  }

  addOrbitControl (camera, elm, renderFunc) {
    const controls = new OrbitControls(camera, elm)
    controls.target = new THREE.Vector3(...this.attrs.cameraLookAt);
    controls.update();
    controls.addEventListener('change', renderFunc);
  }

  render() {
    return (
      <div ref={this.divRef}/>
    )
  }
}

export default ThreeSimpleBox;
