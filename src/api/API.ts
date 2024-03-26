/**
 * Fetches data from API endpoint that provides details of a specific show based on its ID.
 * Accepts an itemId parameter - the ID of the show whose details are to be fetched.
 * Uses fetch to make an HTTP GET request to the URL.
 * Dynamic part of the URL represents the ID of the show.
 * Awaits the response from the API using await response.json() to parse the response body as JSON.
 * If the response is not successful, it throws an error with the message.
 * Returns the fetched data as an array if the fetch operation is successful, otherwise, it returns an empty array.
 */
const getShowDetailFromApi = async (itemId: string): Promise<any[]> => {

    try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${itemId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch shows');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Fetches data from API endpoint that provides a list of shows.
 * Uses the fetch API to make an HTTP GET request to the URL.
 * Awaits the response from the API, which parses the response body as JSON.
 * If the response is not successful, it throws an error.
 * Returns the fetched data as an array if the fetch operation is successful, otherwise, it returns an empty array.
 */
const getShowsFromAPI = async (): Promise<any[]> => {
    try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
            throw new Error('Failed to fetch shows');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export {
    getShowsFromAPI,
    getShowDetailFromApi
};