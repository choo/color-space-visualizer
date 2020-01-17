import React from "react";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

import { createRGBCubes, createRGBAxes } from '../RGBCubes';
import { addHSVProps, createHSVAxes } from '../HSVCubes';

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
      cameraPosition: [240, 160, 200],
      cameraLookAt:   [0, 70, 0],

      lights: {
        ambient: [0xffffff, 1.0],  // color, strength
        point: {
          castShadow: !this.props.isLite,
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
    renderer.shadowMap.enabled = !this.props.isLite;

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
      if (this.rippleRadius) {
        this.rippleCubes();
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
    if (!this.props.isLite) {
      renderer.setPixelRatio(window.devicePixelRatio);
    }
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

  addAxes () {
    this.axes = [];
    this.ticks = [];
    const [RGBAxes, RGBTicks] = createRGBAxes();
    const [HSVAxes, HSVTicks] = createHSVAxes();
    for (const axis of RGBAxes.concat(HSVAxes)) {
      this.scene.add(axis);
      this.axes.push(axis);
    }
    for (const tick of RGBTicks.concat(HSVTicks)) {
      this.scene.add(tick);
      this.ticks.push(tick);
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
      /* stop spinning */
      this.currentSpin = 0.0;
      this.selectedCube.rotation.set(0, 0, 0);
      this.updateCubes(this.props.previewing, this.props.showingAxes);
    }
  }

  rippleCubes () {
    const MAX_RADIUS = 200;
    const RIPPLE_SPEED = 6;
    for (const cube of this.waitingHighlightCubes) {
      const sqRadius = this.rippleRadius * this.rippleRadius;
      const dis = calcDistanceSquare(cube.position, this.selectedAxis.position);
      if (dis < sqRadius) {
        showObj(cube);
      }
    }
    if (0 < this.rippleRadius && this.rippleRadius < MAX_RADIUS) {
      this.rippleRadius += RIPPLE_SPEED;
    } else {
      /* stop rippling */
      this.rippleRadius = 0;
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
      for (const intersect of intersects) {
        const mesh = intersect.object;
        if (this.props.showingAxes) {
          if (mesh.userData.isCube && mesh.userData.isShowing) {
            this.selectCube(mesh);
            return;
          }
          if (mesh.userData.isTick &&
              mesh.userData.model === this.props.model) {
            this.selectAxis(mesh);
            return;
          }
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

    if (this.selectedAxis &&
        this.selectedAxis.model === model &&
        this.selectedAxis.axis  === selected.userData.axis &&
        this.selectedAxis.value === selected.userData.value) {
      /* if selected axis is the currently selected axis,
       * turn off that filtering */
      this.selectedAxis = null;

    } else {
      this.rippleRadius = 0.1;
      this.selectedAxis = {
        model: model,
        axis:  selected.userData.axis,
        value: selected.userData.value,
        position: selected.userData.position,
      };
    }
    this.updateCubes(this.props.previewing, this.props.showingAxes);
    this.updateTicks(this.props.previewing, this.props.showingAxes, model);
    this.props.setPreviewing(false);
  }

  shouldComponentUpdate(nextProps) {
    const model = nextProps.model
    this.moveCubes(model);
    this.updateCubes(nextProps.previewing, nextProps.showingAxes);
    this.updateAxes(nextProps.previewing, nextProps.showingAxes, model);
    this.updateTicks(nextProps.previewing, nextProps.showingAxes, model);
    return false;
  }

  clearAllCubes () {
    for (let cube of this.cubes) {
      toTransparent(cube);
    }
  }

  highlightCubes () {
    this.clearAllCubes();
    showObj(this.selectedCube);
  }

  highlightAxisCubes () {
    this.waitingHighlightCubes = [];
    const model = this.selectedAxis.model;
    const axis  = this.selectedAxis.axis;
    const value = this.selectedAxis.value;
    for (let cube of this.cubes) {
      const axisInfo = cube.userData[model]
      if (axisInfo.vals[axis] === value ||
          (axisInfo.forceShow && axisInfo.forceShow[axis])) {
        if (this.rippleRadius) {
          this.waitingHighlightCubes.push(cube);
        } else {
          showObj(cube);
        }
      } else {
        toTransparent(cube);
      }
    }
  }

  displayAllCubes () {
    for (let cube of this.cubes) {
      showObj(cube);
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

  updateTicks (previewing, showingAxes, model) {
    const OPACITY_NOT_SELECTED = 0.3;
    const OPACITY_ALL_DISPLAYED = 0.8;
    for (const tick of this.ticks) {
      if (!showingAxes) {
        tick.visible = false;

      } else if (tick.userData.model !== model) {
        /* tick of currently invisible model */
        clearObject(tick);

      } else {
        /* showingAxes && showing model */
        if (this.selectedAxis) {
          const axis  = this.selectedAxis.axis;
          const value = this.selectedAxis.value;
          if (axis === tick.userData.axis && value === tick.userData.value) {
            /* tick of selected axis */
            showObj(tick);
          } else {
            /* not selected */
            toTransparent(tick, OPACITY_NOT_SELECTED);
          }

        } else {
          /* axis has NOT yet been selected */
          toTransparent(tick, OPACITY_ALL_DISPLAYED);
        }
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


const toTransparent = (obj, opacity) => {
  opacity = opacity || OPACITY_TRANSPARENT;
  obj.visible = true;
  obj.castShadow = false;
  obj.receiveShadow = false;
  obj.material.visible = true;
  obj.material.opacity = opacity;
  obj.userData.isShowing = false;
}

const showObj = obj => {
  obj.visible = true;
  obj.castShadow = true;
  obj.receiveShadow = true;
  obj.material.visible = true;
  obj.material.opacity = 1.0;
  obj.userData.isShowing = true;
}

const clearObject = obj => {
  obj.visible = false;
  obj.material.visible = false;
}

const calcDistanceSquare = (v1, v2) => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;
  return dx * dx + dy * dy + dz * dz;
}

export default ThreeColorSpace;
