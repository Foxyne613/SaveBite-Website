
function startDemo() {
    window.location.href = "menu.html";
}

function selectFood(foodName) {
    localStorage.setItem("selectedFood", foodName);
    window.location.href = "portion.html";
}

let selectedPortion = "";

const foodPrices = {
    "Chicken Rice": {
        small: 12.00,
        regular: 14.00,
        large: 16.00
    },
    "Fried Noodles": {
        small: 9.00,
        regular: 10.00,
        large: 12.00
    },
    "Vegetable Rice": {
        small: 5.00,
        regular: 6.00,
        large: 8.00
    }
};

const currentFood = localStorage.getItem("selectedFood");

/* Update portion page */
if (document.getElementById("food-name")) {
    const prices = foodPrices[currentFood];

    if (prices) {
        document.getElementById("food-name").textContent = currentFood;

        document.getElementById("small-price").textContent =
            "RM " + prices.small.toFixed(2);

        document.getElementById("regular-price").textContent =
            "RM " + prices.regular.toFixed(2);

        document.getElementById("large-price").textContent =
            "RM " + prices.large.toFixed(2);

    } else {
        document.getElementById("food-name").textContent =
            "Please select a food first";

        document.getElementById("small-price").textContent = "-";
        document.getElementById("regular-price").textContent = "-";
        document.getElementById("large-price").textContent = "-";
    }
}

function choosePortion(portion) {
    selectedPortion = portion;

    document.getElementById("selection-message").textContent =
        "You selected: " + portion + " Portion";
}


function confirmPortion() {
    const suitableCheckbox = document.getElementById("suitable-confirm");

    if (!suitableCheckbox || !suitableCheckbox.checked) {
        alert("Please confirm that this portion suits your appetite.");
        return;
    }

    localStorage.setItem("suitablePortion", "yes");

    const prices = foodPrices[currentFood];

    if (!prices) {
        alert("Please select a food first!");
        return;
    }

    if (selectedPortion === "") {
        alert("Please choose a portion first!");
        return;
    }

    const price = prices[selectedPortion.toLowerCase()];

    localStorage.setItem("selectedFood", currentFood);
    localStorage.setItem("selectedPortion", selectedPortion);
    localStorage.setItem("selectedPrice", price);

    window.location.href = "order.html";
}

/* Display Order Information */

if (document.getElementById("order-food")) {

    const food = localStorage.getItem("selectedFood");
    const portion = localStorage.getItem("selectedPortion");
    const price = Number(localStorage.getItem("selectedPrice"));

    if (food && portion && Number.isFinite(price)) {

        document.getElementById("order-food").textContent = food;

        document.getElementById("order-portion").textContent =
            portion + " Portion";

        document.getElementById("order-price").textContent =
            "RM " + price.toFixed(2);

        document.getElementById("order-total").textContent =
            "RM " + price.toFixed(2);

    } else {

        document.getElementById("order-food").textContent =
            "No order found";

        document.getElementById("order-portion").textContent = "-";
        document.getElementById("order-price").textContent = "-";
        document.getElementById("order-total").textContent = "-";
    }
}

/* Place Order */
function placeOrder() {
    const food = localStorage.getItem("selectedFood");
    const portion = localStorage.getItem("selectedPortion");
    const price = localStorage.getItem("selectedPrice");

    if (!food || !portion || price === null ||
        !Number.isFinite(Number(price))) {
        alert("Please select your food and portion first!");
        return;
    }

    localStorage.setItem("orderStatus", "Confirmed");
    localStorage.removeItem("photoSubmitted");

    window.location.href = "photo.html";
}


/* Photo Preview */
function previewPhoto(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById("plate-preview").src = e.target.result;
        document.getElementById("plate-preview").style.display = "block";
        document.getElementById("photo-placeholder").style.display = "none";
    };

    reader.readAsDataURL(file);

    document.getElementById("photo-message").textContent = "";
}


