import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import Message from "../components/Message";
import CheckEmailPage from "../pages/CheckEmailPage";
import AuthLayout from "../layout";
import ForgotPassword from "../pages/ForgotPasswordPage";



const router = createBrowserRouter([
{
    path:"/",
    element:<App/>,
    children:[
        {
            path:"register",
            element:<AuthLayout><RegisterPage/></AuthLayout>
        },
        {
            path:"email",
            element:<AuthLayout><CheckEmailPage/></AuthLayout>
        },
        {
            path:"password",
            element:<AuthLayout><CheckPasswordPage/></AuthLayout>
        },
        {
            path:"forgot-password",
            element:<AuthLayout><ForgotPassword/></AuthLayout>
        },
        {
            path:"",
            element:<Home/>,
            children:[
                {
                    path:':userId',
                    element: <Message/>
                }
            ]
        }
    ]
}
])

export default router;