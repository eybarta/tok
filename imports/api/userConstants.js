export const userOptions = {
    status: [
        {
            label: "פעיל",
            value: "active"
        },
        {
            label: "לא פעיל",
            value: "inactive"
        },
        {
            label: "הלך לפני קורס",
            value: "dropped before course"
        },
        {
            label: "הלך בזמן קורס",
            value: "dropped during course"
        },
        {
            label: "הלך לפני מבחן",
            value: "dropped before test"
        },
        {
            label: "נבחן",
            value: "tested"
        }
    ]
}



function generateUsers(amount) {
    var userstring = [];
    // random number 9 digits
    for (var i = 0; i<amount;i++) {
        let id = Math.floor(Math.random() * 10000000000);
        userstring.push(id);
    }

    return userstring.join(',')

}