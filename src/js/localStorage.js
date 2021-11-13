/**
 * With this Function you are able to save Arrays in local Storage
 * The Array will be compiled to a JSON, which is saved to local Storage
 * @param {String} key - name of the local Key
 * @param {Array} array - Values to save
 */
function saveArrayToLocalStorage(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

/**
 * With this Function you are able to load an Array from local Storage
 * Reads the JSON from Loacalstorage and compile it to an Array
 * @param {String} key - name of the local Key
 * @returns an Array with the Values from Local Storage
 */
function loadArrayFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}