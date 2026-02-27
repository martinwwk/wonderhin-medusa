import React from "react"
import { IconProps } from "types/icon"

const Globe: React.FC<IconProps> = ({ size = 20, color = "currentColor", ...attributes }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...attributes}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <ellipse cx="12" cy="12" rx="4" ry="10" stroke={color} strokeWidth="2" />
    <path d="M2 12h20" stroke={color} strokeWidth="2" />
  </svg>
)

export default Globe
