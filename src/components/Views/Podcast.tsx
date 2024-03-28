import React from 'react';

interface PodcastProps {
    item: {
        image: string;
        title: string;
    };
    openOverlay: any;
}

/**
 * Functional component representing a podcast card.
 * It displays the podcast image and title.
 * Invokes the openOverlay function with the item prop as its argument when the card is clicked.
 * item - The podcast item containing image and title.
 * openOverlay - Function to open the overlay with podcast data.
 */
const Podcast: React.FC<PodcastProps> = function ({item, openOverlay}) {

    /**
     * Handles the click event on the podcast card.
     * When the podcast is clicked, call the openOverlay function with the podcast data.
     */
    const handleClick = () => {
        openOverlay(item);
    };

    /**
     * Returns JSX representing a podcast card:
     * The image and title are conditionally rendered using optional chaining (?.) to avoid errors if the item prop is null or undefined.
     * 'handleClick' function is attached to its onClick event handler.
     */
    return (
        <div className='w-[160px] sm:w-[200px] md:w-[240px] lg:w[240px] inline-block cursor-pointer relative p-2' onClick={handleClick}>
            <img className='w-full h-auto block' src={item?.image} alt={item?.title}/>
            <div
                className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-amber-50'>
                <p className='whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>{item?.title}</p>
            </div>

        </div>
    )
}

export default Podcast;