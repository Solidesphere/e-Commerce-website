import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextCart } from "./context/ContextCart";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";

import { Provider } from "react-redux";
import store from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ContextCart>
            <Header />
            <main className="py-3">
              <Container>
                <Routes>
                  <Route path="/order/:id" element={<OrderScreen />} />
                  <Route path="/placeorder" element={<PlaceOrderScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/Shipping" element={<ShippingScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route path="/product/:id" element={<ProductScreen />} />
                  <Route path="/cart/:id?" element={<CartScreen />} />
                  <Route path="/admin/userlist" element={<UserListScreen />} />
                  <Route
                    path="/admin/productlist"
                    element={<ProductListScreen />}
                  />
                  <Route
                    path="/admin/productlist/:page"
                    element={<ProductListScreen />}
                  />
                  <Route
                    path="/admin/user/:id/edit"
                    element={<UserEditScreen />}
                  />
                  <Route
                    path="/admin/product/:id/edit"
                    element={<ProductEditScreen />}
                  />
                  <Route
                    path="/admin/orderlist"
                    element={<OrderListScreen />}
                  />
                  <Route
                    path="/order/admin/:id"
                    element={<OrderDetailsScreen />}
                  />
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/search/:keyword" element={<HomeScreen />} />
                  <Route
                    path="/search/:keyword/page/:page"
                    element={<HomeScreen />}
                  />
                  <Route path="/page/:page" element={<HomeScreen />} />
                </Routes>
              </Container>
            </main>
            <Footer />
          </ContextCart>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
