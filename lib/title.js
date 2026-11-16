// Title status shown on every vehicle (card, page, search snippet).
// SFM sells rebuilt-title vehicles, so every vehicle is labeled "Rebuilt title" by default.
// If a vehicle has a clean title, add its database id below set to 'clean' and the label disappears.
// Example: 123: 'clean',
export const TITLE_OVERRIDES = {
};

export const isRebuilt = (id) => (TITLE_OVERRIDES[id] || 'rebuilt') === 'rebuilt';
