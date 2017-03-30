import * as types from './mutation-types.js';


// UTIL
export const downloadCSV = async ({commit}, csv) => {
    console.log("IN DOWNLOAD CSV >> ", csv)
    return new Promise((resolve, reject) => {
        let blob = new Blob([csv]), a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
        a.download = "users.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        resolve();
    });
}

// POPUP
export const closePopup = ({commit}) => {
    commit('CLOSE_POPUP')
}
export const callPopup = ({commit}, data) => {
    console.log("CALL POPUP >> data: ", data);
    commit('CALL_POPUP', data)
}

