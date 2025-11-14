import { ReactNode } from "react";
import cn from "classnames";

type ContainerProps = {
    children: ReactNode;
    flex?: boolean;
};

export default function Container({ children, flex }: ContainerProps) {
    return (
        <div
            className={cn("max-w-[1500px] mx-auto px-8", {
                "flex gap-4": flex,
            })}
        >
            {children}
        </div>
    );
}
