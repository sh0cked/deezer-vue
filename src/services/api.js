import flattendeep from 'lodash.flattendeep';
import shuffle from 'lodash.shuffle';
import { serializeGetParams, eventBus } from '../utils/utils';

const API_URL = 'https://api.deezer.com';

export const fetchAlbumById = id => jsonp(`album/${id}`);

export const fetchAlbumTracks = id => jsonp(`album/${id}/tracks`);

export const fetchArtistById = (artistId = '') => jsonp(`artist/${artistId}`);

export const fetchPlaylistById = id => jsonp(`playlist/${id}`);

export const fetchPlaylistTracks = id => jsonp(`playlist/${id}/tracks`);

export const fetchTrackById = trackId => jsonp(`track/${trackId}`);

export const fetchEditoralTracks = () => jsonp(`editorial/132/selection`);

export const search = (query, params) =>
  jsonp('search', { q: query, ...params }).then(result =>
    result.data.slice(0, 8)
  );

export const fetchDeezerTop = (page = 1, perPage = 60) =>
  jsonp('chart', { index: (page - 1) * perPage, limit: perPage} );

export const getGenres = (genreId = '') =>
  jsonp(`editorial/${genreId}`).then(result => result.data);

export const fetchArtistTracks = async artistId => {
  const artistInfo = await fetchArtistById(artistId);
  const artistTracks = await jsonp(`artist/${artistInfo.id}/top?limit=50`);
  return artistTracks.data;
};

// Fetch 20 artist of genre and then fetch 3 tracks of each artist and shuffle result
export const getGenreTracks = async genreId => {
  const result = await jsonp(`genre/${genreId}/artists`);
  const artists = result.data.slice(0, 20);
  const promises = artists.map(async artist => {
    const artistTracks = await jsonp(`artist/${artist.id}/top?limit=3`);
    return artistTracks.data;
  });
  const tracks = await Promise.all(promises);
  return shuffle(flattendeep(tracks));
};

export const getGenreArtists = (genreId, limit = 10) =>
  jsonp(`genre/${genreId}/artists?limit=${limit}`).then(result => result.data);

export function jsonp(url, params = {}) {
  return new Promise((resolve, reject) => {
    const JSONP_FAIL_TIMEOUT = 15000;
    const requestUrl = `${API_URL}/${url}`;
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    const requestParams = Object.assign({}, params, {
      callback: callbackName,
      output: 'jsonp',
    });
    const script = document.createElement('script');
    const symbol = requestUrl.indexOf('?') >= 0 ? '&' : '?';
    let timeout;
    const finalUrl = `${requestUrl}${symbol}${serializeGetParams(
      requestParams
    )}`;
    script.src = finalUrl;
    window[callbackName] = data => {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
      clearTimeout(timeout);
    };
    timeout = setTimeout(() => {
      eventBus.$emit('showSnackbar', `Request timeout for ${finalUrl}`);
      reject('JSONP timeout error');
    }, JSONP_FAIL_TIMEOUT);
    document.body.appendChild(script);
  });
}
