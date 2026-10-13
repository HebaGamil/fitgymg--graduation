import Logo from "../components/Logo"
import RingsGraphic from "../components/RingsGraphic"
import "../styles/landing.css"

const FEATURES = [
  [
    "خطة أكل على مقاسك",
    "السعرات والماكروز بتتحسب من سنك ووزنك وطولك وهدفك، وبأكل مصري تعرفه.",
  ],
  [
    "تمارين بتراعي إصاباتك",
    "قولنا فين بيوجعك، وهنشيل التمارين الخطرة ونحط بدائل مناسبة.",
  ],
  [
    "متابعة تقدمك",
    "سجّل وزنك وعلّم تمارينك، وشوف تقدمك مع الوقت.",
  ],
]

const STEPS = [
  ["اعمل حساب", "سجّل حسابك وابدأ رحلتك في دقائق."],
  ["اكتب بياناتك", "أدخل وزنك وطولك وهدفك وأيام التمرين وأي إصابات."],
  ["خد خطتك", "تابع خطة الأكل والتمارين وعدّلها حسب احتياجاتك."],
]

export default function LandingPage({ go }) {
  return (
    <div className="landing" dir="rtl">
      {/* Header */}
      <header className="lh">
        <Logo light />

        <nav className="bt" aria-label="التنقل">
          <button
            type="button"
            className="btn ghost"
            onClick={() => go("login")}
          >
            ادخل
          </button>

          <button
            type="button"
            className="btn lime"
            onClick={() => go("signup")}
          >
            إنشاء حساب
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">
              صحتك تستاهل بداية جديدة
            </span>

            <h1>
              أكلك وتمرينك
              <br />
              <span>على مقاسك إنت</span>
            </h1>

            <p>
              اكتب بياناتك وهدفك وإصاباتك، وNutriFit AI
              يجهزلك خطة أكل وتمارين تناسب احتياجاتك.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn lime big"
                onClick={() => go("signup")}
              >
                ابدأ خطتك دلوقتي
                <span aria-hidden="true">←</span>
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={() => go("login")}
              >
                عندك حساب؟ ادخل
              </button>
            </div>

            <div className="hero-trust">
              <span>✓ خطة تناسب هدفك</span>
              <span>✓ متابعة تقدمك</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-glow" />

            <RingsGraphic className="rings" />

            <div className="pill pill-calories">
              <span className="pill-icon">✳</span>
              <span>
                <strong>2,550</strong>
                <small>سعر حراري</small>
              </span>
            </div>

            <div className="pill pill-days">
              <span className="pill-icon">◷</span>
              <span>
                <strong>4 أيام</strong>
                <small>تمرين في الأسبوع</small>
              </span>
            </div>

            <div className="pill pill-injury">
              <span className="pill-icon">✓</span>
              <span>
                <strong>تمارين بديلة</strong>
                <small>مراعاة للإصابات</small>
              </span>
            </div>

            <div className="hero-caption">
              <span className="caption-dot" />
              خطتك تبدأ من احتياجاتك
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="sec" id="features">
          <div className="section-heading">
            <span className="section-label">مميزاتنا</span>
            <h2>
              ليه <span>NutriFit AI؟</span>
            </h2>
            <p>
              كل اللي تحتاجه علشان تتابع رحلتك الصحية في مكان واحد.
            </p>
          </div>

          <div className="f3">
            {FEATURES.map(([title, description], index) => (
              <article className="card" key={title}>
                <div className="feature-icon">
                  {["◈", "✳", "↗"][index]}
                </div>

                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="sec how-section">
          <div className="section-heading">
            <span className="section-label">بكل بساطة</span>
            <h2>رحلتك بتبدأ في <span>3 خطوات</span></h2>
            <p>خطوات سهلة علشان تبدأ تخطط لهدفك.</p>
          </div>

          <div className="f3">
            {STEPS.map(([title, description], index) => (
              <article className="card step-card" key={title}>
                <div className="nb">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="warn center">
            الخطة إرشادية ومش بديل للدكتور أو أخصائي التغذية.
            تحليل الأشعة تقدير أولي مش تشخيص طبي.
          </div>

          <div className="center final-cta">
            <h2>جاهز تبدأ رحلتك؟</h2>
            <p>ابدأ بخطوة صغيرة النهارده.</p>

            <button
              type="button"
              className="btn dark big"
              onClick={() => go("signup")}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </section>
      </main>

      <footer className="ft">
        <Logo light />
        <span>NutriFit AI · مشروع تخرج</span>
        <button
          type="button"
          className="footer-login"
          onClick={() => go("login")}
        >
          ادخل لحسابك
        </button>
      </footer>
    </div>
  )
}
