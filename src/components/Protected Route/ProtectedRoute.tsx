import {Navigate} from 'react-router-dom';
import { useAuth } from "../../services/AuthContext.tsx";
import React from "react";

interface ProtectedRouteProps {
    children: () => JSX.Element | null;
}
/**
 * Functional component representing a protected route that redirects to the home page if the user is not authenticated.
 * Destructures the children prop, which represents the child components to be rendered within the protected route.
 * Uses the useAuth hook to get the current user information.
 * If there is no user (!user), it returns a Navigate component to redirect the user to the home page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {

    const {user} = useAuth()

    if (!user){
        return <Navigate to='/' />
    } else {
        return children() || null;
    }
}

export default ProtectedRoute;