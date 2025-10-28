import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { FADE_TRANSITION } from "../constants";

const ProfilePictureContainer = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 100%;
  background-color: ${(props) => props.theme.border};
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

  @media (max-width: 768px) {
    width: ${(props) => {
      if (props.size === "large") return "4rem";
      if (props.size === "medium") return "3rem";
      if (props.size === "small") return "2rem";
      return "2rem"; // default to small
    }};
    height: ${(props) => {
      if (props.size === "large") return "4rem";
      if (props.size === "medium") return "3rem";
      if (props.size === "small") return "2rem";
      return "2rem"; // default to small
    }};
    margin-bottom: ${(props) => (props.size === "large" ? "0" : "0")};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 1;
    border-radius: 100%;
    opacity: ${(props) => (props.$isDarkMode || !props.$loaded ? 0 : 1)};
    transition: ${FADE_TRANSITION};
  }
`;

const ProfilePictureImg = styled.img`
  object-fit: cover;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
  opacity: ${(props) => {
    // If image was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const HiddenImage = styled.img`
  display: none;
`;

function ProfilePicture({ src, alt, name, size = "small" }) {
  const { markImageAsLoaded, isImageLoaded, isDarkMode } = useTheme();

  // If no src provided, try to construct from name
  const imageSrc =
    src || (name ? `/images/people/${name.toLowerCase()}.jpg` : null);

  // Check if image was already loaded in this session immediately
  const wasLoadedBefore = imageSrc ? isImageLoaded(imageSrc) : false;

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!imageSrc);
  const shouldAnimate = !!imageSrc;
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageSrc) {
      // If image was already loaded before, show it using requestAnimationFrame
      if (wasLoadedBefore) {
        requestAnimationFrame(() => {
          setLoaded(true);
        });
        return;
      }

      // Check if it's already loaded in the DOM
      if (
        imageRef.current &&
        imageRef.current.complete &&
        imageRef.current.naturalWidth > 0
      ) {
        setLoaded(true);
        markImageAsLoaded(imageSrc);
      }
    }
  }, [imageSrc, wasLoadedBefore, markImageAsLoaded]);

  const handleImageLoad = () => {
    setLoaded(true);

    // Mark this image as loaded in the global state
    if (imageSrc) {
      markImageAsLoaded(imageSrc);
    }
  };

  const handleImageError = () => {
    // Don't show broken images, just show the container background
    setLoaded(false);
  };

  return (
    <>
      {imageSrc && (
        <HiddenImage
          ref={imageRef}
          src={imageSrc}
          onLoad={handleImageLoad}
          onError={handleImageError}
          alt=""
        />
      )}
      <ProfilePictureContainer
        size={size}
        $isDarkMode={isDarkMode}
        $loaded={loaded}
      >
        {imageSrc && (
          <ProfilePictureImg
            src={imageSrc}
            alt={alt}
            loaded={loaded}
            shouldAnimate={shouldAnimate}
            wasLoadedBefore={wasLoadedBefore}
            onError={handleImageError}
          />
        )}
      </ProfilePictureContainer>
    </>
  );
}

export default ProfilePicture;
