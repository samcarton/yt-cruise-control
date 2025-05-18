import { useState } from "react";
import type { loop } from "./loop";
import type { loopCollection } from "./loopCollection";
import { loopStore } from "./loopStore";

interface Props {
  videoUrl: string;
}

export const useLoopState = ({ videoUrl }: Props) => {
  const [loopCollection, setLoopCollection] = useState<loopCollection>(
    loopStore.getLoopCollection(videoUrl),
  );

  const mutateLoopCollection = (
    mutateFn: (prev: loopCollection) => loopCollection,
  ) => {
    const newLoopCollection = mutateFn(loopCollection);
    setLoopCollection(newLoopCollection);
    loopStore.setLoopCollection(videoUrl, newLoopCollection);
  };

  const addLoop = (newLoop: loop) => {
    mutateLoopCollection((prev) => {
      const existingLoop = prev.loops.find((loop) => loop.id === newLoop.id);
      if (existingLoop) {
        console.error("Loop with this ID already exists:", newLoop.id);
        return prev;
      }
      return {
        ...prev,
        loops: [...prev.loops, newLoop],
      };
    });
  };

  const updateLoop = (updatedLoop: Partial<loop>) => {
    mutateLoopCollection((prev) => {
      const loopIndex = prev.loops.findIndex(
        (loop) => loop.id === updatedLoop.id,
      );
      if (loopIndex === -1) {
        console.error("Loop not found:", updatedLoop.id);
        return prev;
      }
      const updatedLoops = [...prev.loops];
      updatedLoops[loopIndex] = { ...updatedLoops[loopIndex], ...updatedLoop };
      return {
        ...prev,
        loops: updatedLoops,
      };
    });
  };

  const removeLoop = (loopId: string) => {
    mutateLoopCollection((prev) => ({
      ...prev,
      loops: prev.loops.filter((loop) => loop.id !== loopId),
    }));
  };

  return { loopCollection, addLoop, removeLoop, updateLoop };
};
