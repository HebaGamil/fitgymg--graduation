
import { useEffect, useRef, useState } from "react";
import "../styles/nutrition.css";

const meals = [
  {
    name: "Breakfast",
    time: "08:00AM",
    foods: ["potato+bread", "+beans+egg"],
    calories: 500,
    icon: "☀",
    color: "breakfast",
  },
  {
    name: "Lunch",
    time: "02:00PM",
    foods: ["chicken+rice", "+salad+vege"],
    calories: 750,
    icon: "☀",
    color: "lunch",
  },
  {
    name: "Dinner",
    time: "08:00PM",
    foods: ["cheese+yogurt", "tuna+baked"],
    calories: 900,
    icon: "☾",
    color: "dinner",
  },
  {
    name: "Snacks",
    time: "Any Time",
    foods: ["oat+banana+nut", "+milk+honey"],
    calories: 1000,
    icon: "🍎",
    color: "snacks",
  },
];

const foodOptions = [
  { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: "Boiled Egg", calories: 78, protein: 6, carbs: 1, fat: 5 },
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Greek Yogurt", calories: 100, protein: 10, carbs: 6, fat: 3 },
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 2 },
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14 },
];

function NutritionMetric({ label, value, goal, color, icon }) {
  const percentage =
    goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className={`nf-nutrition-metric ${color}`}>
      <span className="nf-metric-icon">{icon}</span>
      <span className="nf-metric-label">{label}</span>
      <strong className="nf-metric-value">
        {Math.round(value)}{label === "Kcal" ? "" : "g"}
      </strong>
      <span className="nf-metric-goal">Of {Math.round(goal)}</span>

      <div className="nf-mini-track">
        <div
          className="nf-mini-progress"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function NutritionContent({
  targets = {},
  consumed = {},
}) {
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const cameraInput = useRef(null);
  const uploadInput = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Attach camera stream to video
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;

      videoRef.current.play().catch(() => {
        setCameraError("Unable to start the camera preview.");
      });
    }
  }, [showCamera]);

  // Stop camera when component is removed
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const goals = {
    kcal: Number(targets?.kcal) || 2800,
    protein: Number(targets?.protein) || 250,
    carbs: Number(targets?.carbs) || 650,
    fat: Number(targets?.fat) || 100,
  };

  const totals = {
    kcal: Number(consumed?.kcal) || 0,
    protein: Number(consumed?.protein) || 0,
    carbs: Number(consumed?.carbs) || 0,
    fat: Number(consumed?.fat) || 0,
  };

  loggedFoods.forEach((food) => {
    totals.kcal += food.calories;
    totals.protein += food.protein;
    totals.carbs += food.carbs;
    totals.fat += food.fat;
  });

  const dailyPercentage =
    goals.kcal > 0
      ? Math.min(Math.round((totals.kcal / goals.kcal) * 100), 100)
      : 0;

  const filteredFoods = foodOptions.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  function addFood(food) {
    setLoggedFoods((current) => [...current, food]);
    setSearch("");
    setShowSearch(false);
  }

  function handleImage(event) {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowScanner(true);
    }

    event.target.value = "";
  }

  // Open webcam / mobile camera
  async function openCamera() {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera is not supported by this browser. Please use Upload Image."
      );
      setShowCamera(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;
      setShowCamera(true);
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Unable to access the camera. Please allow camera permission or use Upload Image."
      );

      setShowCamera(true);
    }
  }

  // Stop camera
  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setShowCamera(false);
  }

  // Capture photo from webcam
  function capturePhoto() {
    const video = videoRef.current;

    if (!video || !video.videoWidth) {
      setCameraError("Camera is not ready yet. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture the photo. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Unable to save the photo. Please try again.");
          return;
        }

        const imageUrl = URL.createObjectURL(blob);

        setSelectedImage(imageUrl);
        closeCamera();
        setShowScanner(true);
      },
      "image/jpeg",
      0.9
    );
  }

  function openFoodSearch() {
    setSearch("");
    setShowSearch(true);
  }

  return (
    <div className="nf-nutrition-content">
      <section className="nf-nutrition-summary">
        <div className="nf-daily-goal">
          <span className="nf-summary-label">Daily Nutrition</span>
          <strong className="nf-daily-percentage">
            {dailyPercentage}%
          </strong>
          <span className="nf-daily-caption">Of goal</span>

          <div className="nf-daily-track">
            <span style={{ width: `${dailyPercentage}%` }} />
          </div>
        </div>

        <NutritionMetric
          label="Kcal"
          value={totals.kcal}
          goal={goals.kcal}
          color="nf-kcal"
          icon="♨"
        />

        <NutritionMetric
          label="Protein"
          value={totals.protein}
          goal={goals.protein}
          color="nf-protein"
          icon="♧"
        />

        <NutritionMetric
          label="Carb"
          value={totals.carbs}
          goal={goals.carbs}
          color="nf-carb"
          icon="♢"
        />

        <NutritionMetric
          label="Fat"
          value={totals.fat}
          goal={goals.fat}
          color="nf-fat"
          icon="♧"
        />
      </section>

      <section className="nf-meals-section">
        <div className="nf-meal-grid">
          {meals.map((meal) => (
            <article
              className={`nf-meal-card ${meal.color}`}
              key={meal.name}
            >
              <div className="nf-meal-title">
                <span className="nf-meal-icon">{meal.icon}</span>
                <h3>{meal.name}</h3>
              </div>

              <span className="nf-meal-time">{meal.time}</span>

              <div className="nf-meal-foods">
                {meal.foods.map((food) => (
                  <span key={food}>{food}</span>
                ))}
              </div>

              <div className="nf-meal-bottom">
                <span className="nf-meal-calories">
                  {meal.calories} kcal
                </span>

                <button
                  type="button"
                  className="nf-meal-add"
                  aria-label={`Add ${meal.name} food`}
                  onClick={openFoodSearch}
                >
                  <span>↪</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="nf-nutrition-actions">
        <div className="nf-action-row">
          <div className="nf-action-card nf-scanner-card">
            <span className="nf-action-main-icon">▣</span>

            <div className="nf-action-content">
              <strong>AI Food Scanner</strong>

              <div className="nf-scanner-buttons">
                <button
                  type="button"
                  onClick={openCamera}
                >
                  <span>◉</span> Take Photo
                </button>

                <button
                  type="button"
                  onClick={() => uploadInput.current?.click()}
                >
                  <span>▧</span> Upload Image
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="nf-action-card nf-build-card"
            onClick={openFoodSearch}
          >
            <span className="nf-action-main-icon">♧</span>

            <span className="nf-action-content">
              <strong>Build My Day</strong>
              <small>
                let AI create a personalized Daily meals
                using that the foods you have available.
              </small>
            </span>

            <span className="nf-action-arrow">›</span>
          </button>

          <button
            type="button"
            className="nf-action-card nf-add-card"
            onClick={openFoodSearch}
          >
            <span className="nf-action-main-icon">☰</span>

            <span className="nf-action-content">
              <strong>Add Food outside My Plan</strong>
              <small>
                log any food you eat, even it is not in
                your plan.
              </small>
            </span>

            <span className="nf-action-plus">+</span>
          </button>

          <button
            type="button"
            className="nf-action-card nf-search-card"
            onClick={openFoodSearch}
          >
            <span className="nf-action-main-icon">⌕</span>

            <span className="nf-action-content">
              <strong>Search Food details</strong>
              <small>
                Search for any food you want
                Know nutritional information.
              </small>
            </span>
          </button>
        </div>

        {/* Upload image input */}
        <input
          ref={uploadInput}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
        />
      </section>

      <section className="nf-important-advice">
        <h3>*important advices*</h3>

        <div className="nf-advice-columns">
          <div>
            <strong>Stay Hydrated</strong>
            <p>Drink enough water throughout your day.</p>
          </div>

          <div>
            <strong>Eat Balanced Meals</strong>
            <p>Include protein, vegetables and healthy carbs.</p>
          </div>
        </div>
      </section>

      {loggedFoods.length > 0 && (
        <section className="nf-logged-foods">
          <div className="nf-logged-heading">
            <h3>Added Foods</h3>

            <button
              type="button"
              onClick={() => setLoggedFoods([])}
            >
              Reset
            </button>
          </div>

          {loggedFoods.map((food, index) => (
            <div
              className="nf-logged-food"
              key={`${food.name}-${index}`}
            >
              <span>{food.name}</span>
              <strong>{food.calories} kcal</strong>
            </div>
          ))}
        </section>
      )}

      {/* Food search dialog */}
      {showSearch && (
        <div
          className="nf-dialog-backdrop"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="nf-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="nf-dialog-close"
              onClick={() => setShowSearch(false)}
            >
              ×
            </button>

            <h3>Add Food</h3>
            <p>Search for food to add it to your daily log.</p>

            <input
              className="nf-food-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food..."
              autoFocus
            />

            <div className="nf-food-results">
              {filteredFoods.map((food) => (
                <button
                  type="button"
                  key={food.name}
                  onClick={() => addFood(food)}
                >
                  <span>{food.name}</span>
                  <strong>{food.calories} kcal</strong>
                </button>
              ))}

              {filteredFoods.length === 0 && (
                <p>No food found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera dialog */}
      {showCamera && (
        <div
          className="nf-dialog-backdrop"
          onClick={closeCamera}
        >
          <div
            className="nf-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="nf-dialog-close"
              onClick={closeCamera}
            >
              ×
            </button>

            <h3>Take Photo</h3>

            {cameraError ? (
              <p>{cameraError}</p>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  display: "block",
                  width: "100%",
                  maxHeight: "55vh",
                  margin: "15px 0",
                  background: "#000",
                  borderRadius: "10px",
                  objectFit: "contain",
                }}
              />
            )}

            {!cameraError && (
              <button
                type="button"
                className="nf-dialog-primary"
                onClick={capturePhoto}
              >
                Capture Photo
              </button>
            )}

            <button
              type="button"
              className="nf-dialog-primary"
              style={{ marginTop: "10px" }}
              onClick={() => {
                closeCamera();
                uploadInput.current?.click();
              }}
            >
              Upload Image Instead
            </button>
          </div>
        </div>
      )}

      {/* AI Food Scanner dialog */}
      {showScanner && (
        <div
          className="nf-dialog-backdrop"
          onClick={() => setShowScanner(false)}
        >
          <div
            className="nf-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="nf-dialog-close"
              onClick={() => setShowScanner(false)}
            >
              ×
            </button>

            <h3>AI Food Scanner</h3>

            {selectedImage && (
              <img
                className="nf-scanned-image"
                src={selectedImage}
                alt="Selected food"
              />
            )}

            <p>
              Image uploaded successfully. Automatic food recognition
              is not connected yet.
            </p>

            <button
              type="button"
              className="nf-dialog-primary"
              onClick={() => setShowScanner(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
