import { createBrowserRouter } from "react-router-dom";
import { Signin } from "../pages/signin";
import { Signup } from "../pages/signup";
import { MyProfile } from "../pages/myprofile";
import { Home } from "../Home";
import { Dashboard } from "../pages/dashboard";
import { Settings } from "../pages/settings";
import { Tasks } from "../pages/tasks";
import { Projects } from "../pages/projects";
import { Calendar } from "../pages/calendar";
import { Progress } from "../pages/progress";


export const routes = createBrowserRouter([
    {
        path: '', element : <Home />,
        children: [
            {
                path: 'auth', children: [
                    { path: 'signin', element: <Signin /> },
                ]
            
            },{
                path : 'employee', element : <Signup />
            }
            , {
                path : 'me', element : <MyProfile />
            },
            {
                path : 'dashboard', element : <Dashboard />
            },
            {
                path : 'settings', element : <Settings />
            },
            {
                path : 'tasks', element : <Tasks />
            },
            {
                path : 'projects', element : <Projects />
            },
            {
                path : 'calendar', element : <Calendar />
            },
            {
                path : 'progress', element : <Progress />
            }
        ]
    }
])