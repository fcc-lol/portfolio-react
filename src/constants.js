// Animation constants
export const ANIMATION_DURATION = 250; // milliseconds

// Animation timing strings for CSS
export const FADE_TRANSITION = `opacity ${ANIMATION_DURATION}ms ease-in-out`;

export const TRANSFORM_TRANSITION = `transform ${ANIMATION_DURATION}ms ease-in-out`;

export const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3109"
    : "https://portfolio-api.fcc.lol";
