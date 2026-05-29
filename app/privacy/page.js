export const metadata = {
  title: 'Privacy Policy | Abstrakt AI Visibility Assessment',
  description: 'How Abstrakt Marketing Group collects, uses, and protects your information when you use the AI Visibility Assessment tool.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <p className="section-label mb-3">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 text-sm leading-relaxed">

          <section>
            <p>
              Abstrakt Marketing Group, LLC ("<strong className="text-white">Abstrakt</strong>", "<strong className="text-white">we</strong>", "<strong className="text-white">us</strong>", or "<strong className="text-white">our</strong>") operates the AI Visibility Assessment tool located at <a href="https://amg-ai-audit.vercel.app" className="text-brand-orange hover:underline">amg-ai-audit.vercel.app</a> (the "<strong className="text-white">Service</strong>"). This Privacy Policy explains what information we collect when you use the Service, how we use it, and your rights regarding that information.
            </p>
            <p className="mt-3">
              By submitting the assessment form, you acknowledge that you have read and agree to this Privacy Policy.
            </p>
          </section>

          <Section title="1. Information We Collect">
            <p>When you complete the assessment form, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-white">Contact information</strong> — first name, last name, email address, phone number</li>
              <li><strong className="text-white">Business information</strong> — company name, website URL, industry, business goals, budget range</li>
              <li><strong className="text-white">Marketing context</strong> — whether you run paid ads, social media presence, AI tools used, competitor domains you provide</li>
              <li><strong className="text-white">Technical data</strong> — IP address, browser type, referring URL, UTM parameters and Google Click ID (gclid) if present in your URL</li>
            </ul>
            <p className="mt-3">
              We also automatically analyze publicly available data about the website URL you submit, including PageSpeed performance scores, Google Business Profile information, and domain authority metrics from third-party providers.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information collected to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Generate your AI Visibility Assessment report and deliver it to the email address you provide</li>
              <li>Contact you about your assessment results and Abstrakt's digital marketing services</li>
              <li>Log your submission in our CRM and sales pipeline (via Zapier and Google Sheets) for follow-up by our team</li>
              <li>Improve the accuracy and quality of the assessment tool</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              By submitting the form, you expressly consent to being contacted by Abstrakt Marketing Group at the phone number and email address you provide, including by email, phone call, or text message, regarding your assessment results and our services.
            </p>
          </Section>

          <Section title="3. Third-Party Service Providers">
            <p>We share your information with the following third-party processors to operate the Service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-white">Zapier</strong> — routes form submission data to our internal Google Sheets CRM</li>
              <li><strong className="text-white">Brevo (formerly Sendinblue)</strong> — sends transactional email notifications to our team</li>
              <li><strong className="text-white">Resend</strong> — delivers your assessment report PDF to your email address</li>
              <li><strong className="text-white">Anthropic</strong> — your website and business data is processed by Claude AI to generate visibility analysis (no personal contact information is sent)</li>
              <li><strong className="text-white">OpenAI</strong> — your company name and industry are queried against GPT-4o with web search to test AI mention visibility (no personal contact information is sent)</li>
              <li><strong className="text-white">Google APIs</strong> — your website URL is analyzed via PageSpeed Insights and Google Places APIs</li>
              <li><strong className="text-white">SEMRush</strong> — your website domain and competitor domains are analyzed for SEO metrics</li>
              <li><strong className="text-white">Vercel</strong> — hosts the Service and stores shareable report data in Vercel Blob storage</li>
              <li><strong className="text-white">ChiliPiper</strong> — powers the meeting scheduling feature if you choose to book a strategy call</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties or share it with advertisers.
            </p>
          </Section>

          <Section title="4. Cookies and Tracking">
            <p>
              The Service may use cookies and similar tracking technologies to recognize your browser, remember preferences, and analyze usage. If you run advertising campaigns pointing to this Service, conversion tracking pixels (such as Google Ads or Meta Pixel) may be present on this domain.
            </p>
            <p className="mt-3">
              You may disable cookies through your browser settings. Disabling cookies will not affect your ability to use the assessment form.
            </p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your contact and business information for as long as necessary to provide follow-up services and maintain our business records, typically no longer than 3 years from your last interaction with us. Shareable report links stored in Vercel Blob may expire or be deleted at our discretion.
            </p>
            <p className="mt-3">
              You may request deletion of your personal information at any time by contacting us at <a href="mailto:privacy@abstraktmg.com" className="text-brand-orange hover:underline">privacy@abstraktmg.com</a>.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-white">Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="text-white">Correction</strong> — request correction of inaccurate data</li>
              <li><strong className="text-white">Deletion</strong> — request deletion of your personal data</li>
              <li><strong className="text-white">Opt-out</strong> — opt out of future marketing communications at any time by replying STOP to any text message or clicking Unsubscribe in any email</li>
              <li><strong className="text-white">California residents (CCPA)</strong> — you have the right to know what personal information is collected, to delete it, and to opt out of its sale (we do not sell personal information)</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at <a href="mailto:privacy@abstraktmg.com" className="text-brand-orange hover:underline">privacy@abstraktmg.com</a>.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              This Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has submitted information through this Service, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised "Last updated" date. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>For questions about this Privacy Policy or our data practices:</p>
            <div className="mt-3 space-y-1">
              <p><strong className="text-white">Abstrakt Marketing Group, LLC</strong></p>
              <p>St. Louis, Missouri</p>
              <p>Email: <a href="mailto:privacy@abstraktmg.com" className="text-brand-orange hover:underline">privacy@abstraktmg.com</a></p>
              <p>Website: <a href="https://www.abstraktmg.com" className="text-brand-orange hover:underline">abstraktmg.com</a></p>
            </div>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-xs text-gray-600">
          <a href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <a href="/" className="hover:text-gray-400 transition-colors">← Back to Assessment</a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-heading text-lg font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}
