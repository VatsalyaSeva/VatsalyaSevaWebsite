import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script defer src="https://checkout.razorpay.com/v1/checkout.js"></script>

      </body>
    </Html>
  )
}