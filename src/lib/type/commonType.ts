export type mosaic = {
  direction: direction;
  first: string | mosaic;
  second?: string | mosaic;
  splitPercent?: number;
};

export type direction = "row" | "column";
