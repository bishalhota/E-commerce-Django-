import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContent.jsx";

function CheckoutPage() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const [form,setForm] = useState({
        name:"",
        address:"",
        phone:"",
        payment_method: "COD"
    })

    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState(null);

    const handleChange = (e) =>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try{
            const res = await fetch(`${BASE_URL}/api/orders/create/`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            });
            
            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await res.json()
                : { error: `Server returned HTTP ${res.status}` };

            if(res.ok){
                setMessage("Order placed successfully!");
                await fetch(`${BASE_URL}/api/cart/`);
                clearCart();
                setTimeout(()=>{
                    navigate('/');
                },2000)
            }else{
                setMessage(data.error || "Failed to place order");
            }
        }catch(error){
            console.error("Error placing order:", error);
            setMessage("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text"
                        name="name"
                        placeholdder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <textarea 
                        name="address"
                        placeholdder="Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input 
                        type="tel"
                        name="phone"
                        placeholdder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <select 
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="online">Online Payment</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                    {message && (
                        <p className="text-center text-green-700 font-semibold mt-4">{message}</p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default CheckoutPage;