import {useEffect, useState} from 'react';
import {Link, useNavigate,} from 'react-router-dom';
import {useAuth} from "../../services/AuthContext.tsx";
import homeLogo from "/home.png";
import settingLogo from "/setting.png";
import accountFav from "/account.png";
import loginFav from "/log-in.png";
import logoutFav from "/logout.png";
import addUserFav from "/add-user.png";

/**
 * Functional component representing the navigation bar.
 */
function Navbar(): JSX.Element {

    /**
     * 'user' and 'logOut' are obtained from the useAuth hook, which provides authentication data and functions.
     * 'navigate' is obtained from useNavigate, allowing programmatic navigation.
     * 'isLoggedIn' is a state variable managed by the useState hook, initially set to false.
     */
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /**
     * Check if user is logged in.
     * Updates the 'isLoggedIn' state whenever the user object changes.
     * Effect runs whenever user changes.
     */
    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    /**
     * Handles logout functionality.
     * Calls the logOut function provided by the useAuth hook.
     * Navigates the user to the home page.
     * Updates the isLoggedIn state to false.
     */
    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
            setIsLoggedIn(false);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Navbar component.
     * Contains navigation links and icons.
     */
    return (
        <div className="flex items-center justify-between p-1 z-[80] w-full absolute brightness-20 bg-gray-600 rounded">
            <Link to="/">
                    <div className='flex '>
                        <img src={homeLogo} alt="home" className='w-12 h-12 ml-5' title='Home'/>
                    </div>
            </Link>
            <ul className="flex gap-1 justify-center mr-3 mt-1">
                <li className='p-2'>
                    <Link to="/filter" >
                        <img src={settingLogo} alt="filter" className='w-12 h-12' title='Filter Search'/>
                    </Link>
                </li>
                <li className='p-2'>
                    {isLoggedIn ? (
                        <Link to="/account" >
                            <img src={accountFav} alt="account" className='w-12 h-12' title='Account'/>
                        </Link>
                    ) : (
                        <Link to="/login" >
                            <img src={loginFav} alt="login" className='w-12 h-12' title='Log In'/>
                        </Link>
                    )}
                </li>
                <li className='p-2'>
                    {isLoggedIn ? (
                        <button onClick={handleLogout}>
                            <img src={logoutFav} alt="logout" className='w-12 h-12' title='Log Out'/>
                        </button>
                    ) : (
                        <Link to="/signup" >
                            <img src={addUserFav} alt="signup" className='w-12 h-12' title='Sign Up'/>
                        </Link>
                    )}
                </li>
            </ul>
        </div>
    );
}

export default Navbar;

