import type { loop } from "./loop";
import type { loopCollection } from "./loopCollection";

const memoryStorage: Record<string, string> = {};

const localStoragePolyfill = {
  setItem: (key: string, value: string) => {
    memoryStorage[key] = value;
  },
  getItem: (key: string) => {
    return memoryStorage[key] || null;
  },
  removeItem: (key: string) => {
    delete memoryStorage[key];
  },
  clear: () => {
    Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
  },
};

const storage =
  typeof localStorage !== "undefined" ? localStorage : localStoragePolyfill;

const getLoopCollectionKey = (videoUrl: string) => {
  return `loopCollection__${videoUrl}`;
};

const setLoopCollection = (
  videoUrl: string,
  loopCollection: loopCollection,
) => {
  storage.setItem(
    getLoopCollectionKey(videoUrl),
    JSON.stringify(loopCollection),
  );
};

const getLoopCollection = (videoUrl: string): loopCollection => {
  const item = storage.getItem(getLoopCollectionKey(videoUrl));
  if (!item) {
    return { loops: [] };
  }
  try {
    const parsedItem = JSON.parse(item);
    if (
      !parsedItem ||
      typeof parsedItem !== "object" ||
      !Array.isArray(parsedItem.loops)
    ) {
      throw new Error("Invalid loop collection format");
    }
    return parsedItem as loopCollection;
  } catch (error) {
    console.error("Error parsing loop collection from localStorage:", error);
    return { loops: [] };
  }
};

export const loopStore = {
  setLoopCollection: setLoopCollection,
  getLoopCollection: getLoopCollection,
};
