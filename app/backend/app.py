import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random
from datetime import datetime

# FastAPI Application
app = FastAPI()

# Data Models
class AdRequest(BaseModel):
    """Request model for ad delivery endpoint."""
    user_id: Optional[str] = None
    device_info: Optional[Dict[str, Any]] = None
    context: Optional[str] = None


class GameChallengeRequest(BaseModel):
    """Request model for game challenge interactions."""
    user_id: str
    product_id: Optional[str] = None
    challenge_type: str  # "spin" or "choice"


class CartItem(BaseModel):
    """Model for items in cart."""
    product_id: str
    quantity: int = 1


class CartUpdateRequest(BaseModel):
    """Request model for cart updates."""
    user_id: str
    items: List[CartItem]
    rewards: Optional[List[Dict[str, Any]]] = None


# Mock Database
PRODUCTS = [
    {
        "id": "1",
        "imageUrl": "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        "title": "Official NFL Team Jersey - Premium Quality",
        "price": "$99.99",
        "originalPrice": "$129.99",
        "discount": "23%",
        "rating": 4.5,
        "reviewCount": 8567,
        "prime": True,
        "sustainabilityScore": 85,
        "carbonFootprint": 12.5
    },
    # More products can be added here
]

# In-memory carts & rewards storage
USER_CARTS: Dict[str, List[Dict[str, Any]]] = {}
USER_REWARDS: Dict[str, List[Dict[str, Any]]] = {}


