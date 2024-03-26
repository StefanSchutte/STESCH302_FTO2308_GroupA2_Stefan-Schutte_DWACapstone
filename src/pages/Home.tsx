import { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Row from '../components/Views/Row';
import PodcastInfo from '../components/Views/PodcastInfo.tsx';
import { useShows } from "../services/ShowsContext.tsx";
import {Podcast} from "../types.ts";

/**
 * Home component representing the main page of the application.
 */
function Home(): JSX.Element {
    const { podcasts } = useShows();
    /**
     * Manage the state of whether the overlay is shown or not.
     * Initializes showOverlay state to false and provides a function setShowOverlay to update this state.
     */
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    /**
     * Manage the state of the selected podcast.
     * Initializes selectedPodcast state to null and provides a function setSelectedPodcast to update this state.
     */
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

    /**
     * Function to open the overlay with the selected podcast data.
     * Sets the selected podcast.
     * podcast - The podcast data to display in the overlay.
     */
    const openOverlay = (podcast: Podcast) => {
        setSelectedPodcast(podcast);
        setShowOverlay(true);
    };
    /**
     * Function to close the overlay.
     * Sets showOverlay state to false.
     */
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <div>
            <Hero />
            <Row
                rowId="all-shows"
                title="Browse All Shows"
                podcasts={podcasts}
                openOverlay={openOverlay}
            />
            {showOverlay && selectedPodcast &&
                <PodcastInfo
                    item={selectedPodcast}
                    showOverlay={showOverlay}
                    closeOverlay={closeOverlay}
                />}
        </div>
    );
}

export default Home;