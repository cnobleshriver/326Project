import PouchDB from "pouchdb";

const db = new PouchDB("users");

export async function saveUser(name, userdata) {
    await db.put({ _id: name, userdata });
}

// unlike the other functions doc is a pouchdb object
export async function modifyUser(doc) {
    await db.put(doc);
}

export async function getUser(name) {
    const user = await db.get(name);
    return user;
}

  export async function removeUser(name) {
    db.remove(name);
}