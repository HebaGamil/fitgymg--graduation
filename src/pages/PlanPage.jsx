
import { useState } from "react";
import { bmi, targets } from "../lib/calc";
import NutritionContent from "../components/NutritionContent";
import "../styles/plan.css";

const WEEK_DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7" />
    </svg>
  );
}

function NutritionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3v7M9 3v7M5 7h4M7 10v11M16 3v18M16 3c4 2 4 7 0 9" />
    </svg>
  );
}

function ExerciseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m2 8 10-5 10 5-10 5L2 8Z M6 11v5c4 4 8 4 12 0v-5M22 8v7" />
    </svg>
  );
}

function SupplementIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6M11 3v7L3 20h18l-8-10V3M7 16h10" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="8" r="4" />
      <path d="M2 21v-2a8 8 0 0 1 14-5M19 8v6M16 11h6M18 3v2M16 4l-1-1" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2v10M6 5a9 9 0 1 0 12 0" />
    </svg>
  );
}

function ProgressContent({ weight, tdee, kcal }) {
  const monthlyChange = ((kcal - tdee) * 30) / 7700;

  const months = Array.from({ length: 7 }, (_, index) => ({
    month: index === 0 ? "Now" : `M${index}`,
    weight: Math.max(30, weight + monthlyChange * index),
  }));

  const projectedWeight = months[6].weight;
  const weightChange = projectedWeight - weight;

  const minWeight = Math.min(...months.map((item) => item.weight));
  const maxWeight = Math.max(...months.map((item) => item.weight));
  const range = Math.max(maxWeight - minWeight, 1);
  const chartHeight = 210;

  const bars = months.map((item) => ({
    ...item,
    height: 55 + ((item.weight - minWeight) / range) * 145,
  }));

  return (
    <section className="nf-progress-content">
      <div className="nf-progress-chart">
        <svg
          viewBox="0 0 700 300"
          role="img"
          aria-label="Projected weight change over six months"
          preserveAspectRatio="none"
        >
          {[30, 95, 160, 225].map((y) => (
            <line
              key={y}
              x1="35"
              y1={y}
              x2="675"
              y2={y}
              stroke="#536782"
              strokeWidth="1.5"
            />
          ))}

          {[35, 110, 185, 260, 335, 410, 485, 560, 635].map((x) => (
            <line
              key={x}
              x1={x}
              y1="15"
              x2={x}
              y2="225"
              stroke="#536782"
              strokeWidth="1.5"
            />
          ))}

          {bars.map((item, index) => {
            const x = 80 + index * 88;
            const height = (item.height / 200) * chartHeight;

            return (
              <g key={item.month}>
                <rect
                  x={x}
                  y={225 - height}
                  width="22"
                  height={height}
                  fill="#000000"
                />
                <text
                  x={x + 11}
                  y="250"
                  textAnchor="middle"
                  fontSize="13"
                  fill="#111111"
                >
                  {item.month}
                </text>
              </g>
            );
          })}

          <path
            d="M35 15 V225 H675 M35 15 L20 32 M35 15 L50 32 M675 225 L658 208 M675 225 L658 242"
            fill="none"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text
            x="355"
            y="285"
            textAnchor="middle"
            fontSize="15"
            fill="#111111"
          >
            Months
          </text>
        </svg>
      </div>

      <div className="nf-progress-stats">
        <div className="nf-progress-stat">
          <span>Starting Weight</span>
          <b>{weight.toFixed(2)} kg</b>
        </div>

        <div className="nf-progress-stat">
          <span>Expected Weight</span>
          <b>{projectedWeight.toFixed(2)} kg</b>
        </div>

        <div className="nf-progress-stat">
          <span>Expected Change</span>
          <b>
            {weightChange > 0 ? "+" : ""}
            {weightChange.toFixed(2)} kg
          </b>
        </div>
      </div>

      <p className="nf-progress-note">
        Estimated weight projection based on your daily calorie target.
        Actual results may vary.
      </p>
    </section>
  );
}

/* Workout exercises based on the selected training split */
const WORKOUTS = {
  Push: [
    "Machine Chest Press",
    "Dumbbell Lateral Raise",
    "Butterfly Machine",
    "Cable Triceps Pushdown",
    "Front Machine Shoulder Press",
  ],
  Pull: [
    "Lat Pulldown",
    "Seated Cable Row",
    "Chest Supported Row",
    "Dumbbell Biceps Curl",
    "Face Pull",
  ],
  Legs: [
    "Leg Press",
    "Seated Leg Curl",
    "Leg Extension",
    "Hip Abduction Machine",
    "Standing Calf Raise",
  ],
  Upper: [
    "Machine Chest Press",
    "Lat Pulldown",
    "Seated Cable Row",
    "Dumbbell Lateral Raise",
    "Cable Triceps Pushdown",
  ],
  Lower: [
    "Leg Press",
    "Seated Leg Curl",
    "Leg Extension",
    "Hip Abduction Machine",
    "Standing Calf Raise",
  ],
  "Full Body": [
    "Machine Chest Press",
    "Lat Pulldown",
    "Leg Press",
    "Seated Leg Curl",
    "Cable Biceps Curl",
  ],
};

