import { db } from "./firebase";
import { doc, setDoc, increment, updateDoc } from "firebase/firestore";

export const trackEvent = async (eventName: "visits" | "logins" | "clicks_buy" | "clicks_preorder" | "clicks_learnmore") => {
  try {
    const ref = doc(db, "analytics", "global");
    await updateDoc(ref, {
      [eventName]: increment(1),
      lastUpdated: new Date().toISOString()
    });
  } catch (e) {
    // If it fails, create it
    try {
      const ref = doc(db, "analytics", "global");
      await setDoc(ref, {
        visits: 0,
        logins: 0,
        clicks_buy: 0,
        clicks_preorder: 0,
        clicks_learnmore: 0,
        [eventName]: 1,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (inner) {
      console.error("Failed to track event:", inner);
    }
  }
};
