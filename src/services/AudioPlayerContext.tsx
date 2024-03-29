import {createContext, ReactNode, useContext, useState} from 'react';

interface AudioPlayerProviderProps {
    children: ReactNode;
}

/**
 *  Create the context.
 *  Allow components to share and access state related to audio player functionality.
 *  Context is primarily used for providing a custom hook.
 *  Defines the shape of the context's value by providing initial values for audio player-related states.
 *  Provides setter functions for updating these states.
 */
const AudioPlayerContext = createContext<any>({
    showAudioPlayer: false,
    setShowAudioPlayer: () => {},
    audioUrl: '',
    setAudioUrl: () => {},
    episodeId: null,
    setEpisodeId: () => {},
    showId: null,
    setShowId: () => {},
    seasonId: null,
    setSeasonId: () => {},
    episodeTitle: null,
    setEpisodeTitle: () => {},
});

/**
 * Custom hook to use the context.
 * To access the context's value within components.
 * 'useContext' hook allows functional components to consume the context created by 'createContext'.
 */
export const useAudioPlayer = () => useContext(AudioPlayerContext);

/**
 * Context provider component.
 * Provider for the AudioPlayerContext.
 * It initializes state variables using the useState hook.
 * Renders the AudioPlayerContext.Provider component with a value prop containing the state variables and functions.
 * Accessible to any child components that use the useAudioPlayer hook.
 */
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
    /** Indicates whether the audio player is currently visible. */
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    /** Represents the URL of the audio file being played. */
    const [audioUrl, setAudioUrl] = useState('');
    const [episodeId, setEpisodeId] = useState<number | null>(null);
    const [showId, setShowId] = useState<number | null>(null);
    const [seasonId, setSeasonId] = useState<number | null>(null);
    const [episodeTitle, setEpisodeTitle] = useState<string | null>(null);

    /**
     * Function to toggle the audio player visibility.
     * Flips the value of showAudioPlayer.
     */
    const toggleAudioPlayer = () => {
        setShowAudioPlayer((prev) => !prev);
    };

    /**
     * Passes down the state variables, setter functions, and the toggleAudioPlayer function as the value prop.
     * Makes these values accessible to any child components that use the useAudioPlayer hook.
     * Children are rendered inside the provider, ensuring that any components nested within it can access the audio player context.
     */
    return (
        <AudioPlayerContext.Provider value={{
            showAudioPlayer,
            setShowAudioPlayer,
            toggleAudioPlayer,
            audioUrl,
            setAudioUrl,
            episodeId,
            setEpisodeId,
            showId,
            setShowId,
            seasonId,
            setSeasonId,
            episodeTitle,
            setEpisodeTitle,

        }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};
