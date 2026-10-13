
import Logo from "./Logo"
import RingsGraphic from "./RingsGraphic"
import "../styles/auth.css"

function FitnessJourney() {
  return (
    <div
      className="fitness-journey"
      aria-label="رسم توضيحي لمراحل خسارة الوزن"
    >
      <div className="weight-loss-stages">
        {[1, 2, 3].map((stage) => (
          <svg
            key={stage}
            className={`weight-man stage-${stage}`}
            viewBox="0 0 120 250"
            role="img"
            aria-label={
              stage === 1
                ? "بداية رحلة خسارة الوزن"
                : stage === 2
                ? "مرحلة متوسطة من خسارة الوزن"
                : "جسم رياضي بعد خسارة الوزن"
            }
          >
            <defs>
              <linearGradient
                id={`greenBody${stage}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#D5FF70" />
                <stop offset="100%" stopColor="#86C72F" />
              </linearGradient>
            </defs>

            {/* Head */}
            <circle cx="60" cy="28" r="18" fill="#B8E6C8" />

            {/* Neck */}
            <path
              d="M51 43 L50 55 L70 55 L69 43"
              fill="#B8E6C8"
            />

            {/* Body changes shape at each stage */}
            <path
              d={
                stage === 1
                  ? "M42 52 Q25 58 25 82 L29 119 Q31 133 43 137 L45 157 L39 207 L54 207 L60 164 L67 207 L82 207 L75 157 L77 137 Q89 133 91 119 L95 82 Q95 58 78 52 L70 49 L50 49 Z"
                  : stage === 2
                  ? "M45 52 Q32 58 35 82 L39 119 L45 137 L49 157 L44 207 L57 207 L60 164 L65 207 L78 207 L71 157 L75 137 L81 119 L85 82 Q88 58 75 52 L69 49 L51 49 Z"
                  : "M49 52 Q39 58 42 82 L45 119 L50 137 L52 157 L49 207 L59 207 L60 164 L64 207 L73 207 L68 157 L70 137 L75 119 L78 82 Q81 58 71 52 L67 49 L53 49 Z"
              }
              fill={`url(#greenBody${stage})`}
            />

            {/* Arms */}
            <path
              d={
                stage === 1
                  ? "M39 58 Q29 61 26 78 L17 111 Q15 119 22 122 Q28 123 31 115 L45 83 Z"
                  : stage === 2
                  ? "M43 58 Q34 62 33 79 L27 110 Q26 118 32 120 Q38 121 40 112 L49 83 Z"
                  : "M47 58 Q40 62 40 79 L36 108 Q35 116 41 118 Q46 119 48 110 L53 83 Z"
              }
              fill="#B8E6C8"
            />

            <path
              d={
                stage === 1
                  ? "M81 58 Q91 61 94 78 L103 111 Q105 119 98 122 Q92 123 89 115 L75 83 Z"
                  : stage === 2
                  ? "M77 58 Q86 62 87 79 L93 110 Q94 118 88 120 Q82 121 80 112 L71 83 Z"
                  : "M73 58 Q80 62 80 79 L84 108 Q85 116 79 118 Q74 119 72 110 L67 83 Z"
              }
              fill="#B8E6C8"
            />

            {/* Clothing and shoes */}
            <path
              d="M45 132 L75 132 L71 157 L49 157 Z"
              fill="#24372C"
            />

            <path
              d="M42 204 L55 204 L57 218 L37 218 Q34 214 42 204 Z"
              fill="#D5FF70"
            />

            <path
              d="M65 204 L78 204 L84 218 L64 218 Z"
              fill="#D5FF70"
            />

            {/* Shirt detail */}
            <path
              d="M51 55 L60 65 L69 55"
              fill="none"
              stroke="#244C37"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ))}

        <div className="weight-stage-label">
          <span className="stage-dot" />
          رحلتك نحو جسم صحي
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({
  mode,
  go,
  title,
  subtitle,
  children
}) {
  const isSignup = mode === "signup"

  return (
    <div className={`au ${isSignup ? "au-signup" : "au-login"}`}>
      <section className="bp">
        <Logo light />

        <div className="bp-content">
          <h2>
            {isSignup ? (
              <>
                خطتك بتبدأ
                <br />
                من هنا
              </>
            ) : (
              <>
                كل خطوة
                <br />
                بتفرق معاك
              </>
            )}
          </h2>

          <p>
            أكل وتمارين على مقاسك،
            <br />
            ورحلة تناسب أهدافك
          </p>
        </div>

        {isSignup ? (
          <RingsGraphic className="rings" />
        ) : (
          <FitnessJourney />
        )}

        <div className="bp-footer">
          <span>NutriFit AI</span>
          <span>صحتك، خطتك، رحلتك</span>
        </div>
      </section>

      <section className="fp">
        <div className="seg">
          <button
            type="button"
            className={!isSignup ? "on" : ""}
            onClick={() => go("login")}
          >
            تسجيل دخول
          </button>

          <button
            type="button"
            className={isSignup ? "on" : ""}
            onClick={() => go("signup")}
          >
            حساب جديد
          </button>
        </div>

        <h1>{title}</h1>
        <p className="mu sub">{subtitle}</p>

        {children}

        <p className="back">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              go("landing")
            }}
          >
            ← الرجوع للصفحة الرئيسية
          </a>
        </p>
      </section>
    </div>
  )
}
