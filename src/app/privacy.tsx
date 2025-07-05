import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-gray-900 bg-white rounded-xl shadow my-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mb-4">
        <b>Emoji Hand</b> (“we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
      </p>
      <h2 className="text-xl font-bold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><b>Text Input:</b> We process the text you enter to provide emoji translation. We do not store your messages after processing.</li>
        <li><b>Usage Data:</b> We may collect anonymized usage statistics (e.g., most popular emojis, feature usage) to improve our service.</li>
        <li><b>Cookies:</b> We use cookies only for essential site functionality and analytics. No tracking cookies are used for advertising.</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide and improve the emoji translation service.</li>
        <li>To analyze usage trends and enhance user experience.</li>
        <li>To ensure site security and prevent abuse.</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">3. Third-Party Services</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We use OpenAI API to process your text. Your input is sent securely to OpenAI and not stored by us.</li>
        <li>We may use analytics providers (e.g., Google Analytics) to understand site usage. These services may set their own cookies.</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
      <h2 className="text-xl font-bold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You may request to access, correct, or delete your personal data by contacting us.</li>
        <li>EU/EEA users have additional rights under GDPR, including the right to object to processing and to lodge a complaint with a supervisory authority.</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">6. Changes to This Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
      <h2 className="text-xl font-bold mt-6 mb-2">7. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@emojihand.com" className="text-blue-600 underline">support@emojihand.com</a>.</p>
    </div>
  );
} 