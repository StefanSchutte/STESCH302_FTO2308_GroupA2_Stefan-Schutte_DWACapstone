import React, {useEffect, useRef, useState} from 'react';
import closeBtnFav from '/close.png';
import completedFav from'/checklist.png'
import incompletedFav from '/incomplete.png'
import removeFav from "/remove.png";
import {useAudioPlayer} from "../../services/AudioPlayerContext.tsx";
import seeMoreFav from "/seeMore.png";

interface AudioPlayerProps {
    audioUrl: string;
    onClose: () => void;
    userId: string;
    episodeId: number;
    showId: number;
    seasonId: number;
    episodeTitle: string;
}

/**
 * Functional component representing an audio player.
 * Receives props defined by the AudioPlayerProps interface.
 * Props provide information for the audio player to function, such as the URL of the audio file, user and episode IDs, and episode progress.
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({
         audioUrl,
         onClose,
         episodeId,
         seasonId,
         showId,
         userId,
        episodeTitle,
    }) => {
    /**
     * Uses the useState hook to manage state internally.
     * Maintains states for progress, representing the current playback progress of the audio.
     * 'isEpisodeCompleted' indicating whether the episode is marked as completed.
     */
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [isEpisodeCompleted, setIsEpisodeCompleted] = useState(false);
    const { setShowAudioPlayer } = useAudioPlayer();

    /**
     * Uses the 'useRef' hook to create a reference (audioRef) to the <audio> element.
     * Used to interact with the audio element, such as controlling playback or accessing its properties.
     */
    // useEffect(() => {
    //     if (audioRef.current && typeof episodeProgress === 'number' && isFinite(episodeProgress)) {
    //         audioRef.current.currentTime = episodeProgress;
    //     }
    // }, [episodeProgress]);

    /**
     * Sets up effects to synchronize the audio playback progress with the stored progress in local storage.
     * Runs when any of the dependencies [episodeId, seasonId, showId, userId] change.
     * Retrieves the stored progress for the current episode from local storage using a key constructed from the provided IDs.
     * Stored progress parsed into a floating-point number and sets the progress state to this value.
     * Sets its 'currentTime' property to the parsed progress value.
     * Ensures that if the user returns to the episode, the audio playback resumes from where they left off.
     * Calls storeLastListenedEpisode(), which updates the local storage to remember the last listened episode's URL.
     * Retrieves the stored completion status of the current episode from local storage.
     * If the completion status is 'true', it sets the isEpisodeCompleted state to true, indicating that the episode has been completed.
     */
    useEffect(() => {

        const storedProgress = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_progress`);
        if (storedProgress) {
            const parsedProgress = parseFloat(storedProgress);
            setProgress(parsedProgress);
            if (audioRef.current) {
                audioRef.current.currentTime = parsedProgress;
            }
        }


        const storedCompletionStatus = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_completed`);
        if (storedCompletionStatus === 'true') {
            setIsEpisodeCompleted(true);
        }
        storeLastListenedEpisode(audioUrl, progress);
    }, [episodeId, seasonId, showId, userId]);

    /**
     * Mark the current episode as completed.
     * Sets the isEpisodeCompleted state to true, indicating that the episode has been completed.
     * Stores the completion status of the episode in local storage.
     */
    const markEpisodeCompleted = () => {
        setIsEpisodeCompleted(true);
        localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_completed`, 'true');
    };

    /**
     * Manage the visibility of the audio player component within the application.
     * Triggered when the user attempts to close the audio player.
     * Confirmation prompt, asking if they are sure they want to close the audio player.
     * Handles closing the audio player component or updating its visibility.
     * Sets 'showAudioPlayer' state to false using the 'setShowAudioPlayer 'function obtained from the useAudioPlayer hook.
     */
    const handleClose = () => {
        const confirmPrompt = window.confirm('Are you sure you want to close the Audio Player?');
        if (confirmPrompt) {
            onClose();
            setShowAudioPlayer(false)
        }
    };

    /**
     * Called when the audio playback ends.
     * Sets the 'isEpisodeCompleted' state to true, indicating that the current episode has been completed.
     * Stores this completion status in the browser's local storage, associating it with the current episode ID.
     * Allows the application to remember the completion status of the episode even if the user navigates away from the page.
     */
    const handleEpisodeCompletion = async () => {
        setIsEpisodeCompleted(true);
        localStorage.setItem(`episode_${episodeId}_completed`, 'true');
    };

    /**
     * Event handler for the 'onEnded' event of the <audio> element.
     * Calls 'handleEpisodeCompletion' to mark the episode as completed and 'markEpisodeCompleted' to update the episode's completion status.
     */
    const handleAudioEnded = () => {
        handleEpisodeCompletion();
        markEpisodeCompleted();

    };

    /**
     * Runs once when the component mounts.
     * Retrieves the completion status of the current episode from local storage.
     * If the completion status is 'true', it sets the isEpisodeCompleted state to true.
     * Ensures that the completion status is reflected in the component's state.
     *
     */
    useEffect(() => {
        const storedCompletionStatus = localStorage.getItem(`episode_${episodeId}_completed`);
        if (storedCompletionStatus === 'true') {
            setIsEpisodeCompleted(true);
        }
    }, []);

    /**
     * Triggered when the user wants to clear all data stored in the local storage.
     * Clears all data stored in the local storage by calling 'localStorage.clear()'.
     * Reloads the window to reflect the changes caused by clearing the storage.
     */
    const handleClearLocalStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    /**
     * Called when the <audio> element emits the onTimeUpdate event, indicating that the playback progress has changed.
     * Updates the progress state with the current playback time obtained from the <audio> element.
     * Stores the current playback time in the local storage, associating it with the current user, show, season, and episode IDs.
     * Allows the application to remember the playback progress of the episode even if the user navigates away from the page.
     */
    const handleProgressUpdate = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            setProgress(currentTime);
            localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_progress`, currentTime.toString());
        }
    };

    /**
     * Function to store the last listened show and episode in localStorage.
     */
    const storeLastListenedEpisode = (audioUrl: string, progress: number) => {
        if (progress) {
            console.log("Storing last listened episode:", audioUrl);
            localStorage.setItem('last_listened_url', audioUrl.toString());
            localStorage.setItem('last_playback_position', progress.toString());
        }
    };
    useEffect(() => {
        storeLastListenedEpisode(audioUrl, progress);
    }, [audioUrl, progress]);
    /**
     * <audio> element with controls, using the provided audioUrl.
     * Close button represented by an <img> element, which triggers the handleClose function when clicked.
     * Renders buttons for clearing local storage, displaying episode completion status, and closing the audio player.
     * The audioUrl is used as the source for the audio element.
     */
    return (
        <div className=''>
            <div
                className="fixed bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-3xl text-white py-4 px-6 flex items-center justify-between">
                <audio
                    className="w-full"
                    ref={audioRef}
                    controls
                    onEnded={handleAudioEnded}
                    onTimeUpdate={handleProgressUpdate}
                >
                    <source src={audioUrl} type="audio/mpeg"/>
                </audio>
                <button onClick={handleClearLocalStorage}>
                    <img src={removeFav} alt='Clear Local Storage' title='Clear Local Storage'
                         className='w-10 h-10 m-3'/>
                </button>
                <div>
                    {isEpisodeCompleted ?
                        <p><img src={completedFav} alt='Completed' title='Completed' className='w-10 h-10 m-3'/></p>
                        : <p><img src={incompletedFav} alt='Not Completed' title='Not Completed'
                                  className='w-10 h-10 m-3'/></p>}
                </div>
                <button>
                    <img src={seeMoreFav} alt='See Name' title={episodeTitle}
                         className='w-10 h-10 m-3'/>
                </button>
                <button onClick={handleClose}>
                    <img src={closeBtnFav} alt='Close' title='Close' className='w-12 h-12 m-3 cursor-pointer'/>
                </button>
            </div>
        </div>
    );
};

export default AudioPlayer;