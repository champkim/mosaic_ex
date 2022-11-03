import type { BoundingBox } from "./BoundingBox";

export function tryJSonParse(jData: any): any {
  try {
    const data = JSON.parse(jData);
    return data;
  } catch (error) {
    console.log(jData + " cannot be parsed as JSON. It is shown by default.");
    return null;
  }
}

export function boundingBoxToInset(boundingBox: BoundingBox): string {
  return `${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%`;
}
