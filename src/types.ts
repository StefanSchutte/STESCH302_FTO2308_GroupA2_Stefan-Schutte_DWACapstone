/**
 * Represents podcast entity with properties such as ID, image URL, title, last updated date, description, genres, and number of seasons.
 * This interface is used to define the structure of podcast objects in the application.
 */
export interface Podcast {
    id: string,
    image: string;
    title: string;
    updated: string;
    description: string;
    genres: string;
    seasons: number;
}

/**
 * Represents a user entity with properties including ID and optional email.
 * Used to model user data within the authentication system of the application.
 */
export interface User {
    id: string;
    email?: string;
}

/**
 * Defines the shape of the authentication context, which includes methods for signing up, logging in, logging out, and accessing the current user.
 * Used in the authentication context provider to ensure consistency in method signatures and user access.
 */
export interface AuthContextType {
    signUp: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    user: User | null;
}

/**
 * Represents a favorite podcast entity, including properties like ID, image URLs, titles, saved date, MP3 file URL, and season titles.
 * Used to define the structure of favorite podcast objects stored in the application.
 */
export interface PodcastFavorite {
    id: string;
    image: string;
    title: string;
    season_id: string;
    season_image: string;
    season_title: string;
    episode_title: string;
    date_saved: string;
    mp3_file: string;
    seasons_titles: SeasonTitle[];
}
export interface FavoriteData {
    season_id: string;
    episode_title: string;
    season_title: string;
    season_image: string;
    date_saved: string;
    mp3_file: string;
    seasons_titles: SeasonTitle[]; // Assuming SeasonTitle is another type you've defined
}

/**
 * Defines the structure of a season title object.
 * Nested within the PodcastFavorite interface to represent the titles of different seasons.
 */
interface SeasonTitle {
    title: string;

}

/**
 * Specifies the props expected by the overlay component, including the item to display, visibility status,
 * a callback to close the overlay, and an optional callback for saving episodes.
 * Provides a consistent interface for passing data and functions to the overlay component, ensuring interoperability and ease of use.
 */
export interface OverlayProps {
    item: {
        id: string,
        image: string;
        title: string;
        updated: string;
        description: string;
        genres: string;
        seasons: number;
    };
    showOverlay: boolean;
    closeOverlay: () => void;
    onSave?: (episodeId: string, seasonId: string | null) => void;
}