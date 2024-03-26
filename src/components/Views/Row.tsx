import React from 'react';
import Podcast from './Podcast';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {useShows} from "../../services/ShowsContext.tsx";
import { Podcast as PodcastType } from '../../types.ts'

interface RowProps {
    /** The title of the row. */
    title: string;

    /** The unique identifier for the row. */
    rowId: string;
    /** Function to open an overlay for a podcast. */
    openOverlay: (podcast: PodcastType) => void;
    podcasts: PodcastType[];
}

/**
 * Row component to display a horizontal row of podcasts.
 * useShows hook is used to access the podcasts data.
 */
const Row: React.FC<RowProps> = ({ title, rowId, openOverlay }) => {

    const { podcasts } = useShows();

    /**
     * Handles sliding the row to the left.
     */
    const slideLeft = () => {
        const slider = document.getElementById('slider' + rowId);
        if (slider) slider.scrollLeft = slider.scrollLeft - 500;
    };

    /**
     * Handles sliding the row to the right.
     */
    const slideRight = () => {
        const slider = document.getElementById('slider' + rowId);
        if (slider) slider.scrollLeft = slider.scrollLeft + 500;
    };

    /**
     * Returned to render the row:
     * It includes the row title and a container to display podcasts horizontally.
     * Podcasts are mapped over and rendered using the Podcast component.
     * Chevron icons are provided to slide the row left and right, and their onClick handlers are set to call the corresponding functions.
     */
    return (
        <div>
            <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
            <div className="relative flex items-center group ">
                <MdChevronLeft
                    onClick={slideLeft}
                    size={60}
                    className="bg-white left-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                />
                <div
                    id={'slider' + rowId}
                    className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
                >
                    {podcasts.map((item: any, id: number) => (
                        <Podcast key={id} item={item} openOverlay={openOverlay}/>
                    ))}
                </div>
                <MdChevronRight
                    onClick={slideRight}
                    size={60}
                    className="bg-white right-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                />
            </div>
        </div>
    );
};

export default Row;