import React from "react";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

import { createRGBCubes } from '../RGBCubes';
import { createHSVCubes } from '../HSVCubes';
import { OBJ_NAME} from '../CubeUtils'

class ThreeColorSpace extends React.Component {

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

      // for RGB
      cameraPosition: [240, 240, 200],
      cameraLookAt:   [0, 50, 0],

      lights: {
        ambient: [0xffffff, 1.0],  // color, strength
        point: {
          //config: [0xffffff, 1, 100], // color, strength, distance, decay
          //position: [0, 100, 0],
          castShadow: true,
          config: [0xffffff, 1, 500], // color, strength, distance, decay
          //position: [0, 150, 0]
          position: [50, 150, 50]
        },
      },
    };
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = this.makeRenderer(width, height);
    const camera = this.makeCamera(width, height);
    this.scene = this.makeScene();

    renderer.shadowMap.enabled = true;
    this.rendererRender = () => {renderer.render(this.scene, camera);};
    this.addOrbitControl(camera, renderer.domElement, this.rendererRender);

    // attach click event
    const clicked = this.makeCallbackFunc(this.scene, camera);
    //renderer.domElement.addEventListener('click', clicked);
    renderer.domElement.addEventListener('mousedown', clicked);
    //renderer.domElement.addEventListener('click', clicked);

    this.divRef.current.appendChild(renderer.domElement);

    this.updateCubes(this.props.model);
    this.rendererRender(); // initial render
  }

  makeRenderer (width, height) {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(this.attrs.color, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
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
      light.castShadow = this.attrs.lights.point.castShadow;
      scene.add(light);
    }

    /* scene settings */
    //scene.add(new THREE.AxesHelper(1000));
    if (false) {
      scene.add(new THREE.GridHelper(1200, 60, 0x888888));
    } else {

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1200,1200,2),

        //new THREE.ShadowMaterial({
        new THREE.MeshStandardMaterial({
        //new THREE.MeshBasicMaterial({
          //color: 0x888888,
          color : 0x303030,
          side: THREE.DoubleSide,
          //wireframe: true,
          transparent: true,
          opacity: 0.85,
        })
      );
      plane.rotation.set(Math.PI / 2.0, 0, 0)
      plane.castShadow = false;
      plane.receiveShadow = true;

      scene.add(plane);
    }

    return scene;
  }

  addObject (obj) {
    this.scene.add(obj);
  }

  addMeshes (meshes) {
    for (let mesh of meshes) {
      this.scene.add(mesh);
    }
  }

  addOrbitControl (camera, elm, renderFunc) {
    const controls = new OrbitControls(camera, elm)
    controls.target = new THREE.Vector3(...this.attrs.cameraLookAt);
    controls.update();
    controls.addEventListener('change', renderFunc);
  }

  makeCallbackFunc (scene, camera) {
    const raycaster = new THREE.Raycaster();
    const getIntersectObject = e => {
      e.preventDefault();
      const elm = e.currentTarget;
      const x = e.clientX - elm.offsetLeft;
      const y = e.clientY - elm.offsetTop;
      const w = elm.offsetWidth;
      const h = elm.offsetHeight;
      const coords = {
        x :  (x / w) * 2 - 1,
        y : -(y / h) * 2 + 1,
      };
      raycaster.setFromCamera(coords, camera);
      //const intersects = raycaster.intersectObjects(scene.children); 
      const cubes = scene.getObjectByName(OBJ_NAME).children
      const intersects = raycaster.intersectObjects(cubes); 
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        return mesh;
      }
      return null;
    };

    const onClicked = (e) => {
      const mesh = getIntersectObject(e);
      if (mesh) {
        const position = mesh.position;
        const color = mesh.material.color;
        const rgb = color.getHexString();
        //const hsl = color.getHSL();
        console.log(position, rgb);
        this.props.onSelectColor(`#${rgb}`);
      }
    };
    return onClicked;
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.updateCubes(nextProps.model);
    return false;
  }

  updateCubes(model) {
    const prev = this.scene.getObjectByName(OBJ_NAME);
    this.scene.remove(prev);

    //for (let obj of this.scene.children) {
    //  if (obj.type === 'Mesh') {
    //    console.log(obj);
    //    this.scene.remove(obj);
    //  }
    //}
    if (model === 'RGB') {
      this.addObject(createRGBCubes());
    } else {
      this.addObject(createHSVCubes());
    }
    this.rendererRender();
  }

  render() {
    return (
      <div ref={this.divRef}/>
    )
  }
}

export default ThreeColorSpace;
