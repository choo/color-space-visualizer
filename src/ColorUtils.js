/**
 * @desc
 * ColorUtils module
 * @module ColorUtils
 */


const rgb2str = (r, g, b) => {
  return "#" + 
      _toHexStr(r) + 
      _toHexStr(g) + 
      _toHexStr(b);
};

const rgb2hex = (r, g, b) => {
  return r * (256 ** 2) + g * (256) + b;
};

const hsl2str = (h, s, l) => {
  return "hsl(" + 
      Math.round(360.0 * h) + ", " + 
      Math.round(100.0 * s) + "%, " + 
      Math.round(100.0 * l) + "%)";
};

const selectTextColor = (rgbStr) => {
  const toRgbItem = val => {
    const x = val / 255.0;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  const r = toRgbItem(parseInt(rgbStr.slice(1, 3), 16));
  const g = toRgbItem(parseInt(rgbStr.slice(3, 5), 16));
  const b = toRgbItem(parseInt(rgbStr.slice(5, 7), 16));
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const lumaWhite = 1.0;
  const lumaBlack = 0.0;

  /* calc contrast ratio */
  const white = (lumaWhite + 0.05) / (luma + 0.05)
  const black = (luma + 0.05) / (lumaBlack + 0.05)
  return white < black ? '#000000' : '#ffffff'
};


/**
 * @param {Number} h degree of Hue in HSV color model (0 - 359)
 * @param {Number} s percentage of Saturation in HSV color model (0 - 100)
 * @param {Number} v percentage of Value in HSV color model (0 - 100)
 * @return {String} RGB HEX Value
 */
const hsv2rgb = (h, s, v) => {
  let r, g, b;
  const max = v;
  const min = v - s;
  if (h < 0 || h >= 360) {
    r = 0;
    g = 0;
    b = 0;
  } else if (h < 60) {
    r = max;
    g = min + (max - min) * h / 60;
    b = min;
  } else if (h < 120) {
    r = min + (max - min) * (120 - h) / 60;
    g = max;
    b = min;
  } else if (h < 180) {
    r = min;
    g = max;
    b = min + (max - min) * (h - 120) / 60;
  } else if (h < 240) {
    r = min;
    g = min + (max - min) * (240 - h) / 60;
    b = max;
  } else if (h < 300) {
    r = min + (max - min) * (h - 240) / 60;
    g = min;
    b = max;
  } else if (h < 360) {
    r = max;
    g = min;
    b = min + (max - min) * (360 - h) / 60;
  }
  r = _to8bitsInteger(r);
  g = _to8bitsInteger(g);
  b = _to8bitsInteger(b);
  return rgb2hex(r, g, b);
}


/******************************************
 * private functions
 ******************************************/
const _toHexStr = n => {
  if (n < 16) {
    return "0" + n.toString(16);
  }
  return n.toString(16);
};

/**
 * convert percentage value to 8bit digit (0-1.0 -> 0-255) 
 * @param {Number} val
 * @param {Number} n 
 * @return rounded value
 */
const _to8bitsInteger = val => {
  const value = Math.floor(255 * val / 100.0);
  const ret = value < 0 ? 255 - value : value;
  return ret;
};


export { rgb2str, rgb2hex, hsl2str, hsv2rgb, selectTextColor };
