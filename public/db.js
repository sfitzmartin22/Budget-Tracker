const request = indexedDB.open("BudgetDB", 1);
let db;

request.onupgradeneeded = ({ target }) => {
    console.log("Upgrade needed in IndexDB");
const db = target.result;
db.createObjectStore('pending', { autoincrement: true});
};

request.onsuccess = ({ target }) => {
    db = target.result;
  
    // check if app is online before reading from db
    if (navigator.onLine) {
      checkDatabase();
    }
  };


function checkDatabase() {
    console.log('Checking database');

    let transaction = db.transaction("pending", "readwrite");
    let store = transaction.objectStore("pending");
    let getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", { 
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                }, 
            })
            .then((response => response.json ())
            .then((res) => {
                if (res.length !== 0) {
                   let transaction = db.transaction("pending", "readwrite");
                   let store = transaction.objectStore("pending");
                    store.clear();
                    console.log("Store is cleared!");
                };
            })
            )
    };


    }
}


const saveRecord = (record) => {
    console.log("Save record has been invoked");
    let transaction = db.transaction("pending", "readwrite");
    let store = transaction.objectStore("pending");
    store.add(record);
};

window.addEventListener("online", checkDatabase);
