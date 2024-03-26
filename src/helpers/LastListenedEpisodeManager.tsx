// import { useEffect, useState } from 'react';
// import { useAudioPlayer } from '../services/AudioPlayerContext.tsx';
// import AudioPlayer from '../components/audio/AudioPlayer.tsx';
//
// /**
//  * Functional component, indicating that it returns a React element.
//  */
// const LastListenedEpisodeManager: React.FC = () => {
//     /**
//      * lastListenedUrl: Holds the URL of the last listened episode.
//      * Initialized as null because initially, there might not be any last listened episode.
//      * audioUrl: Hold the URL of the currently playing audio.
//      * This state is used to control the audio player.
//      */
//     const { showAudioPlayer, setShowAudioPlayer } = useAudioPlayer();
//     const [lastListenedUrl, setLastListenedUrl] = useState<string | null>(null);
//     const [audioUrl, setAudioUrl] = useState<string | null>(null);
//     const [lastListenedProgress, setLastListenedProgress] = useState<number | null>(null);
//
//     /**
//      * Used to retrieve the last listened episode URL from local storage when the component mounts.
//      * 'localStorage.getItem' is called to fetch the URL stored under the key 'last_listened_url'.
//      * If a URL is found, it's set in the state using 'setLastListenedUrl'.
//      * 'setShowAudioPlayer' is called to display the audio player, and 'audioUrl' is set to the last listened URL.
//      */
//     useEffect(() => {
//         const lastListenedUrl = localStorage.getItem('last_listened_url');
//         const lastListenedProgress = localStorage.getItem('last_playback_position')
//
//         console.log("Retrieved last listened episode:", lastListenedUrl);
//
//         if (lastListenedUrl) {
//             setLastListenedUrl(lastListenedUrl);
//             setShowAudioPlayer(true);
//                 setAudioUrl(lastListenedUrl);
//             setLastListenedProgress(lastListenedProgress ? parseFloat(lastListenedProgress) : null);
//         } else {
//             setShowAudioPlayer(false);
//         }
//     }, []);
//
//     /**
//      * Close the audio player when there's no URL or when it's manually closed.
//      */
//     const handleClose = () => {
//         setLastListenedUrl(null);
//         setShowAudioPlayer(false);
//         setLastListenedProgress(null);
//     };
//
//     /**
//      * Render the AudioPlayer component with the last listened episode URL.
//      */
//     return (
//         <>
//             {showAudioPlayer && lastListenedUrl &&  (
//                 <AudioPlayer audioUrl={lastListenedUrl} onClose={handleClose}
//                              userId={''} // Dummy value
//                              episodeId={0} // Dummy value
//                              showId={0} // Dummy value
//                              seasonId={0} // Dummy value
//                              episodeTitle="" // Dummy value
//                 />
//             )}
//         </>
//     );
// };
//
// export default LastListenedEpisodeManager;

import { useEffect, useState } from 'react';
import { useAudioPlayer } from '../services/AudioPlayerContext.tsx';
import AudioPlayer from '../components/audio/AudioPlayer.tsx';

const LastListenedEpisodeManager: React.FC = () => {
    const { showAudioPlayer, setShowAudioPlayer } = useAudioPlayer();
    const [lastListenedUrl, setLastListenedUrl] = useState<string | null>(null);
    //const [lastListenedProgress, setLastListenedProgress] = useState<number | null>(null);

    useEffect(() => {
        const lastListenedUrl = localStorage.getItem('last_listened_url');
        //const lastListenedProgress = localStorage.getItem('last_playback_position');

        if (lastListenedUrl) {
            setLastListenedUrl(lastListenedUrl);
            setShowAudioPlayer(true);
           // setLastListenedProgress(lastListenedProgress ? parseFloat(lastListenedProgress) : null);
        } else {
            setShowAudioPlayer(false);
        }
    }, []);

    const handleClose = () => {
        setLastListenedUrl(null);
        setShowAudioPlayer(false);
       // setLastListenedProgress(null);
    };

    return (
        <>
            {showAudioPlayer && lastListenedUrl && (
                <AudioPlayer audioUrl={lastListenedUrl} onClose={handleClose}
                             userId={''} // Dummy value
                                                 episodeId={0} // Dummy value
                                                 showId={0} // Dummy value
                                                 seasonId={0} // Dummy value
                                                 episodeTitle="" // Dummy value
                />
            )}
        </>
    );
};

export default LastListenedEpisodeManager;