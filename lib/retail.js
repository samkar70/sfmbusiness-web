// CARFAX retail values used for the "% below CARFAX" banners, keyed by vehicle id.
// Source: CARFAX Value tool (carfax.com/value), "Retail Value", Condition: Excellent, ZIP 76009,
// entered with each vehicle's VIN and odometer reading.
// To refresh: re-run each VIN on CARFAX, update the numbers and RETAIL_META.asOf. Values go stale,
// and the banner shows the date. Remove an id to hide its banner.
export const RETAIL_META = {
  source: 'CARFAX',
  condition: 'Excellent',
  zip: '76009',
  asOf: '2026-11-09',
};

export const RETAIL_VALUES = {
  89: 13070,  // 2014 Honda Accord EX-L V6, 74,524 mi
  96: 16240,  // 2020 Honda Civic EX-L, 65,936 mi
  100: 8430,  // 2014 Acura ILX 2.0L, 120,371 mi
  101: 12980, // 2015 Lexus IS 250, 103,299 mi
  102: 11300, // 2011 Toyota RAV4 Limited, 87,300 mi
  104: 16840, // 2017 Lexus ES 350, 130,564 mi
  105: 10860, // 2017 Acura ILX Premium, 112,625 mi
};
