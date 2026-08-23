from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Category, Product, Cart, CartItem,Order,OrderItem
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, RegisterSerializer,UserSerializer


@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'id': user.id, 'username': user.username, 'email': user.email}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context = {'request':request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_cart(request):
    cart,created = Cart.objects.get_or_create(user=None)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=None)
    item, created = CartItem.objects.get_or_create(cart=cart,product=product)
    if not created:
        item.quantity += 1
        item.save()
    return Response({'message' : 'Product added to cart', "cart": CartSerializer(cart).data}) 


@api_view(['POST'])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required.'}, status=400)

    try:
        item = CartItem.objects.get(id=item_id)
        if int(quantity) < 1:
            item.delete()
            return Response({'error': 'Quantity must be at least 1.'}, status=400)

        item.quantity = quantity
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=404)


@api_view(['POST'])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message' : 'Product removed from cart'})


@api_view(['POST'])
def create_order(request):
    try:
        data = request.data

        name = data.get('name')
        address = data.get('address')
        email = data.get('email')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')

        cart = Cart.objects.first()

        if not cart or not cart.item.exists():
            return Response({'error':'Cart is empty'}, status=400)

        total = sum(float(item.product.price) * item.quantity for item in cart.item.all())

        #Create Order

        order = Order.objects.create(
            user = None,
            total_amount = total,
        )

        #Create Order Items
        for item in cart.item.all():
            OrderItem.objects.create(
                order = order,
                product = item.product,
                quantity = item.quantity,
                price = item.product.price,

            )

        cart.item.all().delete()

        return Response({
            "message":"Order placed sucessfully",
            "order_id": order.id,
        })  

    except Exception as e:
        return Response({"error": str(e)},status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message":"User created Successfully","user":UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

