import React from "react";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

import { createRGBCubes, createRGBAxes } from '../RGBCubes';
import { addHSVProps, createAxes } from '../HSVCubes';
import { OBJ_NAME} from '../CubeUtils';

const OPACITY_TRANSPARENT = 0.15;


class ThreeColorSpace extends React.Component {

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.rendererRender = () => {};
    this.selectedCube = null;
    this.currentSpin = 0.0;
    this.cubes = null;

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
          castShadow: true,
          config: [0xffffff, 1, 500], // color, strength, distance, decay
          position: [0, 300, 0]
        },
      },
    };
  }

  componentDidMount() {
    const width = this.divRef.current.parentNode.offsetWidth - 2;
    const height = window.innerHeight;
    const renderer = this.makeRenderer(width, height);
    renderer.shadowMap.enabled = true;

    const camera = this.makeCamera(width, height);
    this.scene = this.makeScene();
    const controls = this.makeOrbitControls(camera, renderer.domElement);

    this.rendererRender = () => {renderer.render(this.scene, camera);};

    /* attach click event */
    const clickStart = this.makeEventStart();
    const clickEnd = this.makeEventEnd(this.scene, camera);
    renderer.domElement.addEventListener('mousedown',  clickStart);
    renderer.domElement.addEventListener('touchstart', clickStart);
    renderer.domElement.addEventListener('mouseup',  clickEnd);
    renderer.domElement.addEventListener('touchend', clickEnd);

    this.createCubes();
    this.divRef.current.appendChild(renderer.domElement);
    this.addAxes();

    const tick = () => {
      controls.update();
      if (this.currentSpin) {
        this.spinSelectedCube();
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

    /* plane settings */
    const plane = this.makePlane();
    scene.add(plane);
    const gridLineColor = 0x606060;
    scene.add(new THREE.GridHelper(1200, 60, gridLineColor, gridLineColor));

    return scene;
  }

  addAxes_ () {
    //const axesHelper = new THREE.AxesHelper(2000);
    //scene.add(axesHelper);
    const pos = this.cubes[0].position;
    console.log(pos);

    const material = new THREE.LineBasicMaterial({
      linewidth: 3,
      color: 0x00ff00
    });

    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      pos,
      new THREE.Vector3( 0, 1000, 0 ),
    );

    const line = new THREE.Line( geometry, material );
    this.scene.add( line );
  }

  addAxes () {
    this.axes = [];
    const RGBAxes = createRGBAxes();
    const HSVAxes = createAxes();
    for (const axis of RGBAxes.concat(HSVAxes)) {
      this.scene.add(axis);
      this.axes.push(axis);
    }
  }

  makePlane () {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1200, 1200, 2),
      new THREE.MeshStandardMaterial({
        color : 0x404040,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
    );
    plane.position.set(0, -1, 0);
    plane.rotation.set(Math.PI / 2.0, 0, 0);
    plane.castShadow = false;
    plane.receiveShadow = true;
    return plane;
  }

  makeOrbitControls (camera, elm) {
    const controls = new OrbitControls(camera, elm)
    controls.target = new THREE.Vector3(...this.attrs.cameraLookAt);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    return controls
  }

  spinSelectedCube () {
    const SPIN_DAMPING_FACTOR = 0.93;
    this.selectedCube.rotation.x += this.currentSpin;
    this.selectedCube.rotation.y += this.currentSpin;
    if (this.currentSpin > 0.1) {
      this.currentSpin *= SPIN_DAMPING_FACTOR;
    } else if (Math.abs(
          this.selectedCube.rotation.y % (Math.PI / 2.0)) < 0.09) {
      /* spinning stop */
      this.currentSpin = 0.0;
      this.selectedCube.rotation.set(0, 0, 0);
      this.updateCubes(this.props.previewing, this.props.showingAxes);
    }
  }

  makeEventStart () {
    const onStart = (e) => {
      this.evtCoords = _getEventCoords(e);
    };
    return onStart;
  }

  makeEventEnd (scene, camera) {
    const onClicked = (e) => {
      const coords = _getEventCoords(e);
      if (coords.x !== this.evtCoords.x || coords.y !== this.evtCoords.y) {
        return;
      }
      const intersects = _getIntersectObjects(e, scene, camera);
      let selected = null;
      for (const intersect of intersects) {
        const mesh = intersect.object;
        if (this.props.showingAxes && mesh.userData.isTick &&
            mesh.userData.model === this.props.model) {
          this.selectAxis(mesh);
          return;
        }
        if (!this.props.showingAxes && mesh.userData.isCube) {
          this.selectCube(mesh);
          return;
        }
      }
    };
    return onClicked;
  }

  selectCube (selected) {
    /* reset rotation of cube previously selected */
    this.selectedCube.rotation.set(0, 0, 0);
    this.selectedCube = selected;
    this.currentSpin = 1.0;
    const color = this.selectedCube.material.color;
    const rgb = color.getHexString();
    this.props.onSelectColor(`#${rgb}`);
    this.updateCubes(this.props.previewing, this.props.showingAxes);
  }

  selectAxis (selected) {
    const model = this.props.model;
    this.selectedAxis = {
      axis: selected.userData.axis,
      value: selected.userData.value,
    };
    this.updateCubes(this.props.previewing, this.props.showingAxes);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const model = nextProps.model
    this.moveCubes(model);
    this.updateCubes(nextProps.previewing, nextProps.showingAxes);
    this.updateAxes(nextProps.previewing, nextProps.showingAxes, model);
    return false;
  }

  clearAllCubes () {
    for (let cube of this.cubes) {
      cube.material.visible = true;
      cube.material.opacity = OPACITY_TRANSPARENT;
    }
  }

  highlightCubes () {
    this.clearAllCubes();
    this.selectedCube.material.opacity = 1.0;
  }

  highlightAxisCubes () {
    const model = this.props.model;
    const axis  = this.selectedAxis.axis;
    const value = this.selectedAxis.value;
    for (let cube of this.cubes) {
      if (cube.userData[model].vals[axis] === value) {
        cube.material.visible = true;
        cube.material.opacity = 1.0;
      } else {
        cube.material.visible = false;
      }
    }
  }

  displayAllCubes () {
    for (let cube of this.cubes) {
      cube.material.visible = true;
      cube.material.opacity = 1.0;
    }
  }

  updateCubes (previewing, showingAxes) {
    if (previewing || this.currentSpin > 0.0) {
      this.highlightCubes();
    } else if (showingAxes) {
      if (this.selectedAxis) {
        this.highlightAxisCubes();
      } else {
        this.clearAllCubes();
      }
    } else if (!this.currentSpin) {
      this.displayAllCubes();
    }
  }

  updateAxes (previewing, showingAxes, model) {
    for (const axis of this.axes) {
      if (!showingAxes) {
        axis.visible = false;
      } else if (axis.userData.model === model) {
        axis.visible = showingAxes;
      } else {
        axis.visible = !showingAxes;
      }
    }
  }

  createCubes () {
    this.cubes = createRGBCubes();
    addHSVProps(this.cubes);
    for (let cube of this.cubes) {
      this.scene.add(cube);
    }
    this.selectedCube = this.cubes.slice(-1)[0];
  };

  moveCubes(model) {
    for (let cube of this.cubes) {
      const prop = cube.userData[model];
      cube.position.set(...prop.position);
      cube.material.color.setHex(prop.color);
    }
  }

  render() {
    return (
      <div ref={this.divRef}/>
    )
  }
}


const _getEventCoords = (e) => {
  /*
   * get coordinates of touch or mouse event in the target element
   */
  let x, y;
  const elm = e.currentTarget;
  if (e.targetTouches && e.targetTouches.length) {
    x = e.targetTouches[0].pageX;
    y = e.targetTouches[0].pageY;
  } else if (e.changedTouches && e.changedTouches.length){
    x = e.changedTouches[0].pageX;
    y = e.changedTouches[0].pageY;
  } else {
    /* mousedown, mouseup, mousemove or click */
    x = e.clientX
    y = e.clientY
  }
  x -= elm.offsetParent.offsetLeft;
  y -= elm.offsetParent.offsetTop;
  const w = elm.offsetWidth;
  const h = elm.offsetHeight;
  const coords = {
    x :  (x / w) * 2 - 1,
    y : -(y / h) * 2 + 1,
  };
  return coords;
};

const _getIntersectObjects = (event, scene, camera) => {
  const raycaster = new THREE.Raycaster();
  event.preventDefault();
  const coords = _getEventCoords(event);
  raycaster.setFromCamera(coords, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  return intersects;
};



export default ThreeColorSpace;
