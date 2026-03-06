import { ReactNode } from "react";
import cn from "classnames";

type ContainerProps = {
    children: ReactNode;
    containerSize?: "lg" | "xl";
    additionalClasses?: string;
};

const containerWidths = {
    "lg": "max-w-lg",
    "xl": "max-w-[1500px]"
}

export default function Container({ children, containerSize = "xl", additionalClasses }: ContainerProps) {
    return (
        <div
            className={cn("mx-auto px-8", containerWidths[containerSize], additionalClasses)}
        >
            {children}
        </div>
    );
}
