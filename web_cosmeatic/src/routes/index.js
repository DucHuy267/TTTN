
import SignupPage from "../components/Login-SignUp/SignupPage";
import LoginAdminPage from "../pages/AdminPage/LoginAdmin/LoginAdminPage";
import Page from "../pages/AdminPage/Page";
import Brand from "../pages/BrandPage/Brand";
import Cocoon from "../pages/BrandPage/brand-title";
import CartPage from "../pages/CartPage/CartPage";
import HomePage from "../pages/HomePage/HomePage";
import LearnMore from "../pages/HomePage/SkincareLearnMore";
import HotSelling from "../pages/HotSellingPage.jsx/HotSelling";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CreateOrder from "../pages/Order/CreateOrder";
import ProductDetailsPage from "../pages/ProductDetaislPage/ProductDetaislPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";

export const routes = [
    // {
    //     path: '/chat',
    //     page: Chatbot,
    //     showHeader: true
    // },
    {
        path: '/admin',
        page: Page,
        showHeader: false
    },
    {
        path: '/',
        page: HomePage,
        showHeader: true
    },
    {
        path: '/learnmore',
        page: LearnMore,
        showHeader: true
    },
    {
        path: '/login',
        page: LoginAdminPage,
        showHeader: false
    },
    {
        path: '/signup',
        page: SignupPage,
        showHeader: false
    },
    {
        path: '/products/:_id',
        page: ProductDetailsPage,
        showHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        showHeader: true
    },
    {
        path: '/hotselling',
        page: HotSelling,
        showHeader: true
    },
    {
        path: '/cart',
        page: CartPage,
        showHeader: true
    },
    {
        path: '/brands',
        page: Brand,
        showHeader: true
    },
    {
        path: '/order',
        page: CreateOrder,
        showHeader: true
    },
    {
        path: '/profile',
        page: ProfilePage,
        showHeader: true
    },
    {
        path: '/brands/:id',
        page:Cocoon ,
        showHeader: true
    },
    {
        path: '*',
        page: NotFoundPage,
        showHeader: false
    }
];
