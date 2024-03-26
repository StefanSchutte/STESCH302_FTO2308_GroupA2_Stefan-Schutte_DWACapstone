import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import PodcastInfo from '../components/Views/PodcastInfo.tsx'
import { useShows } from "../services/ShowsContext.tsx";
import Genres from "../helpers/Genres.tsx";
import {Podcast} from "../types.ts";

/**
 * Filters component to manage searching, filtering, and sorting of podcasts.
 * @returns JSX.Element
 */
const Filters: React.FC = () => {
    /** Use the useShows hook to access podcasts. */
    const { podcasts } = useShows();
    /** State variable to store filtered shows */
    const [filteredShows, setFilteredShows] = useState<Podcast[]>([]);
    /** State variable to store search term */
    const [searchTerm, setSearchTerm] = useState<string>('');
    /** State variable to track selected podcast */
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

    /**
     * Hook is executed whenever any value in the dependency array ([podcasts]) changes.
     * Triggers the effect whenever the podcasts array changes.
     * Sets the state of 'filteredShows' to the current value of the podcasts array.
     * Initializes the 'filteredShows' state with the latest list of podcasts obtained from the context
     */
    useEffect(() => {
        setFilteredShows(podcasts);
    }, [podcasts]);

    /**
     * Function to handle search input change.
     * setSearchTerm(e.target.value): Updates the searchTerm state variable with the value of the input field.
     * Contains the current value of the input field, which is the user's search query.
     * filterShows(e.target.value): Calls the filterShows function, passing the current search query as an argument.
     * Filtering the list of podcasts based on the search query.
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
        filterShows(e.target.value);
    };

    /**
     * Function to filter shows based on search term.
     * If search term is empty, show all shows.
     * Create a new instance of Fuse with the list of podcasts and configuration options.
     * Perform a search using the Fuse instance and the provided search term.
     * Update the filteredShows state with the search results.
     */
    const filterShows = (term: string): void => {
        if (term === '') {
            setFilteredShows(podcasts);
        } else {
            const fuse = new Fuse(podcasts, { keys: ['title'] });
            const result = fuse.search(term);
            // @ts-ignore
            setFilteredShows(result.map((item: Fuse.FuseResult<Podcast>) => item.item));
        }
    };

    /**
     * Function to handle podcast item click.
     * podcast - Selected podcast
     */
    const handlePodcastClick = (podcast: Podcast): void => {
        setSelectedPodcast(podcast);
    };

    /**
     * Function to close overlay.
     */
    const closeOverlay = (): void => {
        setSelectedPodcast(null);
    };

    /**
     * Function to handle sorting.
     * Extracts the new value from the event target (e.target.value) and stores it in the value variable.
     * Creates a copy of the filteredShows array using the spread operator
     */
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value;
        const sortedShows = [...filteredShows];
        if (value === 'az') {
            sortedShows.sort((a, b) => a.title.localeCompare(b.title));
        } else if (value === 'za') {
            sortedShows.sort((a, b) => b.title.localeCompare(a.title));
        } else if (value === 'asc') {
            sortedShows.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());
        } else if (value === 'desc') {
            sortedShows.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
        }
        setFilteredShows(sortedShows);
    }

    /**
     * Function to handle genre click.
     * Check if the genre is valid.
     * If 'All' is selected, show all podcasts.
     * Filter by the selected genre.
     * genre - Selected genre
     */
    const handleGenreClick = (genre: string ): void => {
        const genreIndex = ['All', 'Personal Growth', 'True Crime and Investigative Journalism', 'History', 'Comedy', 'Entertainment', 'Business', 'Fiction', 'News', 'Kids and Family'].indexOf(genre);
        if (genreIndex !== -1) {
            let filteredByGenre: Podcast[];
            if (genreIndex === 0) {
                filteredByGenre = podcasts;
            } else {
                // @ts-ignore
                filteredByGenre = podcasts.filter(podcast => podcast.genres.includes(genreIndex));
            }
            setFilteredShows(filteredByGenre);
        } else {
            console.error('Invalid genre:', genre);
        }
    };

    /**
     * Renders the search input field, sorting options, genre labels, and the list of filtered shows.
     * Each podcast item in the list displays its title, image, number of seasons, last updated date, and genres.
     * Clicking on a podcast item opens an overlay with additional details and options to save the podcast.
     * Renders an overlay when a podcast is selected, providing more details and options to save the podcast.
     */
    return (
        <div className='w-full h-full' >
            <div className='w-full  px-4 py-24 '>
                <div>
                    <div className='flex flex-col mt-4'>
                        <div className='w-full flex items-center mt-4 mb-4'>
                            {/* Search input */}
                            <div className='text-purple-500 mr-2 pr-4'>Search:</div>
                            <div className="mr-4 flex-grow flex items-center text-yellow-400">
                                <input type="text" value={searchTerm} onChange={handleSearchChange}
                                       placeholder="Search by title"
                                       className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-gray-600 w-full"/>
                            </div>
                        </div>
                        {/* Sorting options */}
                        <div>
                            <div className="mr-4 flex items-center mb-4">
                                <div className='text-purple-500 mr-2 pr-4'>Filter:</div>
                                <div className='flex-grow'>
                                    <select onChange={handleSortChange}
                                            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500
                                        bg-gray-600 text-yellow-400 w-full">
                                        <option value="az">Title A-Z</option>
                                        <option value="za">Title Z-A</option>
                                        <option value="asc">Date Ascending</option>
                                        <option value="desc">Date Descending</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mr-4 flex items-center mb-4">
                                <div className='text-purple-500 mr-2 pr-4'>Genre:</div>
                                {/* Show dropdown for small screens */}
                                <div className='flex flex-wrap text-yellow-400 sm:hidden '>
                                    <select onChange={(e) => handleGenreClick(e.target.value)}
                                            className="bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 w-[250px]">
                                        {['All', 'Personal Growth', 'True Crime and Investigative Journalism', 'History', 'Comedy', 'Entertainment', 'Business', 'Fiction', 'News', 'Kids and Family'].map(genre => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Show labels for larger screens */}
                                <div className='hidden sm:flex flex-wrap text-yellow-400'>
                                    {['All', 'Personal Growth', 'True Crime and Investigative Journalism', 'History', 'Comedy', 'Entertainment', 'Business', 'Fiction', 'News', 'Kids and Family'].map(genre => (
                                        <label key={genre} onClick={() => handleGenreClick(genre)}
                                               className="cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2"
                                               title='Select'>
                                            {genre}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Show list */}
                    <div className='font-bold text-4xl mt-4 text-yellow-400'>Results:</div>
                    {/* change m to 2 */}
                    <ul className="w-full mt-2 cursor-pointer grid grid-cols-1 sm:grid-cols-2 gap-x-2 ">
                        {filteredShows.map((show) => (
                            <li onClick={() => handlePodcastClick(show)} key={show.id}
                                className="border border-gray-300 rounded-md bg-black my-1 p-4 py-3 text-yellow-400 flex items-center ">

                                <div className="flex flex-col  w-full" title='Listen'>
                                    <div className="grid grid-cols-3 gap-1">
                                        <div className=" col-span-1 aspect-w-1 aspect-h-1 mb-2">
                                            <img src={show.image} alt={show.title}
                                                 className=" object-cover w-40 h-40"
                                            />
                                        </div>
                                        <div className="col-span-2 flex flex-col justify-between">
                                            <div className='text-base sm:text-lg md:text-xl xs:text-xs '>
                                            <div className="flex items-center font-bold">
                                                <h1 className='text-amber-50 pr-4'>Title:</h1>
                                                <div >{show.title}</div>
                                            </div>

                                            <div className="flex items-center ">
                                                <p className='text-amber-50 pr-4'>Seasons:</p>
                                                <div className='text-gray-400'>{show.seasons}</div>
                                            </div>

                                            <div className="flex items-center ">
                                                <p className='text-amber-50 pr-4'>Last
                                                    updated:</p>
                                                <div className='text-gray-400'>{new Date(show.updated).toLocaleDateString()}</div>
                                            </div>

                                            <div className="flex items-center ">
                                                <p className='text-amber-50 pr-4'>Genres:</p>
                                                <div className='text-gray-400 text-base flex flex-wrap'>{Array.isArray(show.genres) && (
                                                    <Genres genres={show.genres} />
                                                )}</div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedPodcast && (
                <PodcastInfo
                    item={selectedPodcast}
                    showOverlay={true}
                    closeOverlay={closeOverlay} />
                )}
            </div>
        </div>
    );
};

export default Filters;
// <Genres genres={show.genres} />