document.addEventListener("DOMContentLoaded", function () {
    // Function to add product to cart
    function addToCart(event) {
        let button = event.target;
        let name = button.getAttribute("data-name");
        let price = button.getAttribute("data-price");
        let image = button.getAttribute("data-image");

        let product = { name, price, image };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${name} added to cart!`);
    }

    // Attach event listener to all "Add to Cart" buttons
    let addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", addToCart);
    });
});
