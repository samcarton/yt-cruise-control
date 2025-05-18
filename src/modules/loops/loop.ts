import { uuidv4 } from "../utils/uuid";

export interface loop {
  start?: number;
  end?: number;
  name?: string;
  id: string;
}

export const newLoop = (loop: Partial<loop> = {}): loop => {
  return {
    id: uuidv4(),
    ...loop,
  };
};
