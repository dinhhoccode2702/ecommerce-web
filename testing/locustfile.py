from locust import HttpUser, task, between
import random

CATEGORIES = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"]

class ShoppingUser(HttpUser):
    """
    User đã đăng nhập - test tất cả endpoints
    Sử dụng account có sẵn trong DB
    """
    host = "http://localhost:5000"
    wait_time = between(1, 3)
    
    def on_start(self):
        """Login với account có sẵn"""
        self.logged_in = False
        
        # Dùng account có sẵn trong DB
        response = self.client.post(
            "/api/auth/login",
            json={
                "email": "test@test.com",
                "password": "123456"
            },
            name="POST /auth/login"
        )
        
        if response.status_code == 200:
            self.logged_in = True

    # ================= PUBLIC ENDPOINTS =================
    
    @task(10)
    def view_featured_products(self):
        self.client.get("/api/products/featured", name="GET /products/featured")

    @task(8)
    def view_category(self):
        category = random.choice(CATEGORIES)
        self.client.get(
            f"/api/products/category/{category}",
            name="GET /products/category"
        )

    @task(5)
    def view_recommendations(self):
        self.client.get("/api/products/recommendations", name="GET /products/recommendations")

    # ================= PROTECTED ENDPOINTS =================
    
    @task(6)
    def view_cart(self):
        if not self.logged_in:
            return
        self.client.get("/api/cart", name="GET /cart")

    @task(3)
    def get_coupon(self):
        if not self.logged_in:
            return
        self.client.get("/api/coupons", name="GET /coupons")

    @task(2)
    def check_profile(self):
        if not self.logged_in:
            return
        self.client.get("/api/auth/profile", name="GET /auth/profile")


class BrowsingUser(HttpUser):
    """
    User chỉ browse - test public endpoints
    """
    host = "http://localhost:5000"
    wait_time = between(0.5, 2)
    weight = 3
    
    @task(10)
    def view_featured(self):
        self.client.get("/api/products/featured", name="GET /products/featured")
    
    @task(8)
    def view_category(self):
        category = random.choice(CATEGORIES)
        self.client.get(
            f"/api/products/category/{category}",
            name="GET /products/category"
        )
    
    @task(5)
    def view_recommendations(self):
        self.client.get("/api/products/recommendations", name="GET /products/recommendations")

