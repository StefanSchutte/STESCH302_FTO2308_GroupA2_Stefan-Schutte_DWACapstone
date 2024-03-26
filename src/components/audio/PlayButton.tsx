import React from 'react';
import AudioPlayer from "./AudioPlayer.tsx";
import playFav from '/play-button.png'
import { useAudioPlayer } from "../../services/AudioPlayerContext.tsx";

interface PlayButtonProps {
    audioUrl: string;
    showId: number;
    episodeId: number;
    seasonId: any;
    userId: any;
    episodeTitle: string;
    setShowAudioPlayer: (value: boolean) => void;
    setAudioUrl: (url: string | null) => void;
}

/**.
 * State variable showAudioPlayer initialized with useState.
 * This state tracks whether the audio player should be shown or not.
 * The component renders a button with an image of a play button (playFav). When clicked, it triggers the handlePlayButtonClick function.
 * The useAudioPlayer hook from the AudioPlayerContext.tsx service is used to manage the state related to the audio player.
 */
const PlayButton: React.FC<PlayButtonProps> = ({
               audioUrl,
               showId,
               episodeId,
               seasonId,
               userId,
               episodeTitle
    }) => {
    const { showAudioPlayer, setShowAudioPlayer, setAudioUrl } = useAudioPlayer()

    /**
     * Called when the play button is clicked.
     * When the play button is clicked, it sets showAudioPlayer to true, indicating that the audio player should be shown.
     * Sets the audio URL using 'setAudioUrl' to prepare the audio player to play the selected audio file.
     */
    const handlePlayButtonClick = () => {
        setShowAudioPlayer(true);
        setAudioUrl(audioUrl);
    };

    /**
     * Renders a button with an image of a play button.
     * This button triggers the handlePlayButtonClick function when clicked.
     * If 'showAudioPlayer' is true, indicating that the audio player should be shown, 'the AudioPlayer' component is rendered.
     * 'AudioPlayer' component is conditionally rendered based on the showAudioPlayer state.
     */
    return (
        <>
            <button
                className="py-2 px-5 absolute top-2 right-16 w-15 h-15"
                onClick={handlePlayButtonClick}
                title='Play'
            >
                <img src={playFav} alt='Play'/>
            </button>
            {showAudioPlayer && (
                <AudioPlayer
                    audioUrl={audioUrl}
                    onClose={() => setShowAudioPlayer(false)}
                    userId={userId}
                    episodeId={episodeId}
                    showId={showId}
                    seasonId={seasonId.selectedSeason}
                    episodeTitle={episodeTitle}
                />
            )}
        </>
    );
};

export default PlayButton;
