import * as functions from "firebase-functions";
import { createCanvas, loadImage } from "canvas";
import FastAverageColor = require("fast-average-color");

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

const fac = new FastAverageColor();

export const updateRoomBackgroundColor = functions.database
  .ref("rooms/{roomKey}/currentSong/smallImage")
  .onWrite(async (change) => {
    const imageUrl = change.after.val();
    const img = await loadImage(imageUrl);
    const { width, height } = img;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    const clampedImageRgba = imageData.data;
    const imageRgba = Array.from(clampedImageRgba);
    const [red, green, blue] = fac.getColorFromArray4(imageRgba, {
      algorithm: "simple",
    });

    // Set background color on the room
    change.after.ref.parent?.parent
      ?.child("backgroundColor")
      .set({ red, green, blue });
  });
