// src/components/Footer.jsx


import { useState } from "react";

/**
 * Footer Component
 */
export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="w-full bg-gray-900 text-white px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-bold mb-2 text-sm sm:text-base">TruthLabel</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg">
            Making product transparency accessible to everyone.
          </p>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-sm font-semibold sm:text-base">
            <a id="contact-link" href="mailto:aishwaryarao669@gmail.com" className="text-gray-400 hover:underline">Contact</a>
          </h4>
        </div>
        <div>
           <h4 className="text-sm font-semibold sm:text-base">
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="text-gray-400 hover:underline focus:outline-none"
            >
              Privacy
            </button>
          </h4>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-6 text-xs sm:text-sm">
        © 2026 TruthLabel
      </p>

      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div role="dialog" aria-modal="true" className="bg-white max-w-2xl items-center w-full rounded-lg p-6 mx-4">
            <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">TruthLabel Privacy (MVP)</h3>
            <div className="text-sm text-gray-700 space-y-3 mb-4">
              <p>
                We collect minimal product and usage data to provide transparency scores and improve recommendations. We do not collect personal data unless you explicitly provide it.
              </p>
              <p>
                Contact information provided for account or support purposes will only be used to communicate with you and will not be sold to third parties.
              </p>
              <p>
                We may store non-identifying analytics to help improve the service. Data is retained only as long as necessary for these purposes.
              </p>
              <p>
                For questions or requests regarding data, click{' '}
                <button
                  type="button"
                  onClick={() => (window.location.href = 'mailto:aishwaryarao669@gmail.com')}
                  className="text-green-500 underline font-medium focus:outline-none"
                >
                  here
                </button>
                .
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}