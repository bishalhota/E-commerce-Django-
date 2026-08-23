import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { useCart } from "../context/CartContent.jsx";

function ProductDetails() {
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [ product,setProduct ] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError ] = useState(null);
    const { addToCart } = useCart();

    useEffect(() =>{
        fetch(`${BASE_URL}/api/products/${id}`)
            .then((response) =>{
                if(!response.ok){
                    throw new Error('Failed to fetch product details');
                }

                return response.json()
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            })
    },[id, BASE_URL]);

    if(loading){
        return <p>Loading...</p>
    }

    if(error){
        return <p>{error}</p>
    }

    if(!product) {
        return <p>Product not found</p>
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    <img 
                        src={`${product.image}`}
                        alt={product.name}
                        className="w-full md:w-1/2 h-auto object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <p className="text-xl text-gray-600 font-semibold mb-4">{product.description}</p>
                        <p className="text-gray-700 leading-relaxed">{product.price}</p>
                        <button onClick={() => addToCart(product.id)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Add to Cart</button>
                        <div className="mt-4">
                            <a 
                                href="/"
                                className="text-blue-600 hover:underline"
                            >
                                &larr; Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails;





















































// import {Link} from 'react-router-dom'

// function ProductDetails({product}){
//     const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

//     return(
//         <Link to={`/product/${product.id}`} className='bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer'>
//             <img 
//                 src = {`${BASE_URL}${product.image}`}
//                 alt = {product.name}
//                 className = "w-full h-56 object-cover rounded-lg mb-4"
//                 />
//             <h2 className='text-lg font-semibold text-gray-800 truncate'>{product.name}</h2>
//             <p className='text-gray-600 font-medium'>${product.price}</p> 
//             <p className='text-gray-500 mt-2'>{product.description}</p>

//         </Link>
//     )
// }