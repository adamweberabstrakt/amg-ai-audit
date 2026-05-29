export const metadata = {
  title: 'Terms of Service | Abstrakt AI Visibility Assessment',
  description: 'Terms governing use of the Abstrakt AI Visibility Assessment tool.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <p className="section-label mb-3">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">

          <section>
            <p>
              These Terms of Service ("<strong className="text-white">Terms</strong>") govern your use of the AI Visibility Assessment tool (the "<strong className="text-white">Service</strong>") operated by Abstrakt Marketing Group, LLC ("<strong className="text-white">Abstrakt</strong>", "<strong className="text-white">we</strong>", or "<strong className="text-white">us</strong>"). By accessing or using the Service, you agree to be bound by these Terms.
            </p>
          </section>

          <Section title="1. Description of Service">
            <p>
              The Service analyzes publicly available data about your website and business to generate an AI Visibility Assessment report. The report includes scores, competitive analysis, and recommendations based on data from third-party providers including Google PageSpeed Insights, SEMRush, Google Places, Anthropic Claude, and OpenAI GPT-4o.
            </p>
            <p className="mt-3">
              The Service is provided as a free lead generation tool. Abstrakt may contact you following your submission to discuss the results and our digital marketing services.
            </p>
          </Section>

          <Section title="2. Assessment Disclaimer">
            <p>
              <strong className="text-white">All scores, grades, and recommendations provided by this Service are estimates only.</strong> They are generated automatically using publicly available data and AI analysis and do not constitute professional marketing, legal, or technical advice.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>AI Visibility Scores are proprietary estimates and are not endorsed by or affiliated with Google, OpenAI, Anthropic, or any other AI platform</li>
              <li>Domain Authority metrics are sourced from SEMRush and reflect that provider's methodology, not any official ranking</li>
              <li>Google Business Profile data is retrieved from publicly available Google Places API results and may not reflect real-time listing status</li>
              <li>Competitor analysis is based on the domains you submit and publicly available SEO data — it does not represent a comprehensive competitive audit</li>
              <li>Results may vary based on the time of analysis, data freshness, and the information you provide</li>
            </ul>
            <p className="mt-3">
              Abstrakt makes no warranties, express or implied, regarding the accuracy, completeness, or fitness for any particular purpose of the assessment results.
            </p>
          </Section>

          <Section title="3. Consent to Contact">
            <p>
              By submitting the assessment form, you expressly consent to being contacted by Abstrakt Marketing Group at the phone number and email address you provide. This may include contact by email, phone call, or text message (SMS). Message and data rates may apply for SMS. You may opt out of future communications at any time by:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Replying STOP to any text message</li>
              <li>Clicking Unsubscribe in any email</li>
              <li>Contacting us at <a href="mailto:privacy@abstraktmg.com" className="text-brand-orange hover:underline">privacy@abstraktmg.com</a></li>
            </ul>
          </Section>

          <Section title="4. Accuracy of Information You Provide">
            <p>
              You represent that the information you submit — including your name, business name, website URL, and any competitor domains — is accurate and that you have the right to provide it. You agree not to submit false information, impersonate another business, or use the Service to analyze competitors in bad faith.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              The Service, including its design, code, scoring methodology, and report templates, is owned by Abstrakt Marketing Group and protected by applicable intellectual property laws. You may download and share your own assessment report for personal or business use. You may not reproduce, distribute, or create derivative works from the Service itself without written permission.
            </p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>
              The Service relies on third-party APIs and platforms. Abstrakt is not responsible for the availability, accuracy, or changes to data provided by Google, SEMRush, OpenAI, Anthropic, or other third-party providers. Links or references to third-party services do not constitute endorsement.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Abstrakt Marketing Group shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service or reliance on the assessment results, even if Abstrakt has been advised of the possibility of such damages.
            </p>
            <p className="mt-3">
              Abstrakt's total liability to you for any claim arising from use of the Service shall not exceed zero dollars ($0), as the Service is provided free of charge.
            </p>
          </Section>

          <Section title="8. Indemnification">
            <p>
              You agree to indemnify and hold harmless Abstrakt Marketing Group and its officers, employees, and agents from any claims, damages, or expenses (including reasonable attorneys' fees) arising from your use of the Service, your violation of these Terms, or your submission of inaccurate or misleading information.
            </p>
          </Section>

          <Section title="9. Availability and Modifications">
            <p>
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We may also update these Terms at any time. Continued use of the Service after changes to the Terms constitutes your acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms are governed by the laws of the State of Missouri, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in St. Louis County, Missouri.
            </p>
          </Section>

          <Section title="11. Contact">
            <div className="space-y-1">
              <p><strong className="text-white">Abstrakt Marketing Group, LLC</strong></p>
              <p>St. Louis, Missouri</p>
              <p>Email: <a href="mailto:legal@abstraktmg.com" className="text-brand-orange hover:underline">legal@abstraktmg.com</a></p>
              <p>Website: <a href="https://www.abstraktmg.com" className="text-brand-orange hover:underline">abstraktmg.com</a></p>
            </div>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-xs text-gray-600">
          <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
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
