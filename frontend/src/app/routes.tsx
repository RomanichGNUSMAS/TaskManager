import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { Signin } from "../features/auth/signin";
import { Signup } from "../features/auth/signup";
import { MyProfile } from "../features/auth/settings/components/profile";
import { Dashboard } from "../features/dashboard/dashboard";
import { Settings } from "../features/auth/settings";
import { Tasks } from "../features/workManagement/tasks";
import { Projects } from "../features/workManagement/projects";
import { Calendar } from "../features/dashboard/calendar";
import { Progress } from "../features/dashboard/progress";
import { Appearance } from "../features/auth/settings/components/appearance";
import { Security } from "../features/auth/settings/components/security";

export const routes = createBrowserRouter([
    {
        path: 'auth/signin', 
        element: <Signin />
    },
    {
        path: 'auth/signup', 
        element: <Signup />
    },

    {
        path: '/', 
        element: <App />, 
        children: [
            {
                path: 'dashboard', element: <Dashboard />
            },
            {
                path: 'settings', element: <Settings />, children: [
                    {
                        path: 'profile', element: <MyProfile />
                    },
                    {
                        path: 'appearance', element: <Appearance />
                    },
                    {
                        path: 'security', element: <Security />
                    }
                ]
            },
            {
                path: 'tasks', element: <Tasks />
            },
            {
                path: 'projects', element: <Projects />
            },
            {
                path: 'calendar', element: <Calendar />
            },
            {
                path: 'progress', element: <Progress />
            }
        ]
    }
]);