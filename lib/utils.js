// Shared utility functions without "use client"
export const milesText = (c, t) => (c.miles ? `${Number(c.miles).toLocaleString('en-US')} ${t?.mi || t?.miles || 'mi'}` : (t?.milesNA || ''));
