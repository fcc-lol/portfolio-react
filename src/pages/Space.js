import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import { VStack } from "../components/Layout";
import { useTheme } from "../contexts/ThemeContext";
import { FADE_TRANSITION } from "../constants";

const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const FadeInImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => {
    // If image was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const imageUrls = [
  "https://static.fcc.lol/studio-photos/IMG_8796.jpeg",
  "https://static.fcc.lol/studio-photos/IMG_8806.jpeg",
  "https://static.fcc.lol/studio-photos/IMG_8813.jpeg"
];

function SpaceImageComponent({ imageUrl, imageKey, imageRef }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Check if image was already loaded in this session immediately
  const wasLoadedBefore = isImageLoaded(imageUrl);

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If image was already loaded before, trigger fade-in with delay
    if (wasLoadedBefore) {
      setTimeout(() => setLoaded(true), 50);
      return;
    }

    // Check if it's already loaded in the DOM
    if (
      imageRef.current &&
      imageRef.current.complete &&
      imageRef.current.naturalWidth > 0
    ) {
      setLoaded(true);
      markImageAsLoaded(imageUrl);
    }
  }, [imageUrl, wasLoadedBefore, markImageAsLoaded, imageRef]);

  const handleImageLoad = () => {
    setLoaded(true);
    markImageAsLoaded(imageUrl);
  };

  return (
    <FadeInImage
      ref={imageRef}
      src={imageUrl}
      alt="Studio photo"
      loaded={loaded}
      shouldAnimate={!!imageUrl}
      wasLoadedBefore={wasLoadedBefore}
      onLoad={handleImageLoad}
    />
  );
}

function SpacePage() {
  const { pageVisible } = useOutletContext();
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);

  return (
    <FadeInWrapper visible={pageVisible}>
      <VStack>
        <Card style={{ padding: "0" }}>
          <SpaceImageComponent
            imageUrl={imageUrls[0]}
            imageKey="image1"
            imageRef={image1Ref}
          />
        </Card>
        <Card style={{ padding: "0" }}>
          <SpaceImageComponent
            imageUrl={imageUrls[1]}
            imageKey="image2"
            imageRef={image2Ref}
          />
        </Card>
        <Card style={{ padding: "0" }}>
          <SpaceImageComponent
            imageUrl={imageUrls[2]}
            imageKey="image3"
            imageRef={image3Ref}
          />
        </Card>
      </VStack>
    </FadeInWrapper>
  );
}

export default SpacePage;
