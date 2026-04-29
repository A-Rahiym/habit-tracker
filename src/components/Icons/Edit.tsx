import type { SVGProps } from "react";
  export function EditIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg " aria-hidden="true" {...props}>
        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }