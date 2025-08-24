import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { FADE_TRANSITION } from "../constants";

const ProfilePictureImg = styled.img`
  object-fit: cover;
  border-radius: 100%;
  width: ${(props) => {
    if (props.size === "large") return "8rem";
    if (props.size === "medium") return "4rem";
    if (props.size === "small") return "2.5rem";
    return "2.5rem"; // default to small
  }};
  height: ${(props) => {
    if (props.size === "large") return "8rem";
    if (props.size === "medium") return "4rem";
    if (props.size === "small") return "2.5rem";
    return "2.5rem"; // default to small
  }};
  margin-bottom: ${(props) => (props.size === "large" ? "0.5rem" : "0")};
  user-select: none;
  pointer-events: none;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};

  @media (max-width: 768px) {
    width: ${(props) => {
      if (props.size === "large") return "6rem";
      if (props.size === "medium") return "3rem";
      if (props.size === "small") return "2rem";
      return "2rem"; // default to small
    }};
    height: ${(props) => {
      if (props.size === "large") return "6rem";
      if (props.size === "medium") return "3rem";
      if (props.size === "small") return "2rem";
      return "2rem"; // default to small
    }};
    margin-bottom: ${(props) => (props.size === "large" ? "0" : "0")};
  }
`;

const HiddenImage = styled.img`
  display: none;
`;

function ProfilePicture({ src, alt, name, size = "small" }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // If no src provided, try to construct from name
  const imageSrc =
    src || (name ? `/images/people/${name.toLowerCase()}.jpg` : null);

  // Check if image was already loaded in this session immediately
  const wasLoadedBefore = imageSrc ? isImageLoaded(imageSrc) : false;

  const [loaded, setLoaded] = useState(wasLoadedBefore || !imageSrc);
  const [shouldAnimate, setShouldAnimate] = useState(
    !wasLoadedBefore && imageSrc
  );
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageSrc) {
      // If we've seen this image before in this session, don't animate
      if (isImageLoaded(imageSrc)) {
        setLoaded(true);
        setShouldAnimate(false);
        return;
      }

      // Check if it's already loaded in the DOM
      if (
        imageRef.current &&
        imageRef.current.complete &&
        imageRef.current.naturalWidth > 0
      ) {
        setLoaded(true);
        setShouldAnimate(false);
        markImageAsLoaded(imageSrc);
      }
    }
  }, [imageSrc, isImageLoaded, markImageAsLoaded]);

  const handleImageLoad = () => {
    setLoaded(true);

    // Mark this image as loaded in the global state
    if (imageSrc) {
      markImageAsLoaded(imageSrc);
    }
  };

  return (
    <>
      {imageSrc && (
        <HiddenImage
          ref={imageRef}
          src={imageSrc}
          onLoad={handleImageLoad}
          alt=""
        />
      )}
      <ProfilePictureImg
        src={imageSrc}
        alt={alt}
        loaded={loaded}
        shouldAnimate={shouldAnimate}
        size={size}
      />
    </>
  );
}

export default ProfilePicture;
