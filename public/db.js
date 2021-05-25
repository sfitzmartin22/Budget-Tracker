let db;
let offlineVersion;

const request = indexedDB.open("BudgetDB", offlineVersion || 21);

request.onupgradeneeded = function (e) {
    console.log("Upgrade needed in IndexDB");


const { oldVersion } = e;
const newVersion = e.newVersion || db.version;

console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

db = e.target.result;

if(db.objectStoreNames.length === 0) { 
    db.createObjectStore('BudgetStore', { autoincrement: true});
}
};

request.onerror = function (e) {
    console.log(e.target.errorcode);
}

function checkDatabase() {
    console.log('Checking database');

    let transaction = db.transaction(["BudgetStore"], "readwrite");
    const store = transaction.objectStore("BudgetStore");
    const getAll = store.getAll();

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
            .then((response) => response.json ())
            .then((res) => {
                if (res.length !== 0) {
                    transaction = db.transaction(["BudgetStore"], "readwrite");
                    const currentStore = transaction.objectStore("BudgetStore");
                    currentStore.clear();
                    console.log("Store is cleared!");
                }
            });
        }
    };
}

request.onsuccess = function (e) {
    console.log("success");
    db = e.target.result;

    if (navigator.onLine) {
        console.log("Backend is now online");
        checkDatabase();
    }
};

const saveRecord = (record) => {
    console.log("Save record has been invoked");
    const transaction = db.transaction(["BudgetStore"], "readwrite");
    store.add(record);
};

window.addEventListener("online", checkDatabase);
