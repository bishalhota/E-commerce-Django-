import { Link }    from "react-router-dom";
import { useCart } from "../context/CartContent.jsx";

function Navbar() {
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce((total,item) => total + item.quantity, 0);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
            <Link to='/' className="text-2xl font-bold text-gray-800">
                Shop
            </Link>

            <Link to="/cart" className="relative text-gray-800 hover:text-gray-600 font-medium">
                Cart
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </Link>
        </nav>
    )
}

export default Navbar;