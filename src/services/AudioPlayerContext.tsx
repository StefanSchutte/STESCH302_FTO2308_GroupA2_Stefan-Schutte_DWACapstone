import {createContext, ReactNode, useContext, useState} from 'react';

interface AudioPlayerProviderProps {
    children: ReactNode;
}

// interface AudioPlayerContextProps {
//     showAudioPlayer: boolean;
//     setShowAudioPlayer: (show: boolean) => void;
//     audioUrl: string;
//     setAudioUrl: (url: string) => void;
//     episodeId: number | null;
//     setEpisodeId: (id: number | null) => void;
//     showId: number | null;
//     setShowId: (id: number | null) => void;
//     seasonId: number | null;
//     setSeasonId: (id: number | null) => void;
//     episodeTitle: string | null;
//     setEpisodeTitle: (title: string | null) => void;
//     userId: string;
// }

/**
 *  Create the context.
 *  Allow components to share and access state related to audio player functionality.
 *  Context is primarily used for providing a custom hook.
 */
//const AudioPlayerContext = createContext<any>(null);
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
 * useContext hook allows functional components to consume the context created by createContext.
 */
export const useAudioPlayer = () => useContext(AudioPlayerContext);

/**
 * Context provider component.
 * Provider for the AudioPlayerContext.
 * It initializes state variables using the useState hook: showAudioPlayer and audioUrl.
 * Variables represent whether the audio player is currently visible (showAudioPlayer) and the URL of the audio file being played (audioUrl).
 * 'toggleAudioPlayer' toggles the visibility of the audio player by flipping the value of showAudioPlayer.
 * Renders the AudioPlayerContext.Provider component with a value prop containing the state variables and functions.
 * Accessible to any child components that use the useAudioPlayer hook.
 * Renders children inside the provider.
 * Ensures that any components nested within AudioPlayerProvider can access the audio player context.
 *
 */
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');

    const [episodeId, setEpisodeId] = useState<number | null>(null);
    const [showId, setShowId] = useState<number | null>(null);
    const [seasonId, setSeasonId] = useState<number | null>(null);
    const [episodeTitle, setEpisodeTitle] = useState<string | null>(null);

    /**
     * Function to toggle the audio player visibility.
     */
    const toggleAudioPlayer = () => {
        setShowAudioPlayer((prev) => !prev);
    };

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