import type { SVGProps } from "react";
export function AddIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            className="hidden xl:block"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}