import "./globals.css";
import { inter, firaCode, rubik } from '../lib/fonts'
import { baseMetadata, jsonLdSchema } from "@/lib/metadata";

export const metadata = baseMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchema)
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} ${rubik.variable} antialiased`}
        style={{ marginRight: '0% !important' }}>
        {children}
      </body>
    </html >
  );
}
