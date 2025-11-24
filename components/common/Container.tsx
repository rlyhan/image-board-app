import { ReactNode } from "react";
import cn from "classnames";

type ContainerProps = {
    children: ReactNode;
    additionalClasses?: string;
};

export default function Container({ children, additionalClasses }: ContainerProps) {
    return (
        <div
            className={cn("max-w-[1500px] mx-auto px-8", {
                additionalClasses
            })}
        >
            {children}
        </div>
    );
}
