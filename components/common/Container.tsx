import { ReactNode } from "react";
import cn from "classnames";

type ContainerProps = {
    children: ReactNode;
    containerSize?: "medium" | "large";
    additionalClasses?: string;
};

const containerWidths = {
    "medium": "max-w-[1000px]",
    "large": "max-w-[1500px]"
}

export default function Container({ children, containerSize = "large", additionalClasses }: ContainerProps) {
    return (
        <div
            className={cn("mx-auto px-8", containerWidths[containerSize], additionalClasses)}
        >
            {children}
        </div>
    );
}
