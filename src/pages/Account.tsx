import SavedPodcasts from '../components/Saved Shows/SavedPodcasts';

/**
 * Image used as a background image for the account page.
 * Render the SavedPodcast component.
 */
function Account() {
    const accountImage = 'https://images.unsplash.com/photo-1631515998707-f54897e89a68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    return (
        <>
            <div className='w-full text-green-500'>
                <img className='absolute w-full h-full object-cover' src={accountImage} alt='/'/>
                <div className='bg-black/60 fixed top-0 left-0 w-full h-full'>
                    <div className='absolute top-[20%] p-4 md:p-8'></div>
                    <SavedPodcasts/>
                </div>

            </div>

        </>
    );
}

export default Account;