import clsx from "clsx";
import classes from "./RoundedButton.module.css";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {}

export const RoundedButton = ({ className, ...rest }: Props) => {
  return (
    <button className={clsx(classes.roundedButton, className)} {...rest} />
  );
};
