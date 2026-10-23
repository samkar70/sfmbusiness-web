// Shared utility functions without "use client"
export const milesText = (c, t) => (c.miles ? `${c.miles.toLocaleString('en-US')} ${t.mi}` : t.milesNA);
