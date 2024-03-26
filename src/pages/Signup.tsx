import {useState, FormEvent} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.tsx';
import signupFav from '/add-user.png';

/**
 * Functional component representing the signup form.
 * Defies local state variables using the useState hook, including email and password to manage form input.
 */
function Signup(): JSX.Element {

    const signUpLogo = 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    /**
     * Used to access authentication-related functionality, specifically the signUp function.
     */
    const { signUp } = useAuth();
    /**
     * Used to navigate to different routes within the application.
     */
    const navigate = useNavigate();
    
    /**
     * Handles form submission.
     * prevents the default form submission behavior.
     * Attempts to sign up the user using the signUp function from the useAuth hook.
     * Redirects the user to the home page ('/') upon successful signup.
     * If an error occurs during the signup process, it logs the error to the console.
     * @param {FormEvent<HTMLFormElement>} e - Form event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            await signUp(email, password);

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Signup form UI.
     * It includes input fields for email and password, a submit button, a link to the login page (/login), and a background image.
     * Input field changes (onChange event) are handled by updating the email and password states.
     * Form submission (onSubmit event) is handled by the handleSubmit function.
     */
    return (
        <div className='w-full h-screen'>
            <img className='hidden sm:block absolute w-full h-full object-cover ' src={signUpLogo} alt='signuplogo' />
            <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
            <div className='fixed w-full px-4 py-24 z-50'>
                <div className='max-w-[450px] h-[500px] mx-auto bg-black/75 text-yellow-400'>
                    <div className='max-w-[320px] mx-auto py-16'>
                        <h1 className='text-5xl mb-6 font-bold'>Sign Up</h1>
                        <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
                            <input onChange={(e) => setEmail(e.target.value)} className='p-3 my-2 bg-gray-600 rounded' type='email' placeholder='Email' autoComplete='email' />
                            <input onChange={(e) => setPassword(e.target.value)} className='p-3 my-2 bg-gray-600 rounded' type='password' placeholder='Password' autoComplete='current-password' />
                            <button className='bg-green-500 py-3 my-6 rounded font-bold text-amber-50 flex justify-center items-center'>
                                <img src={signupFav} alt='Sign Up' className='w-10 h-10'/>
                            </button>
                            <p className='py-8 text-amber-50'>
                                <span className='text-sm text-yellow-400'>Already Subscribed?</span>{' '}
                                <Link to='/login'>
                                    Log In!
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
