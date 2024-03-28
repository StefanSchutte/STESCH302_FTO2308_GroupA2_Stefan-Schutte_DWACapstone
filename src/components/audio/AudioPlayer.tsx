import React, {useEffect, useRef, useState} from 'react';
import {useAudioPlayer} from "../../services/AudioPlayerContext.tsx";
import closeBtnFav from '/close.png';
import completedFav from'/checklist.png'
import incompletedFav from '/incomplete.png'
import removeFav from "/remove.png";

interface AudioPlayerProps {
    audioUrl: string;
    onClose: () => void;
    userId: string;
    episodeId: number;
    showId: number;
    seasonId: number;
    episodeTitle: string;
    setShowAudioPlayer: (show: boolean) => void;
    setAudioUrl: (url: string) => void;
}

/**
 * Audio Player Functional component.
 * Props provide information for the audio player to function, such as the URL of the audio file, user and episode IDs, and episode progress.
 * <audio> element with controls.
 * Plays the provided 'audioUrl'.
 * Close button represented by an <img> element, which triggers the handleClose function when clicked.
 * Renders buttons for clearing local storage, displaying episode completion status, and closing the audio player.
 * The 'audioUrl' is used as the source for the audio element.
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({
         audioUrl,
         onClose,
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
     * Sets up effects to synchronize the audio playback progress with the stored progress in local storage.
     * Runs when any of the dependencies [episodeId, seasonId, showId, userId] change.
     * Retrieves the stored progress for the current episode from local storage using a key constructed from the provided IDs.
     * Stored progress parsed into a floating-point number and sets the progress state to this value.
     * Sets its 'currentTime' property to the parsed progress value.
     * Ensures that if the user returns to the episode, the audio playback resumes from where they left off.
     * Retrieves the stored completion status of the current episode from local storage.
     * If the completion status is 'true', it sets the isEpisodeCompleted state to true, indicating that the episode has been completed.
     */
    useEffect(() => {

        const storedProgress = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeTitle}_progress`);

        if (storedProgress) {
            const parsedProgress = parseFloat(storedProgress);
            setProgress(parsedProgress);
            if (audioRef.current) {
                audioRef.current.currentTime = parsedProgress;
            }
        } else {
            setProgress(0);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        }

        const storedCompletionStatus = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeTitle}_completed`);

        if (storedCompletionStatus === 'true') {
            setIsEpisodeCompleted(true);
        } else {
            setIsEpisodeCompleted(false)
        }
    }, [episodeTitle, seasonId, showId, userId]);

    /**
     * Called when the <audio> element emits the onTimeUpdate event, indicating that the playback progress has changed.
     * Updates the progress state with the current playback time obtained from the <audio> element.
     * Stores the current playback time in the local storage, associating it with the current user, show, season, and episode titles.
     * Allows the application to remember the playback progress of the episode even if the user navigates away from the page.
     */
    const handleProgressUpdate = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            setProgress(currentTime);
            localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeTitle}_progress`, currentTime.toString());
        }
    };

    /**
     * Mark the current episode as completed.
     * Sets the 'isEpisodeCompleted' state to true, indicating that the episode has been completed.
     * Stores the completion status of the episode in local storage.
     */
    const markEpisodeCompleted = () => {
        setIsEpisodeCompleted(true);
        localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeTitle}_completed`, 'true');
    };

    /**
     * Called when the audio playback ends.
     * Sets the 'isEpisodeCompleted' state to true, indicating that the current episode has been completed.
     * Stores this completion status in the browser's local storage, associating it with the current episode ID.
     * Allows the application to remember the completion status of the episode even if the user navigates away from the page.
     */
    const handleEpisodeCompletion = async () => {
        setIsEpisodeCompleted(true);
        localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeTitle}_completed`, 'true');
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
     */
    useEffect(() => {
        const storedCompletionStatus = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeTitle}_completed`);

        if (storedCompletionStatus === 'true') {
            setIsEpisodeCompleted(true);
        }
    }, []);

    /**
     * Triggered when the user clears all data stored in the local storage.
     * Clears all data stored in the local storage by calling 'localStorage.clear()'.
     * Reloads the window to reflect the changes caused by clearing the storage.
     */
    const handleClearLocalStorage = () => {
        localStorage.clear();
        window.location.reload();
    };


    /**
     * Manage the visibility of the audio player component within the application.
     * Triggered when the user attempts to close the audio player.
     * Confirmation prompt, asking if they are sure they want to close the audio player.
     * Handles closing the audio player component.
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
     * Function to store the last listened episode in localStorage.
     */
    const storeLastListenedEpisode = (audioUrl: string, progress: number) => {
        if (progress) {
            localStorage.setItem('last_listened_url', audioUrl.toString());
            localStorage.setItem('last_playback_position', progress.toString());
        }
    };

    useEffect(() => {
        storeLastListenedEpisode(audioUrl, progress);
    }, [audioUrl, progress]);

    return (
        <div className='flex items-center justify-between '>
            <div className="fixed bottom-0 left-0 w-full bg-black rounded-3xl text-yellow-400 py-2 px-4 border border-purple-400">
                <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center'>
                        <p className='text-gray-400 p-2'>
                            Now Playing:
                        </p>
                        {episodeTitle}
                    </div>
                    <div className='flex items-center justify-between'>
                        <button onClick={handleClearLocalStorage}>
                            <img src={removeFav} alt='Clear Local Storage' title='Clear Local Storage' className='w-8 h-8 m-3'/>
                        </button>
                        <div>
                            {isEpisodeCompleted ?
                                <p>
                                    <img src={completedFav} alt='Completed' title='Completed' className='w-10 h-10 m-3'/>
                                </p>
                                : <p>
                                    <img src={incompletedFav} alt='Not Completed' title='Not Completed'
                                          className='w-8 h-8 m-3'/>
                                </p>}
                        </div>
                        <button onClick={handleClose}>
                            <img src={closeBtnFav} alt='Close' title='Close' className='w-10 h-10 m-3 cursor-pointer'/>
                        </button>
                    </div>
                </div>
                <audio
                    className="w-full "
                    ref={audioRef}
                    controls
                    onEnded={handleAudioEnded}
                    onTimeUpdate={handleProgressUpdate}
                >
                    <source src={audioUrl} type="audio/mpeg"/>
                </audio>
            </div>
        </div>
    );
};

export default AudioPlayer;