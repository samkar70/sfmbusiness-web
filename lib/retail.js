// CARFAX retail values used for the "% below CARFAX" banners, keyed by vehicle id.
// Source: CARFAX Value tool (carfax.com/value), "Retail Value", Condition: Excellent, ZIP 76009,
// entered with each vehicle's VIN and odometer reading.
// To refresh: re-run each VIN on CARFAX, update the numbers and RETAIL_META.asOf. Values go stale,
// so re-check them from time to time (all checked 2026-11-09 except id 110, checked 2026-11-16).
// The "% below CARFAX" is calculated from the live price in the database, so a price change updates it
// automatically. Remove an id to hide its banner.
export const RETAIL_META = {
  source: 'CARFAX',
  condition: 'Excellent',
  zip: '76009',
  asOf: '2026-11-09',
};

// Under this percentage the banner shows the dollar amount below CARFAX instead of the percentage
// (a "3%" tag looks small, "$300 below" looks like a deal).
export const SMALL_PERCENT = 5;

export const RETAIL_VALUES = {
  89: 13070,  // 2014 Honda Accord EX-L V6, 74,524 mi
  96: 16240,  // 2020 Honda Civic EX-L, 65,936 mi
  101: 12980, // 2015 Lexus IS 250, 103,299 mi
  102: 11300, // 2011 Toyota RAV4 Limited, 87,300 mi
  104: 16840, // 2017 Lexus ES 350, 130,564 mi
  105: 10860, // 2017 Acura ILX Premium, 112,625 mi
  110: 9170,  // 2012 Honda CR-V EX-L, 130,262 mi (checked 2026-11-16)
};