# Helper Functions
def get_product_by_id(product_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve product details by its ID.
    """
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


def chain_of_thought_model_decision(request: AdRequest) -> Dict[str, Any]:
    """
    Decide which AI model to use based on user data and estimate carbon usage.
    In production, you might log or store the chain-of-thought but not return it.
    """
    chain_of_thought = []
    chain_of_thought.append("Analyzing request details for best model choice...")

    user_id = request.user_id
    device_type = (request.device_info or {}).get("device_type", "unknown").lower()
    context_length = len(request.context or "")

    # Simple logic for model selection
    if user_id and context_length > 50:
        selected_model = "large_nlp_model"
        chain_of_thought.append(
            f"User '{user_id}' + lengthy context => picking LARGE model."
        )
    else:
        selected_model = "small_nlp_model"
        chain_of_thought.append("Context short or user anonymous => SMALL model.")

    # Estimate carbon footprint (illustrative)
    if selected_model == "large_nlp_model":
        co2_usage_grams = round(random.uniform(2.0, 4.0), 2)
    else:
        co2_usage_grams = round(random.uniform(0.5, 1.0), 2)
    chain_of_thought.append(
        f"Estimated carbon usage for {selected_model} => ~{co2_usage_grams} g CO₂e."
    )

    chain_of_thought_str = " | ".join(chain_of_thought)

    return {
        "selected_model": selected_model,
        "co2_estimate": co2_usage_grams,
        "chain_of_thought": chain_of_thought_str,  # Not recommended to return directly to the user.
    }


def generate_ad_text(model_name: str, context: Optional[str]) -> Dict[str, str]:
    """
    Stub function that simulates generating ad text.
    Replace with your real AI model call or pipeline.
    """
    title = "AI-Generated Ad"
    if context:
        content = (
            f"Using {model_name}, here's some ad text tailored to your context: '{context}'"
        )
    else:
        content = "Generic ad text goes here."
    return {"title": title, "content": content}


# API Endpoints
@app.get("/")
def read_root():
    """
    Basic health check route.
    """
    return {
        "message": "Server is running",
        "status": "healthy",
        "time": datetime.now().isoformat()
    }


@app.post("/deliver-ad")
def deliver_ad(request: AdRequest):
    """
    Main endpoint for delivering an ad with a sustainability focus.
    Showcases chain-of-thought logic for picking a model (in real life, keep it private).
    """
    decision_data = chain_of_thought_model_decision(request)

    # Summarized or hidden chain-of-thought
    user_friendly_reasoning = "We analyzed your request to pick the best AI model."
    model = decision_data["selected_model"]
    ad_content = generate_ad_text(model, request.context)

    return {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "chosen_model": model,
        "estimated_co2": f"{decision_data['co2_estimate']} g CO₂e",
        "reasoning_summary": user_friendly_reasoning,
        # If you wanted to expose the full chain-of-thought (not recommended), uncomment:
        # "chain_of_thought": decision_data["chain_of_thought"],
        "ad": ad_content,
    }


@app.get("/products")
def get_products(category: Optional[str] = None, sustainable_only: bool = False):
    """
    Return a list of products, optionally filtered by category or sustainability.
    """
    filtered_products = PRODUCTS

    if category:
        filtered_products = [
            p for p in filtered_products
            if category.lower() in p["title"].lower()
        ]

    if sustainable_only:
        filtered_products = [
            p for p in filtered_products
            if p.get("sustainabilityScore", 0) > 70
        ]

    if not filtered_products:
        return {
            "products": [],
            "sustainability_stats": {
                "average_footprint": "N/A",
                "eco_friendly_count": 0
            }
        }

    avg_footprint = sum(
        p.get("carbonFootprint", 15) for p in filtered_products
    ) / len(filtered_products)

    eco_friendly_count = len([
        p for p in filtered_products
        if p.get("sustainabilityScore", 0) > 70
    ])

    return {
        "products": filtered_products,
        "sustainability_stats": {
            "average_footprint": f"{avg_footprint:.2f} kg CO2e",
            "eco_friendly_count": eco_friendly_count
        }
    }


@app.get("/products/{product_id}")
def get_product(product_id: str):
    """
    Return details for a specific product, including a sustainability info block.
    """
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    sustainability_score = product.get("sustainabilityScore", 50)
    carbon_fp = product.get("carbonFootprint", 15)

    product["sustainability_info"] = {
        "score": sustainability_score,
        "rating": "Excellent" if sustainability_score > 85
        else "Good" if sustainability_score > 70
        else "Average" if sustainability_score > 50
        else "Below Average",
        "made_from_recycled": sustainability_score > 75,
        "carbon_footprint": f"{carbon_fp:.1f} kg CO2e",
        "water_usage": f"{random.randint(50, 200)} liters",
        "environmentally_certified": sustainability_score > 80,
    }

    return product


@app.post("/game-challenge")
def play_game_challenge(request: GameChallengeRequest):
    """
    Process a game challenge and generate sustainable rewards for the user.
    This is a fun gamification route that encourages eco-friendly purchases.
    """
    user_id = request.user_id

    # Determine reward percentage (5-30%)
    reward_percent = random.randint(5, 30)

    # Default product if none provided
    product_id = request.product_id if request.product_id else "1"

    if user_id not in USER_REWARDS:
        USER_REWARDS[user_id] = []

    USER_REWARDS[user_id].append({
        "product_id": product_id,
        "discount_percent": reward_percent,
        "created_at": datetime.now().isoformat(),
        "expires_at": None,
    })

    # Simulate carbon impact in awarding a reward
    carbon_impact = random.uniform(0.5, 2.0)  # in kg CO2e

    return {
        "success": True,
        "reward": {
            "product_id": product_id,
            "discount_percent": reward_percent,
            "message": f"You've earned a {reward_percent}% discount!",
        },
        "sustainability_impact": {
            "carbon_saved": f"{carbon_impact:.2f} kg CO2e",
            "equivalent_to": f"{(carbon_impact*2.5):.1f} miles not driven by car",
            "total_user_impact": f"{len(USER_REWARDS[user_id]) * 1.5:.1f} kg CO2e saved through game participation"
        }
    }


@app.get("/cart/{user_id}")
def get_cart(user_id: str):
    """
    Retrieve the user's cart, including cost totals and sustainability metrics.
    """
    if user_id not in USER_CARTS:
        return {
            "items": [],
            "total": "$0.00",
            "sustainability_impact": {"score": 0}
        }

    cart = USER_CARTS[user_id]
    rewards = USER_REWARDS.get(user_id, [])
    cart_items = []

    subtotal = 0.0
    total_discount = 0.0
    total_carbon = 0.0

    for item in cart:
        product = get_product_by_id(item["product_id"])
        if not product:
            continue

        price = float(product["price"].replace("$", ""))
        item_total = price * item["quantity"]
        subtotal += item_total

        # Carbon footprint
        carbon_footprint = product.get("carbonFootprint", 15) * item["quantity"]
        total_carbon += carbon_footprint

        # Check for any discount from rewards
        discount_percent = 0
        for reward in rewards:
            if reward["product_id"] == item["product_id"]:
                discount_percent = reward["discount_percent"]
                break

        discount_amount = item_total * (discount_percent / 100)
        total_discount += discount_amount

        cart_items.append({
            **product,
            "quantity": item["quantity"],
            "discount_percent": discount_percent,
            "discount_amount": f"${discount_amount:.2f}",
            "final_price": f"${(item_total - discount_amount):.2f}"
        })

    avg_sustainability = 0
    if cart_items:
        avg_sustainability = sum(
            i.get("sustainabilityScore", 50) for i in cart_items
        ) / len(cart_items)

    return {
        "items": cart_items,
        "summary": {
            "subtotal": f"${subtotal:.2f}",
            "discount": f"${total_discount:.2f}",
            "total": f"${(subtotal - total_discount):.2f}",
            "items_count": len(cart_items)
        },
        "sustainability_impact": {
            "score": round(avg_sustainability),
            "carbon_footprint": f"{total_carbon:.2f} kg CO2e",
            "comparison": "25% better than average NFL merchandise purchase",
            "eco_friendly_items": len([
                i for i in cart_items
                if i.get("sustainabilityScore", 0) > 70
            ]),
            "environmental_message": (
                "Your purchase helps support sustainable manufacturing practices."
            )
        }
    }


@app.post("/cart/update")
def update_cart(request: CartUpdateRequest):
    """
    Update the user's cart with new items, and optionally apply any rewards.
    """
    user_id = request.user_id

    # Convert request items into a list of dicts
    USER_CARTS[user_id] = [item.dict() for item in request.items]

    sustainable_items = 0
    total_items = len(request.items)

    for item in request.items:
        product = get_product_by_id(item.product_id)
        if product and product.get("sustainabilityScore", 0) > 70:
            sustainable_items += 1

    sustainability_percentage = (
        (sustainable_items / total_items) * 100
    ) if total_items > 0 else 0

    return {
        "success": True,
        "cart_size": total_items,
        "sustainability_metrics": {
            "eco_friendly_percentage": f"{sustainability_percentage:.1f}%",
            "message": (
                "Great choice! Your cart contains sustainable NFL merchandise."
                if sustainability_percentage > 50
                else "Consider adding more eco-friendly items to your cart."
            ),
        }
    }


# Main: Uvicorn entry point
if __name__ == "__main__":
    # In production, consider using gunicorn with Uvicorn workers, e.g.:
    # gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)