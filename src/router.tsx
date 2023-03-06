import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import { routes } from "./route-path";
import Home from "./screens/Home";
import ItemSearch from "./screens/itemSearch/ItemSearch";
import KeywordAnalysis from "./screens/keyword/KeywordAnalysis";
import KeywordReview from "./screens/keyword/KeywordReview";
import Login from "./screens/login/Login";
import DailyMonitoring from "./screens/monitoring/DailyMonitoring";
import NotFound from "./screens/NotFound";
import SignUp from "./screens/login/SignUp";
import MyProfile from "./screens/profile/MyProfile";
import Manage from "./screens/admin/Manage";
import Categories from "./screens/admin/code/Categories";
import DetailInfoMonitoring from "./screens/monitoring/DetailInfoMonitoring";
import StoreKeywordMonitoring from "./screens/monitoring/StoreKeywordMonitoring";

const router = createBrowserRouter([
    {
        path:routes.home,
        element:<Root/>,
        children:[
            {
                path:"",
                element:<Home/>,
                children:[
                    {
                        path:routes.itemSearch,
                        element:<ItemSearch/>
                    },
                    {
                        path:routes.keywordAnalysis,
                        element:<KeywordAnalysis/>,
                    },
                    {
                        path:routes.keywordReview,
                        element:<KeywordReview/>
                    },
                    {
                        path:routes.dailyMonitoring,
                        element:<DailyMonitoring/>,
                    },
                    {
                        path:`${routes.dailyMonitoring}/:productNo`,
                        element:<DetailInfoMonitoring/>
                    },
                    {
                        path:routes.keywordMonitoring,
                        element:<StoreKeywordMonitoring/>
                    },
                    {
                        path:routes.profile,
                        element:<MyProfile/>
                    }
                ]
            },
            {
                path:routes.login,
                element:<Login/>
            },
            {
                path:routes.signUp,
                element:<SignUp/>
            },
            {
                path:routes.manage,
                element:<Manage/>,
                children:[
                    {
                        path:routes.categories,
                        element:<Categories/>
                    }
                ]
                
            }
        ],
        errorElement:<NotFound/>
    }
]);

export default router;