function getWorkoutSplit(trainingCount) {
  if (trainingCount <= 2) {
    return ["Full Body", "Full Body"];
  }

  if (trainingCount === 3) {
    return ["Push", "Pull", "Legs"];
  }

  if (trainingCount === 4) {
    return ["Upper", "Lower", "Upper", "Lower"];
  }

  if (trainingCount === 5) {
    return ["Push", "Pull", "Legs", "Upper", "Lower"];
  }

  return ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
}

function getExercises(split, injury) {
  if (injury === "shoulder") {
    return [
      "Stationary Bike",
      "Seated Leg Curl",
      "Hip Abduction Machine",
      "Standing Calf Raise",
      "Glute Bridge",
    ];
  }

  if (injury === "knee" && (split === "Legs" || split === "Lower")) {
    return [
      "Seated Cable Row",
      "Chest Supported Row",
      "Dumbbell Biceps Curl",
      "Cable Triceps Pushdown",
      "Stationary Bike",
    ];
  }

  if (injury === "lowerBack" && (split === "Pull" || split === "Full Body")) {
    return [
      "Lat Pulldown",
      "Chest Supported Row",
      "Seated Cable Row",
      "Machine Chest Press",
      "Dumbbell Biceps Curl",
    ];
  }

  return WORKOUTS[split] || WORKOUTS["Full Body"];
}

