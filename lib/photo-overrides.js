// Vehicles whose photos are served from /public/photos/<vehicle id>/<n>.jpg (sharper originals)
// instead of the small 600x800 copies stored in the database.
// Value = number of photos available. To use a new set: add the files as 0.jpg, 1.jpg, ... in
// public/photos/<id>/ and list the id and count here. Remove the entry to go back to the database photos.
export const PHOTO_OVERRIDES = {
  89: 20,
  96: 19,
  100: 20,
  101: 20,
  102: 20,
  104: 20,
  105: 20,
};
