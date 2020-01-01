import {rgb2str, rgb2hex, hsv2rgb, selectTextColor} from '../ColorUtils';

it('rgb2str', () => {
  expect(rgb2str(0, 0, 0)).toEqual('#000000');
  expect(rgb2str(255, 255, 255)).toEqual('#ffffff');
  expect(rgb2str(127, 0, 0)).toEqual('#7f0000');
  expect(rgb2str(0, 0, 10)).toEqual('#00000a');
});

it('rgb2hex', () => {
  expect(rgb2hex(0, 0, 0)).toEqual(0);
  expect(rgb2hex(255, 255, 255)).toEqual(16777215);
  expect(rgb2hex(127, 0, 0)).toEqual(8323072);
  expect(rgb2hex(0, 0, 10)).toEqual(10);
  expect(rgb2hex(0, 1, 0)).toEqual(256);
});

it('hsv2rgb', () => {
  expect(hsv2rgb(0, 0, 0)).toEqual(0);
  expect(hsv2rgb(0, 20, 0)).toEqual(78642);
  expect(hsv2rgb(0, 50, 0)).toEqual(98431);
  expect(hsv2rgb(0, 20, 50)).toEqual(8342604);
  expect(hsv2rgb(90, 0, 0)).toEqual(0);
  expect(hsv2rgb(180, 0, 0)).toEqual(0);
  expect(hsv2rgb(360, 0, 0)).toEqual(0);
});

it('selectTextColor', () => {
  const w = '#ffffff';
  const b = '#000000';
  expect(selectTextColor(rgb2str(0, 0, 0))).toEqual(w);
  expect(selectTextColor(rgb2str(255, 255, 255))).toEqual(b);
  expect(selectTextColor(rgb2str(127, 0, 0))).toEqual(w);
  expect(selectTextColor(rgb2str(0, 0, 10))).toEqual(w);
});
