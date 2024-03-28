import Favorites from '../components/Saved Shows/Favorites.tsx';

/**
 * Render the SavedPodcast component.
 */
function Account() {

    return (
        <>
            <div className='w-full'>
                <div className='fixed top-0 left-0 w-full h-full'>
                    <div className='absolute top-[20%] p-4 md:p-8'></div>
                    <Favorites/>
                </div>
            </div>
        </>
    );
}

export default Account;