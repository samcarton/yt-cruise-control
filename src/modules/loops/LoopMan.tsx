import { RoundedButton } from "../../components/buttons/RoundedButton";
import { newLoop } from "./loop";
import { useLoopState } from "./useLoopState";

interface Props {
  videoUrl: string;
}
export const LoopMan = ({ videoUrl }: Props) => {
  const { loopCollection, addLoop } = useLoopState({ videoUrl });
  return (
    <>
      <RoundedButton
        onClick={() =>
          addLoop(newLoop({ name: `Loop ${loopCollection.loops.length + 1}` }))
        }
      >
        New Loop
      </RoundedButton>
      {loopCollection.loops.map((l) => (
        <div key={l.id}>{l.name || l.id}</div>
      ))}
    </>
  );
};
