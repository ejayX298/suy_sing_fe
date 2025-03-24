declare module 'jsqr' {
  interface Point {
    x: number;
    y: number;
  }

  interface QRLocation {
    topLeftCorner: Point;
    topRightCorner: Point;
    bottomRightCorner: Point;
    bottomLeftCorner: Point;
  }

  interface QRCode {
    data: string;
    location: QRLocation;
  }

  interface Options {
    inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst';
  }

  function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: Options
  ): QRCode | null;

  export default jsQR;
}