/* Submit Plate Photo */
function submitPhoto() {
    const photoInput = document.getElementById("plate-photo");

    if (!photoInput.files || photoInput.files.length === 0) {
        alert("Please upload your plate photo first!");
        return;
    }

    localStorage.setItem("photoSubmitted", "yes");

    document.getElementById("photo-message").textContent =
        "Photo submitted successfully! Waiting for verification.";

    document.getElementById("verify-button").style.display =
        "inline-block";
}

/* Simulate Photo Verification */
function verifyPhoto() {
    if (localStorage.getItem("photoSubmitted") !== "yes") {
        alert("Please submit your photo first!");
        return;
    }

    localStorage.setItem("photoApproved", "yes");
    if (localStorage.getItem("suitablePortion") === "yes") {
        addPoints(5, "suitable");
        localStorage.removeItem("suitablePortion");
    }

    document.getElementById("photo-message").textContent =
        "Photo approved! You have passed the verification.";

    document.getElementById("verify-button").style.display =
        "none";

    setTimeout(function() {
        window.location.href = "points.html";
    }, 1500);
}

/* SaveBite Points System */

// Get today's date
function getToday() {
    return new Date().toLocaleDateString("en-CA");
}

// Get current points
function getPoints() {
    const savedDate = localStorage.getItem("pointsDate");
    const today = getToday();

    if (savedDate !== today) {
        localStorage.setItem("pointsDate", today);
        localStorage.setItem("dailyPoints", "0");
    }

    return Number(localStorage.getItem("dailyPoints")) || 0;
}

// Add points
function addPoints(amount, rewardType) {
    let points = getPoints();

    const rewardKey = "reward_" + rewardType;
    const today = getToday();

    // Prevent the same reward from being claimed twice
    if (localStorage.getItem(rewardKey) === today) {
        return;
    }

    // Daily maximum: 15 points
    if (points + amount > 15) {
        amount = 15 - points;
    }

    if (amount <= 0) {
        return;
    }

    points += amount;

    localStorage.setItem("dailyPoints", points);
    localStorage.setItem(rewardKey, today);

    updatePointsDisplay();
}

// Update points page
function updatePointsDisplay() {
    const pointsElement = document.getElementById("points-total");

    if (pointsElement) {
        pointsElement.textContent = getPoints() + " Points";

        const today = getToday();

        document.getElementById("suitable-points").textContent =
            localStorage.getItem("reward_suitable") === today
            ? "5 Points" : "0 Points";

        document.getElementById("photo-points").textContent =
            localStorage.getItem("reward_photo") === today
            ? "5 Points" : "0 Points";

        document.getElementById("discount-points").textContent =
            localStorage.getItem("reward_discount") === today
            ? "5 Points" : "0 Points";
    }
}

updatePointsDisplay();

function buyDiscountedFood(foodName, price) {
    const today = getToday();

    if (localStorage.getItem("discountFoodPurchased") === today) {
        document.getElementById("deal-message").textContent =
            "You have already purchased today's discounted food.";
        return;
    }

    const confirmed = confirm(
        "Buy " + foodName + " for RM " + price.toFixed(2) + "?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.setItem("discountFoodPurchased", today);
    localStorage.setItem("discountFoodName", foodName);
    localStorage.setItem("discountFoodPrice", price);

    addPoints(5, "discount");

    document.getElementById("deal-message").textContent =
        "Purchase successful! You have received 5 points.";
}
function updatePurchaseHistory() {
    const nameElement = document.getElementById("purchase-name");
    const priceElement = document.getElementById("purchase-price");

    if (!nameElement || !priceElement) {
        return;
    }

    const foodName = localStorage.getItem("discountFoodName");
    const foodPrice = localStorage.getItem("discountFoodPrice");

    if (foodName && foodPrice) {
        nameElement.textContent = foodName;
        priceElement.textContent = "Paid: RM " +
            Number(foodPrice).toFixed(2);
    }
}

updatePurchaseHistory();