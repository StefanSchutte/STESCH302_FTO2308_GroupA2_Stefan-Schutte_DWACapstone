import { useEffect, useState } from 'react';
import { useAuth } from "../../services/AuthContext.tsx";
import supabase from "../../supabase.ts";
import { format } from 'date-fns'
import AudioPlayer from "../audio/AudioPlayer.tsx";
import removeFav from '/remove.png';
import shareFav from '/share.png';
import {FavoriteData, Podcast, PodcastFavorite} from "../../types.ts";

/**
 * Functional component representing the saved podcasts section.
 * Sets up a state variable favorites using the useState hook to manage the list of saved podcasts.
 * Retrieves the user object from the useAuth hook, which provides information about the authenticated user.
 * 'useState' hook is used to manage the component's state:
 * 'favorites': Stores the list of favorite podcasts.
 * 'selectedEpisode': Keeps track of the selected episode when clicked for further actions.
 * 'podcastData': Stores the data of the podcast fetched from the API.
 * 'loading': Indicates whether the component is in a loading state.
 * 'selectedEpisodeForAudio': Keeps track of the selected episode's audio file for audio playback.
 * 'shareUrl': Stores the URL generated for sharing a podcast episode.
 */
function SavedPodcasts(): JSX.Element {
    const [favorites, setFavorites] = useState<PodcastFavorite[]>([]);
    const { user } = useAuth();
    const [selectedEpisode, setSelectedEpisode] = useState<PodcastFavorite | null>(null);
    const [podcastData, setPodcastData] = useState<Podcast | null>(null);
    const [selectedEpisodeForAudio, setSelectedEpisodeForAudio] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState<string>('');

    /**
     * Fetch the user's favorite podcasts from the database whenever the user object changes.
     * This ensures that the component updates its state when the user logs in or out.
     * 'useEffect' hook is used to fetch the user's favorite podcasts from the database whenever the user object changes.
     */
    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    /**
     * Fetches the user's favorite podcasts from the database.
     * Retrieves the user's favorite podcasts from the database using Supabase.
     * It calls the 'fetchFavorites' function, which retrieves favorite podcasts using Supabase and updates the favorites state accordingly.
     */
    const fetchFavorites = async () => {
        try {
            if (user) {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('season_id, episode_title, season_title, season_image, date_saved, mp3_file, seasons_titles')
                    .eq('user_id', user.id);
                if (error) {
                    throw error;
                }
                if (data) {
                const transformedData = data.map((item: FavoriteData) => ({
                    id: item.season_id,
                    episode_title: item.episode_title,
                    season_title: item.season_title,
                    season_image: item.season_image,
                    date_saved: item.date_saved,
                    mp3_file: item.mp3_file,
                    seasons_titles: item.seasons_titles,
                    image: '',
                    title: '',
                    season_id: item.season_id,
                }));
                setFavorites(transformedData);
            } else {
                setFavorites([]);
            }
            }
        } catch (error) {
            console.error('Error fetching favorites:', (error as Error).message);
        }
    };

    /**
     * Fetch podcast data from the API using the provided season ID.
     * Sets the podcastData state with the fetched data.
     */
    const fetchPodcastDataFromSupaBase = async (seasonId: string) => {

        try {
            const response = await fetch(`https://podcast-api.netlify.app/id/${seasonId}`);
            const data = await response.json();
            setPodcastData(data);
        } catch (error) {
            console.error('Error fetching podcast data:', error);
            console.log(podcastData)
        }
    };

    /**
     * Deletes a podcast from the user's favorites.
     * Deletes podcast by calling the appropriate Supabase query.
     */
    const deletePodcast = async (season_id: string) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('season_id', season_id);
            if (error) {
                throw error;
            }
            setFavorites(favorites.filter(favorite => favorite.season_id !== season_id));
        } catch (error) {
            console.error('Error deleting podcast:', (error as Error).message);
        }
    };

    const handleDeleteClick = (season_id: string) => {
        deletePodcast(season_id);
    }

    /**
     * Handle clicking on an episode ID.
     * Set the 'selectedEpisodeId' state to the clicked episode ID.
     * Check if the episode has a nested object with a 'season_id' property.
     * Access the 'season_id' property from the nested object.
     */
    const handleEpisodeClick = (episode: PodcastFavorite ) => {
        setSelectedEpisode(episode);
            if (episode.season_id) {
                fetchPodcastDataFromSupaBase(episode.season_id);
            } else {
                console.error('Error: No season_id found in episode:', episode);
            }
    };

    /**
     * Sorts the podcasts alphabetically by season title in ascending order (A-Z).
     */
    const sortFavoritesByShowAZ = () => {
        const sortedFavorites = [...favorites].filter(podcast => podcast.season_title).sort((a, b) => a.season_title.localeCompare(b.season_title));
        setFavorites(sortedFavorites);
    };

    /**
     * Sorts the podcasts alphabetically by season title in descending order (Z-A).
     */
    const sortFavoritesByShowZA = () => {
        const sortedFavorites = [...favorites].filter(podcast => podcast.season_title).sort((a, b) => b.season_title.localeCompare(a.season_title));
        setFavorites(sortedFavorites);
    };
    /**
     * Sorts the podcasts by the date they were saved in ascending order (oldest to newest).
     */
    const sortFavoritesByDateAscending = () => {
        const sortedFavorites = [...favorites].sort((a, b) => new Date(a.date_saved).getTime() - new Date(b.date_saved).getTime());
        setFavorites(sortedFavorites);
    };

    /**
     * Sorts the podcasts by the date they were saved in descending order (newest to oldest).
     */
    const sortFavoritesByDateDescending = () => {
        const sortedFavorites = [...favorites].sort((a, b) => new Date(b.date_saved).getTime() - new Date(a.date_saved).getTime());
        setFavorites(sortedFavorites);
    };

    /**
     * Filtering and grouping the list of favorite podcasts by their seasons.
     * 'groupedBySeason' is initialized as an empty object.
     * This object will hold the grouped episodes where the keys represent shows and seasons.
     * 'map' function iterates over each episode in the 'favorites' array.
     * Extracts the seasonKey and subSeasonKey based on the episode's properties:
     * seasonKey: Represents the main show title(seasonKey).
     * subSeasonKey: Represents the season title(sub-seasonKey).
     * Checks if the groupedBySeason object already contains a key corresponding to the seasonKey. If not, it initializes an empty object for that key.
     * Checks if the subSeasonKey exists within the nested object corresponding to the seasonKey. If not, it initializes an empty array for that key.
     * Finally, it pushes the current episode into the array under the appropriate subSeasonKey.
     * 'Object.values' method is used to extract the values (grouped episodes) from the groupedBySeason object.
     * 'flatMap' is used to flatten the array of arrays into a single array.
     * 'flat' is used to further flatten the array if there are sub-seasons within a season.
     */
    const filterAndGroupBySeason = () => {
        const groupedBySeason: { [key: string]: { [key: string]: PodcastFavorite[] } } = {};

        favorites.map((episode, index) => {
            const seasonKey = episode.season_title;
            const subSeasonKey = episode.seasons_titles && episode.seasons_titles[index]?.title;

            if (!groupedBySeason[seasonKey]) {
                groupedBySeason[seasonKey] = {};
            }

            if (!groupedBySeason[seasonKey][subSeasonKey]) {
                groupedBySeason[seasonKey][subSeasonKey] = [];
            }

            groupedBySeason[seasonKey][subSeasonKey].push(episode);
        });

        setFavorites(Object.values(groupedBySeason).flatMap(Object.values).flat());
    };

    /**
     * Function to handle opening the audio player for the selected episode.
     * Set the selected episode ID for audio playback.
     * Find the episode with the given ID.
     */
    const openAudioPlayer = (episodeId: string) => {
        const selectedEpisode = favorites.find(episode => episode.id === episodeId);
        if (selectedEpisode) {
            setSelectedEpisodeForAudio(selectedEpisode.mp3_file);

        } else {
            console.error('Error: Episode not found with ID:', episodeId);
        }
    };

    /**
     * 'generateShareUrl' function generates a unique URL for sharing a podcast episode based on the user's ID or session and the podcast ID.
     * It sets the 'shareUrl' state with the generated URL.
     */
    const generateShareUrl = (episode: PodcastFavorite) => {
        const uniqueIdentifier = user ? user.id : Date.now().toString();
        const url = `${window.location.origin}/shared-favorites/${uniqueIdentifier}/${episode.id}`;
        setShareUrl(url);
    };

    /**
     * Renders a section titled "Saved for Later" and maps through the favorites array to display each saved podcast item.
     * Each podcast item is displayed with its image and title.
     * It provides a delete button for each podcast item, allowing users to remove it from their favorites.
     * The PodcastInfo component is used to provide additional functionality for each podcast item, such as saving the episode.
     */
    return (
        <>
            <div className='flex justify-center items-center text-yellow-400 mt-24'>
                <h1 className="text-white font-bold text-4xl p-4">Favorites</h1>
            </div>
            <div className="flex items-center justify-center  overflow-x-auto">
                <button onClick={sortFavoritesByShowAZ}
                        className='cursor-pointer mr-2 sm:mr-4 bg-gray-600 border border-amber-50 rounded-full p-1 sm:p-2 mt-2 text-yellow-400 text-sm sm:text-base'
                        title='Sort A-Z'>Sort A-Z
                </button>
                <button onClick={sortFavoritesByShowZA}
                        className='cursor-pointer mr-2 sm:mr-4 bg-gray-600 border border-amber-50 rounded-full p-1 sm:p-2 mt-2 text-yellow-400 text-sm sm:text-base'
                        title='Sort Z-A'>Sort Z-A
                </button>
                <button onClick={sortFavoritesByDateAscending}
                        className='cursor-pointer mr-2 sm:mr-4 bg-gray-600 border border-amber-50 rounded-full p-1 sm:p-2 mt-2 text-yellow-400 text-sm sm:text-base'
                        title='Ascending Date'>Ascending Date
                </button>
                <button onClick={sortFavoritesByDateDescending}
                        className='cursor-pointer mr-2 sm:mr-4 bg-gray-600 border border-amber-50 rounded-full p-1 sm:p-2 mt-2 text-yellow-400 text-sm sm:text-base'
                        title='Descending Date'>Descending Date
                </button>
                <button onClick={filterAndGroupBySeason}
                        className='cursor-pointer bg-gray-600 border border-amber-50 rounded-full p-1 sm:p-2 mt-2 text-yellow-400 text-sm sm:text-base'
                        title='Group by Season'>Group by Season
                </button>
            </div>
            <div className='justify-center items-center text-gray-500 overflow-y-auto max-h-screen'>
                <ul className='items-center z-[100]'>
                    {favorites.map((episode, index) => (
                        <li key={index}
                            onClick={() => handleEpisodeClick(episode)}
                            className='border bg-black rounded m-4 flex justify-between items-center text-yellow-400 cursor-pointer'>
                            <div className="flex flex-col sm:flex-row items-center" onClick={() => openAudioPlayer(episode.id)}>
                                <div>
                                    <img src={episode.season_image} alt={episode.title} className='w-52 h-full ml-4 '/>
                                </div>
                                <div className="flex flex-col ml-6">
                                    <div className='font-bold m-3 underline'>{episode.season_title}</div>
                                    <div className=' flex items-center m-2'>
                                        <p className='text-gray-500 pr-4'>Episode:</p>
                                        {episode.episode_title}
                                    </div>
                                    <div className=' flex items-center m-2'>
                                        <p className='text-gray-500 pr-6'>Season:</p>
                                        {/*{episode.seasons_titles[index]?.title}*/}
                                        {episode.seasons_titles && episode.seasons_titles[index]?.title ? episode.seasons_titles[index]?.title : episode.season_title}
                                    </div>
                                    <div className=' flex items-center m-2 mb-3'>
                                        <p className='text-gray-500 pr-2'>Date Saved:</p>
                                        {format(new Date(episode.date_saved), 'dd/MM/yyyy HH:mm')}
                                    </div>
                                </div>
                            </div>
                            <div className=' m-3'>
                                <div>
                                    <img src={shareFav} alt='Share' title='Share' className='w-14 h-14 m-2'
                                         onClick={() => generateShareUrl(episode)}/>

                                    {episode.id === selectedEpisode?.id && shareUrl && (
                                        <div className='bg-blue-500'>
                                            <input type="text" value={shareUrl} readOnly/>
                                            <button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy URL
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => handleDeleteClick(episode.season_id)}>
                                    <img src={removeFav} alt='Remove' title='Remove' className='w-14 h-14 m-2 mt-3'/>
                                </button>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedEpisodeForAudio && selectedEpisode && (
                <AudioPlayer
                    audioUrl={selectedEpisode.mp3_file}
                    onClose={() => setSelectedEpisodeForAudio(null)}
                    userId={user?.id ?? ''} // Provide the user ID obtained from authentication
                    episodeId={parseInt(selectedEpisode.id)}  // Provide the episode ID from the selected episode object
                    showId={parseInt(selectedEpisode.season_id)} // Provide the show ID from the selected episode object
                    seasonId={parseInt(selectedEpisode.season_id)} // Provide the season ID from the selected episode object
                    episodeTitle={selectedEpisode.title}
                />
            )}
        </>
    );
}

export default SavedPodcasts;