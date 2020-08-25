import * as functions from "firebase-functions";

const numElementsInObject = (obj: { [key: string]: boolean }) =>
  Object.keys(obj).filter((key) => {
    return key !== "_count" && obj[key] === true;
  }).length;

export const updateNumberOfListeners = functions.database
  .ref("rooms/{roomKey}/listeners")
  .onWrite((change) => {
    const listeners = change.after.val();
    const numberOfListeners = numElementsInObject(listeners);
    return change.after.ref.child("_count").set(numberOfListeners);
  });

export const updateNumberOfDjs = functions.database
  .ref("rooms/{roomKey}/djs")
  .onWrite((change) => {
    const djs = change.after.val();
    const numberOfDjs = numElementsInObject(djs);
    return change.after.ref.child("_count").set(numberOfDjs);
  });
