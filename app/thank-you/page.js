import Link from 'next/link';

export const metadata = {
  title: 'You\'re Booked! | Abstrakt Marketing Group',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="font-heading font-bold text-xl tracking-wide">
            <span className="text-brand-orange">ABSTRAKT</span>
            <span className="text-white"> MARKETING GROUP</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-8">
            <span className="text-green-400 text-4xl">✓</span>
          </div>

          <p className="section-label mb-3">You're All Set</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Your Assessment Call Is Booked
          </h1>
          <p className="text-gray-300 text-lg mb-4">
            Check your email for your calendar confirmation. Our team will come prepared with your
            AI Visibility results and a custom action plan.
          </p>
          <p className="text-gray-400 mb-10">
            We've also sent your full AI Visibility Report to your inbox — including your score
            breakdown and top recommendations.
          </p>

          {/* What to expect */}
          <div className="card text-left mb-10">
            <h2 className="font-heading text-xl font-semibold mb-5 text-center">What to Expect on Your Call</h2>
            <div className="space-y-4">
              {[
                { icon: '📊', label: 'Review your AI Visibility Score', body: 'We\'ll walk through your score breakdown and what each signal means for your business.' },
                { icon: '🔍', label: 'Identify your biggest gaps', body: 'We\'ll pinpoint the 2–3 changes that will have the most impact on your AI discoverability.' },
                { icon: '🗺️', label: 'Get your custom roadmap', body: 'You\'ll leave with a prioritized action plan — whether you work with us or not.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/" className="btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/10 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Abstrakt Marketing Group.
          <a href="https://www.abstraktmg.com" className="hover:text-gray-400 ml-2 transition-colors">abstraktmg.com</a>
        </p>
      </footer>
    </div>
  );
}
