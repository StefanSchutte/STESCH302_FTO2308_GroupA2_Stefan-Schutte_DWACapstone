import React, { createContext, useContext, useEffect, useState } from 'react';
import {getShowsFromAPI} from '../api/API.ts';
import {Podcast} from "../types.ts";

interface ShowsContextType {
    podcasts: Podcast[];
    loading: boolean;
    selectedSeason: number | null;
    selectSeason: (seasonNumber: number) => void;
}

interface ShowsProviderProps {
    children: React.ReactNode;
}

/**
 * Context for managing podcasts data.
 * Initializes a context object with default values for podcasts, loading state, selected season, and a dummy function for selecting a season.
 */
const ShowsContext = createContext<ShowsContextType>({ podcasts: [], loading: true, selectedSeason: null,
    selectSeason: () => {}, });

/**
 * Custom hook for accessing the ShowsContext.
 * Created to conveniently access the ShowsContext within functional components using useContext.
 */
export const useShows = () => useContext(ShowsContext);

/**
 * Provider component for managing podcasts data.
 * Serves as the provider for the ShowsContext.
 * Wraps children with the ShowsContext.Provider component, passing down the context values as props.
 * Sets up state variables using useState hook: podcasts to store fetched podcast data, loading to track whether data is being fetched,
 * and selectedSeason to track the currently selected season.
 * children - The child components to be wrapped by the provider.
 */
export const ShowsProvider: React.FC<ShowsProviderProps> = ({ children }) => {
    /** Array to store fetched podcast data. */
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    /** Boolean flag to track whether data is being fetched. */
    const [loading, setLoading] = useState(true);
    /** Nullable number indicating the currently selected season. */
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

    /**
     * Fetching data from the api when the component mounts (empty dependency array [] ensures it runs only once).
     * FetchData is defined, fetches data from the api using getShowsFromAPI function.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getShowsFromAPI();
                /** Upon data retrieval, the fetched data is stored in the podcasts state, and loading is set to false. */
                 setPodcasts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /**
     * Updates the selectedSeason state with the passed seasonNumber.
     */
    const selectSeason = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    };

    /**
     * The value prop of the ShowsContext.Provider is set to an object
     * containing the current state values (podcasts, loading, selectedSeason) and the selectSeason function.
     * This makes these values accessible to any component that consumes this context using the useShows hook.
     */
    return (
        <ShowsContext.Provider value={{ podcasts, loading, selectedSeason, selectSeason }}>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-blue-500 text-5xl">Loading...</div>
                </div>
            ) : (
                children
            )}
        </ShowsContext.Provider>
    );
};