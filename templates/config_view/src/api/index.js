import axios from 'axios';

function getCRSFToken() {
    let csrfToken, csrfMatch = document.cookie.match(/csrftoken=(\w+)/)
    if (csrfMatch && csrfMatch.length > 0) {
        csrfToken = csrfMatch[1]
    }
    return csrfToken
}

const apiInstance = axios.create({
    baseURL: `${window.location.origin}/api/`,
    timeout: 1000,
    headers: { "X-CSRFToken": getCRSFToken() }
})

function getCurrentUser() {
    return apiInstance.get(`users/current_user/`);
}

export function getMaps(offset, limit, showOnlyUserMaps) {
    if (showOnlyUserMaps) {
        return getCurrentUser().then(
            response => {
                return apiInstance.get(`maps/?offset=${offset}&limit=${limit}&owner=${response.data.username}`);
            });
    } else
        return apiInstance.get(`maps/?offset=${offset}&limit=${limit}`);
}

export function getMap(mapId) {
    return apiInstance.get('maps/' + mapId);
};

export function getMapsByTitle(offset, limit, title, showOnlyUserMaps) {
    if (showOnlyUserMaps) {
        return getCurrentUser().then(
            response => {
                return apiInstance.get(`maps/?offset=${offset}&limit=${limit}&title__icontains=${title}&owner=${response.data.username}`);
            });
    } else
        return apiInstance.get(`maps/?offset=${offset}&limit=${limit}&title__icontains=${title}`);
}

export function getUsers() {
    return apiInstance.get(`users`);
}

export function postAppInstance(appInstance) {
    return apiInstance.post('appinstance/', appInstance);
};

export function getAppInstance(appInstanceId) {
    return apiInstance.get('appinstance/' + appInstanceId);
};

export function updateAppInstance(id, appInstance) {
    return apiInstance.patch('appinstance/' + id, {
        app_map: appInstance.app_map,
        title: appInstance.title,
        description: appInstance.description,
        config: appInstance.config,
        //access and bookmarks are not supported yet
    });
};