function WorkoutContent({ data }) {
  const selectedDays = Array.isArray(data.days)
    ? data.days.map(Boolean)
    : [true, true, false, true, false, true, false];

  const trainingCount = selectedDays.filter(Boolean).length;
  const splitPlan = getWorkoutSplit(trainingCount);

  const todayIndex = (new Date().getDay() + 1) % 7;
  const isTrainingDay = selectedDays[todayIndex];

  const trainingDayPosition = selectedDays
    .slice(0, todayIndex + 1)
    .filter(Boolean).length - 1;

  const todaySplit = isTrainingDay
    ? splitPlan[Math.max(0, trainingDayPosition)] || "Full Body"
    : "Rest";

  const exercises =
    todaySplit === "Rest"
      ? []
      : getExercises(todaySplit, data.injury);

  const sets =
    data.level === "advanced" ? 4 : data.level === "intermediate" ? 3 : 2;

  const reps = data.goal === "fitness" ? 12 : 10;
  const restTime = data.level === "beginner" ? 2 : 3;

  return (
    <section className="nf-workout-content">
      <div className="nf-weekly-card">
        <div className="nf-weekly-heading">
          <div className="nf-weekly-title">
            <span className="nf-calendar-icon">▦</span>
            <h2>Weekly Schedule</h2>
          </div>

          <div className="nf-weekly-legend">
            <span>
              <b className="nf-star training-star">★</b>
              Training Day
            </span>
            <span>
              <b className="nf-star rest-star">★</b>
              Rest Day
            </span>
          </div>
        </div>

        <div className="nf-weekly-days">
          {WEEK_DAYS.map((day, index) => (
            <div className="nf-weekly-day" key={day}>
              <span
                className={`nf-star ${
                  selectedDays[index] ? "training-star" : "rest-star"
                }`}
              >
                ★
              </span>
              <span className="nf-day-name">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="nf-today-title">
        Today's Exercise
      </h2>

      <div className="nf-exercise-layout">
        <div className="nf-exercise-list">
          {isTrainingDay ? (
            exercises.map((exercise, index) => (
              <div className="nf-exercise-item" key={`${exercise}-${index}`}>
                <span className="nf-exercise-number">{index + 1}</span>
                <span className="nf-exercise-name">{exercise}</span>
                <span className="nf-exercise-reps">
                  {sets} sets * {reps} reps
                </span>
              </div>
            ))
          ) : (
            <div className="nf-rest-message">
              <span className="nf-rest-star">★</span>
              <h3>Rest Day</h3>
              <p>Take a rest and get ready for your next workout.</p>
            </div>
          )}
        </div>

        <aside className="nf-workout-tips">
          <div className="nf-tip-item">
            <span className="nf-tip-icon">⚒</span>
            <h3>Tip</h3>
            <p>Focus on good form and controlled movements.</p>
          </div>

          <div className="nf-tip-item">
            <span className="nf-tip-icon">◷</span>
            <h3>Rest</h3>
            <p>Take {restTime} minutes between sets.</p>
          </div>

          <div className="nf-tip-item">
            <span className="nf-tip-icon">♧</span>
            <h3>Water</h3>
            <p>Drink water regularly during your workout.</p>
          </div>
        </aside>
      </div>

      {data.injury && data.injury !== "none" && (
        <p className="nf-injury-note">
          Your workout includes modified exercises based on the injury
          information you provided. Check with a qualified professional before
          exercising with an injury.
        </p>
      )}
    </section>
  );
}

export default function PlanPage({ go, profile }) {
  const [activeSection, setActiveSection] = useState("home");

  const data = profile || {
    age: 20,
    sex: "female",
    weight: 75,
    height: 176,
    goal: "cut",
    level: "beginner",
    days: [1, 1, 1, 1, 0, 0, 0],
    injury: "none",
  };

  const days = Array.isArray(data.days)
    ? data.days.filter(Boolean).length
    : Number(data.days) || 0;

  const result = targets({
    ...data,
    days,
    weight: Number(data.weight),
    height: Number(data.height),
    age: Number(data.age),
  });

  const userBMI = bmi(Number(data.weight), Number(data.height));

  const consumed = {
    kcal: Number(data.consumedKcal) || 0,
    protein: Number(data.consumedProtein) || 0,
    carbs: Number(data.consumedCarbs) || 0,
    fat: Number(data.consumedFat) || 0,
  };

  const remaining = Math.max(0, result.kcal - consumed.kcal);

  const macros = [
    { name: "Protein", consumed: consumed.protein, target: result.protein },
    { name: "Carb", consumed: consumed.carbs, target: result.carbs },
    { name: "Fat", consumed: consumed.fat, target: result.fat },
  ];

  return (
    <div className="nf-dashboard">
      <header className="nf-banner">
        <img
          src="/images/nutrifit-banner.png"
          alt="NutriFit - Better Food, Healthier You"
        />
      </header>

      <nav className="nf-navigation">
        <button
          className={`nf-nav-button nf-home ${
            activeSection === "home" ? "active" : ""
          }`}
          onClick={() => setActiveSection("home")}
        >
          <span>Home</span>
          <HomeIcon />
        </button>

        <button
          className={`nf-nav-button nf-nutrition ${
            activeSection === "nutrition" ? "active" : ""
          }`}
          onClick={() => setActiveSection("nutrition")}
        >
          <span>Nutrition</span>
          <NutritionIcon />
        </button>

        <button
          className={`nf-nav-button nf-exercise ${
            activeSection === "exercise" ? "active" : ""
          }`}
          onClick={() => setActiveSection("exercise")}
        >
          <span>Exercise</span>
          <ExerciseIcon />
        </button>

        <button
          className="nf-profile"
          onClick={() => go("details")}
          title="Profile"
          aria-label="Profile"
        >
          <UserIcon />
        </button>

        <button
          className={`nf-nav-button nf-progress ${
            activeSection === "progress" ? "active" : ""
          }`}
          onClick={() => setActiveSection("progress")}
        >
          <span>Progress</span>
          <ProgressIcon />
        </button>

        <button
          className={`nf-nav-button nf-supplements ${
            activeSection === "supplements" ? "active" : ""
          }`}
          onClick={() => setActiveSection("supplements")}
        >
          <span>Supplements</span>
          <SupplementIcon />
        </button>
      </nav>

      {activeSection === "progress" ? (
        <ProgressContent
          weight={Number(data.weight)}
          tdee={result.tdee}
          kcal={result.kcal}
        />
      ) : activeSection === "exercise" ? (
        <WorkoutContent data={data} />
      ) : activeSection === "home" ? (
        <section className="nf-dashboard-cards">
          <div className="nf-card nf-vitals">
            <h2>Vital signs</h2>

            <div className="nf-info-row">
              <span>Age</span>
              <b>{data.age}</b>
            </div>

            <div className="nf-info-row">
              <span>Weight</span>
              <b>{data.weight}</b>
            </div>

            <div className="nf-info-row">
              <span>Height</span>
              <b>{data.height}</b>
            </div>

            <div className="nf-info-row">
              <span>Mass Index</span>
              <b>{userBMI}</b>
            </div>

            <div className="nf-info-row">
              <span>Exercise days</span>
              <b>{days}</b>
            </div>
          </div>

          <div className="nf-card nf-calories">
            <h2>Kcal</h2>
            <div className="nf-calorie-circle">{result.kcal}</div>
            <div className="nf-remaining">
              <span>Remaining</span>
              <b>{remaining}</b>
            </div>
          </div>

          <div className="nf-card nf-macros">
            <h2>Macros</h2>

            {macros.map((item) => {
              const percentage =
                item.target > 0
                  ? Math.min(100, (item.consumed / item.target) * 100)
                  : 0;

              return (
                <div className="nf-macro" key={item.name}>
                  <div className="nf-macro-label">
                    <span>{item.name}</span>
                    <b>
                      {item.consumed}/{item.target}
                    </b>
                  </div>

                  <div
                    className="nf-progress-track"
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="nf-progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : activeSection === "nutrition" ? (
        <NutritionContent targets={result} consumed={consumed} />
      ) : (
        <section className="nf-section-placeholder">
          <h2>Supplements</h2>
          <p>This section will be added next.</p>
        </section>
      )}

      <footer className="nf-footer">
        <button className="nf-logout" onClick={() => go("landing")}>
          <span>Log out</span>
          <LogoutIcon />
        </button>
      </footer>
    </div>
  );
}
