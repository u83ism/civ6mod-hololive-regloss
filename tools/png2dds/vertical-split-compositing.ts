export type RowSpan = { readonly top: number; readonly height: number };
export type VerticalHalves = { readonly upper: RowSpan; readonly lower: RowSpan };

// Split an image of two vertically stacked panels into two equal-height halves at its vertical center.
// For an odd height the single middle row is dropped, so both halves stay the same size and line up.
export const computeVerticalHalves = (imageHeight: number): VerticalHalves => {
  const halfHeight = Math.floor(imageHeight / 2);
  return {
    upper: { top: 0, height: halfHeight },
    lower: { top: imageHeight - halfHeight, height: halfHeight },
  };
};
