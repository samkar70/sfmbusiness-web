// The document (<html lang>, <body>) is rendered by app/[lang]/layout.js so the language attribute
// matches the URL. This root layout only passes children through.
export default function RootLayout({ children }) {
  return children;
}
