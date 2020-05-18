export const axios = require('axios').default;

export const authorize = (): void => {
    const client_id = '46a4013a359b407a833bb4909c8d792c';
    const response_type = 'token';
    const redirect_uri = 'http:%2F%2Flocalhost:3000%2Fspotify-callback';
    window.location.href = 'https://accounts.spotify.com/authorize' + '?client_id=' + client_id + 
    '&response_type=' + response_type + '&redirect_uri=' + redirect_uri; 
 
};

export const configure = () => {
  };

export const unauthorize = (): void => {

};

export const isAuthorized = (): void => {

};

