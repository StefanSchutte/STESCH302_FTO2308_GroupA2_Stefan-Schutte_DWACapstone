import React, {useEffect, useState} from 'react';
import PlayButton from '../audio/PlayButton.tsx'
import Genres from "../../helpers/Genres.tsx";
import supabase from "../../supabase.ts";
import {useAuth} from "../../services/AuthContext.tsx";
import {getShowDetailFromApi} from "../../api/API.ts";
import { useAudioPlayer } from "../../services/AudioPlayerContext.tsx";
import {OverlayProps} from "../../types.ts";
import {Podcast} from '../../types.ts'
import seeMoreFav from '/seeMore.png';
import saveBtnFav from "/save.png";
import closeFav from "/close.png";

/**
 * PodcastInfo component to display detailed information about a podcast.
 * The PodcastInfo component is a functional component that takes OverlayProps as its props.
 * item - The podcast item containing details.
 * showOverlay - Boolean to control the visibility of the overlay.
 * closeOverlay - Function to close the overlay.
 * State Initialization.
 * Initialized using the useState hook:
 */
const PodcastInfo: React.FC<OverlayProps> = ({ item, showOverlay, closeOverlay}) => {
    /**
     * Holds podcast-related data fetched asynchronously.
     *  Gets updated when podcast data is fetched from the API and set using the setPodcastData function.
     */
    const [podcastData, setPodcastData] = useState<any>(null);
    /**
     * Represents the selected season.
     * Represents the selected episode.
     * State variables store the currently selected season and episode numbers, respectively.
     * They are initially set to null.
     * Gets updated when a user selects a season or episode from the dropdown menus in the overlay.
     */
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
    /**
     * Formats the date of the podcast's last update.
     * Variable is derived from the 'item.updated' property, which represents the last update date of the podcast.
     */
    const formattedUpdated = item && item.updated ? new Date(item.updated).toISOString().split('T')[0].replace(/-/g, '/') : '';
    /**
     * Indicates whether podcast data is being loaded.
     * Set to false initially and is toggled to true when data fetching starts and back to false when fetching completes.
     */
    const [loading, setLoading] = useState(false);
    /**
     * Control the visibility of additional content sections, uch as episode lists and season details.
     * Initially set to false and are toggled between true and false based on user interactions.
     */
    const [expanded, setExpanded] = useState(false);
    const [seasonExpanded, setSeasonExpanded] = useState(false);
    /**
     * Manage the text content and index of the currently hovered episode's tooltip.
     * Initially set to an empty string and -1, respectively, indicating that no tooltip is displayed initially.
     * When a user hovers over an episode, tooltipText is set to the episode's description, and tooltipIndex is set to the index of the hovered episode.
     */
    const [tooltipText, setTooltipText] = useState('');
    const [tooltipIndex, setTooltipIndex] = useState(-1);
    /**
     * Hook used to access authentication information.
     * Integrate authentication features into the component without passing props explicitly.
     */
    const { user } = useAuth();
    /**
     * Hook used to access audio player functionalities within the component.
     * Integrate audio playback features into the component without passing props explicitly.
     */
    const { setShowAudioPlayer, setAudioUrl } = useAudioPlayer();

    /**
     * Fetches podcast data from api and sets it in the state.
     * Manages the body overflow and fetches podcast data based on changes in item and showOverlay.
     * 'handleBodyOverflow' function toggles the overflow-hidden class on the <body> element depending on whether the overlay is shown.
     * 'overflow-hidden' class applied to the <body> element to prevent scrolling of the body content while the overlay is displayed.
     * If overlay is not shown or there's no item, it removes the overflow-hidden class.
     * Triggers the 'handleBodyOverflow' function whenever the window is resized.
     * Ensures that the overflow behavior is updated dynamically if the window size changes while the overlay is shown.
     */
    useEffect(() => {
            const handleBodyOverflow = () => {
                if (showOverlay && item) {
                    document.body.classList.add('overflow-hidden');
                } else {
                    document.body.classList.remove('overflow-hidden');
                }
            };
            handleBodyOverflow();
            window.addEventListener('resize', handleBodyOverflow);
            return () => {
                if (showOverlay) {
                    document.body.classList.remove('overflow-hidden');
                }
                window.removeEventListener('resize', handleBodyOverflow);
            }

        }, [showOverlay]);

    /**
     * Fetches podcast data when the overlay is shown, based on changes in item and showOverlay.
     * Call the getShowDetailFromApi function from the imported module.
     * When the 'showOverlay' state is true, the effect sets the loading state to true to indicate that data fetching is in progress.
     * Calls the 'getShowDetailFromApi' function with the 'item.id' parameter to fetch information from the API.
     * Upon successfully fetching the data, it updates the podcastData state with the fetched data using setPodcastData.
     * After updating the state with the fetched data, it sets the loading state back to false.
     * If an error occurs during the API request, it catches the error, sets the loading state to false, and continues execution.
     */
    useEffect(() => {
        if (showOverlay && item) {
            setLoading(true);
            getShowDetailFromApi(item.id)
                .then(data => {
                    setPodcastData(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching podcast data:', error);
                    setLoading(false);
                });
        }
    }, [item, showOverlay]);

    /**
     * Save data to Supabase.
     *
     */
    const handleSave = async () => {
        /**
         * Checking if there is a logged-in user.
         * If there is no authenticated user, it logs an error message.
         */
        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        /**
         * Checks if the selectedSeason and selectedEpisode variables are not null, and if the podcastData is available.
         * If any of these conditions fail, the function returns early without attempting to save the favorite episode.
         * Extracts information about the selected episode and season from the podcastData.
         * Retrieves the relevant episode and season data based on the indices stored in selectedSeason and selectedEpisode.
         * Retrieves the current date and time and formats it as a string to represent when the episode was saved.
         */
        if (selectedSeason !== null && selectedEpisode !== null && podcastData) {
            const selectedEpisodeData = podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1];
            const selectedSeasonData = podcastData;
            const currentDate = new Date().toISOString();

            /**
             * Interacts with a database to save the favorite episode.
             * Insert method to insert a new record into the "favorites" table.
             */
            const { error } = await supabase
                .from('favorites')
                .insert([{
                    user_id: user.id,
                    episode_id: selectedEpisodeData.id,
                    season_id: selectedSeasonData.id,
                    episode_title: selectedEpisodeData.title,
                    season_title: selectedSeasonData.title,
                    season_image: selectedSeasonData.image,
                    seasons_titles: selectedSeasonData.seasons,
                    date_saved: currentDate,
                    mp3_file: selectedEpisodeData.file,
                }]);

            if (error) {
                console.error('Error inserting favorite episode:', error);
                return;
            }
            const { error: fetchError } = await supabase.from('favorites').select();

            if (fetchError) {
                console.error('Error fetching all favorites:', fetchError);
                return;
            }
        }
    };

    /**
     * Handles the selection of a season.
     * seasonNumber - The selected season number.
     * Updates the state variable 'selectedSeason' using the 'setSelectedSeason' function provided by the useState hook.
     * Re-renders to reflect the newly selected season.
     */
    const handleSeasonSelect = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    };

    /**
     * Handles the selection of an episode.
     * episodeNumber - The selected episode number.
     * Updates the state variable 'selectedEpisode' using the 'setSelectedEpisode' function provided by the useState hook.
     * Retrieves the URL of the selected episode's audio file.
     */
    const handleEpisodeSelect = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);


        if (podcastData && selectedSeason !== null) {
            const selectedEpisodeFile = podcastData.seasons[selectedSeason - 1].episodes[episodeNumber - 1].file;
            setAudioUrl(selectedEpisodeFile);
        }
    };

    /**
     * 'setExpanded' is called with the negation of the current value of expanded, effectively toggling its state between true and false.
     * Used to control the visibility of content sections within the component.
     */
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    /**
     * 'setSeasonExpanded' is called with the negation of the current value of seasonExpanded, toggling its state between true and false.
     * Controls the visibility of content sections related to seasons.
     */
    const toggleSeasonExpanded = () => {
        setSeasonExpanded(!seasonExpanded);
    };

    /**
     * Function to handle mouse enter.
     * Set index of hovered episode.
     * Set description to display.
     */
    const handleMouseEnter = (index: number, description: string) => {
        setTooltipIndex(index);
        setTooltipText(description);
    };

    /**
     * Function to handle mouse leave.
     * Reset index and clear description.
     */
    const handleMouseLeave = () => {
        setTooltipIndex(-1);
        setTooltipText('');
    };

    /**
     * Conditional rendering of the overlay based on the visibility flag.(showOverlay)
     * Renders the podcast details, loading indicator, season/episode selectors, and a button to close the overlay.
     * Render loading spinner if data is loading.
     */
    if (!showOverlay) return null;

    /**
     * Close the overlay.
     */
    const handleCloseOverlay = () => {
        closeOverlay();
    };

    return (
            <>
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-[90] overflow-hidden">
                    <div className="text-yellow-400 bg-black bg-opacity-0 z-[100] rounded-lg overflow-hidden">
                        <div className="w-[90vw] h-[70vh] bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${item.image})` }}>
                            <div className="p-4 m-4 rounded-lg max-w-screen h-full overflow-auto scrollbar-hide">
                                <div className="flex items-center flex-col mb-4 sm:flex-row sm:items-center sm:justify-start">
                                    <div className="mr-4">
                                        <img src={item.image} alt='img' className='max-w-40 h-40 object-cover ' />
                                    </div>
                                    <div className='font-bold text-yellow-400 flex items-center'>
                                        <h2 className='text-4xl underline mt-3'>
                                            {item.title}
                                        </h2>
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <div className='flex items-center mb-4 mt-8'>
                                        <Genres genres={Array.isArray(item.genres) ? item.genres : [item.genres]} />
                                    </div>
                                    <div className='text-gray-500 flex items-center mb-4'>
                                        {formattedUpdated}
                                    </div>
                                    <div className="whitespace-pre-wrap flex items-center mb-4">
                                        {item.description}
                                    </div>
                                    <div className='text-yellow-400 flex items-center mb-4'>
                                        <p className='text-amber-50'>
                                            Seasons:
                                        </p>{item.seasons}
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="text-blue-500 text-5xl">Loading...</div>
                                    </div>
                                ) : (
                                podcastData && (
                                    <div>
                                        <div className='grid-cols-2'>
                                            <div className='flex items-center'>
                                                {/* Choose Season dropdown */}
                                                <div className='pr-6 text-purple-500'>Select Season:</div>
                                                <select
                                                    value={selectedSeason || ''}
                                                    onChange={(e) => handleSeasonSelect(parseInt(e.target.value))}
                                                    className='p-3 my-2 bg-gray-600 rounded w-2/3 '
                                                >
                                                    <option value="">Choose Season</option>
                                                    {Array.from({length: item.seasons}, (_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            Season {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* See More button */}
                                                <button className="ml-3 w-12 h-12" onClick={toggleSeasonExpanded}>
                                                    {seasonExpanded ? <img src={closeFav} alt='close' title='Close'/> :
                                                        <img src={seeMoreFav} alt='See More' title='See More'/>}
                                                </button>
                                            </div>
                                            <div className={`w-full ${seasonExpanded ? 'block' : 'hidden'}`}>
                                                <ul className="p-3 my-2 bg-gray-600 rounded overflow-auto">
                                                    {Array.from({length: item.seasons}, (_, i) => (
                                                        <li key={i + 1}
                                                            className="py-2 px-4 border-b border-gray-700 flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={podcastData.seasons[i]?.image}
                                                                    alt={`Season ${i + 1} Image`}
                                                                    className="w-16 h-16 mr-4 hidden sm:block"
                                                                />
                                                                <button
                                                                    onClick={() => handleSeasonSelect(i + 1)}
                                                                    title='Select Season'>
                                                                    <div className='flex items-center'>
                                                                        <p className='text-gray-300 pr-3 hidden sm:block'> Season {i + 1}:</p> {podcastData.seasons[i]?.title || 'Untitled'}
                                                                    </div>
                                                                </button>
                                                            </div>
                                                            <div className='flex items-center'>
                                                                <p className='text-gray-300 pr-2'>Episodes: </p>
                                                                {String(podcastData.seasons[i]?.episodes.length || 0).padStart(2, '0')}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className=''>
                                                <div className='flex items-center'>
                                                    <div className='pr-4 text-purple-500'>
                                                        Select Episode:
                                                    </div>
                                                    {/* Choose Episode dropdown */}
                                                    <select
                                                        value={selectedEpisode || ''}
                                                        onChange={(e) => handleEpisodeSelect(parseInt(e.target.value))}
                                                        className='p-3 my-2 bg-gray-600 rounded w-2/3'
                                                    >
                                                        <option value="">Choose Episode</option>
                                                        {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: Podcast, index: number) => (
                                                            <option key={index + 1} value={index + 1}>
                                                                {episode.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {/* See More button */}
                                                    <button className="ml-3 w-12 h-12" onClick={toggleExpanded}>
                                                        {expanded ? <img src={closeFav} title='Close'/> :
                                                            <img src={seeMoreFav} title='See More'/>}
                                                    </button>
                                                </div>
                                                {/* Episode list */}
                                                <div className={`w-full ${expanded ? 'block' : 'hidden'}`}>
                                                    <ul className="p-3 my-2 bg-gray-600 rounded">
                                                        {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: Podcast, index: number) => (
                                                            <li
                                                                key={index + 1}
                                                                className="py-2 px-4 border-b border-gray-700 flex justify-between items-center relative"
                                                                onMouseEnter={() => handleMouseEnter(index, episode.description)}
                                                                onMouseLeave={() => handleMouseLeave()}
                                                            >
                                                                <button
                                                                    onClick={() => handleEpisodeSelect(index + 1)}
                                                                    title='Select Episode'>
                                                                    {episode.title}
                                                                </button>
                                                                {tooltipIndex === index && (
                                                                    <div
                                                                        className="absolute left-0 mt-8 ml-2 bg-black text-amber-50 p-2 rounded z-20"
                                                                        style={{top: '50%', left: '0'}}>
                                                                        {tooltipText}
                                                                        {episode.description ? episode.description : "No description available."}
                                                                    </div>
                                                                )}
                                                                <button onClick={handleSave} className='w-12 h-12'>
                                                                    <img src={saveBtnFav} alt='Save'
                                                                         title='Select Episode to Save'/></button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {showOverlay &&  selectedSeason && selectedEpisode &&
                                            <PlayButton
                                                audioUrl={podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1]?.file}
                                                showId={parseInt(item.id)}
                                                episodeId={selectedEpisode}
                                                seasonId={{selectedSeason}}
                                                setShowAudioPlayer={setShowAudioPlayer}
                                                setAudioUrl={setAudioUrl}
                                                episodeTitle={podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1]?.title}
                                                userId={user}
                                            />
                                        }
                                    </div>
                                )
                                )}
                                <button className="absolute top-4 right-4 " onClick={handleCloseOverlay}>
                                    <img src={closeFav} alt="close" className='w-15 h-15 ml-2' title='CLose'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    );
};

export default PodcastInfo;
