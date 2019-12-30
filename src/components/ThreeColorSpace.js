import React from "react";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

import { createRGBCubes } from '../RGBCubes';
import { createHSVCubes } from '../HSVCubes';
import { OBJ_NAME} from '../CubeUtils'


const _getPosition = (e, elm) => {
  /*
    "touchstart": "mousedown"
    "touchmove" : "mousemove"
    "touchend"  : "mouseup"
    "click" -> PC only
  */
  if (e.type.startsWith('touch')) {
    const x = e.targetTouches[0].pageX - elm.offsetLeft;
    const y = e.targetTouches[0].pageY - elm.offsetTop;
    return [x, y];
  }
  const x = e.clientX - elm.offsetLeft;
  const y = e.clientY - elm.offsetTop;
  return [x, y];
};



const getIntersectObject = (event, scene, camera) => {
  const raycaster = new THREE.Raycaster();
  event.preventDefault();
  const elm = event.currentTarget;
  const [x, y] = _getPosition(event, elm);
  const w = elm.offsetWidth;
  const h = elm.offsetHeight;
  const coords = {
    x :  (x / w) * 2 - 1,
    y : -(y / h) * 2 + 1,
  };
  raycaster.setFromCamera(coords, camera);
  const cubes = scene.children
  const intersects = raycaster.intersectObjects(cubes); 
  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    if (mesh.name === OBJ_NAME) {
      return mesh;
    }
  }
  return null;
};


class ThreeColorSpace extends React.Component {

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.rendererRender = () => {};
    this.selectedCube = null;
    this.currentSpin = 0.0;

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
          position: [0, 300, 0]
        },
      },
    };
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = this.makeRenderer(width, height);
    renderer.shadowMap.enabled = true;

    const camera = this.makeCamera(width, height);
    this.scene = this.makeScene();
    const controls = this.makeOrbitControls(camera, renderer.domElement);

    this.rendererRender = () => {renderer.render(this.scene, camera);};

    // attach click event
    const clicked = this.makeCallbackFunc(this.scene, camera);
    renderer.domElement.addEventListener('click', clicked);
    renderer.domElement.addEventListener('touchstart', clicked);
    //renderer.domElement.addEventListener('mousedown', clicked);

    this.divRef.current.appendChild(renderer.domElement);

    this.updateCubes(this.props.model);

    const tick = () => {
      controls.update();
      if (this.selectedCube) {
        this.selectedCube.rotation.x += this.currentSpin;
        this.selectedCube.rotation.y += this.currentSpin;
        if (this.currentSpin > 0.1) {
          this.currentSpin *= 0.9;
        } else if (Math.abs(
              this.selectedCube.rotation.y % (Math.PI / 2.0)) < 0.09) {
          this.currentSpin = 0.0;
          this.selectedCube.rotation.set(0, 0, 0);
        }
      }
      this.rendererRender();
      requestAnimationFrame(tick);
    };
    tick();
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

        new THREE.MeshStandardMaterial({
          //color: 0x888888,
          color : 0x404040,
          //color : 0x303030,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      plane.position.set(0, -1, 0);
      plane.rotation.set(Math.PI / 2.0, 0, 0);
      plane.castShadow = false;
      plane.receiveShadow = true;

      scene.add(plane);

      const gridLineColor = 0x606060;
      scene.add(new THREE.GridHelper(1200, 60, gridLineColor, gridLineColor));
    }

    return scene;
  }

  addMeshes (meshes) {
    for (let mesh of meshes) {
      this.scene.add(mesh);
    }
  }

  makeOrbitControls (camera, elm) {
    const controls = new OrbitControls(camera, elm)
    controls.target = new THREE.Vector3(...this.attrs.cameraLookAt);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    return controls
  }

  makeCallbackFunc (scene, camera) {
    const onClicked = (e) => {
      const mesh = getIntersectObject(e, scene, camera);
      if (mesh) {
        this.selectedCube = mesh;
        this.currentSpin = 1.0;
        const color = mesh.material.color;
        const rgb = color.getHexString();
        //mesh.material.color.setHex(0xff0000);
        //const hsl = color.getHSL();
        this.props.onSelectColor(`#${rgb}`);
      }
    };
    return onClicked;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.model !== nextProps.model) {
      this.updateCubes(nextProps.model);
    }
    return false;
  }

  updateCubes(model) {
    for (let obj of this.scene.children) {
      if (obj.name === OBJ_NAME) {
        this.scene.remove(obj);
      }
    }
    if (model === 'RGB') {
      this.addMeshes(createRGBCubes());
    } else {
      this.addMeshes(createHSVCubes());
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
