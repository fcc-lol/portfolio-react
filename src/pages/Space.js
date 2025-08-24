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

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 200px; /* Fallback for older browsers */
  overflow: hidden;
  position: relative;
  background: ${(props) => props.theme.cardBackground};

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
    border-radius: 1.5rem;
    opacity: ${(props) => (props.$isDarkMode || !props.loaded ? 0 : 1)};
    transition: ${FADE_TRANSITION};
  }
`;

const FadeInImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const imageUrls = [
  "https://static.fcc.lol/studio-photos/IMG_8796.jpeg",
  "https://static.fcc.lol/studio-photos/IMG_8806.jpeg",
  "https://static.fcc.lol/studio-photos/IMG_8813.jpeg"
];

function SpaceImageComponent({ imageUrl, imageKey, imageRef }) {
  const { markImageAsLoaded, isDarkMode } = useTheme();
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
    markImageAsLoaded(imageUrl);
  };

  return (
    <ImageContainer $isDarkMode={isDarkMode} loaded={loaded}>
      <FadeInImage
        ref={imageRef}
        src={imageUrl}
        alt="Studio photo"
        loaded={loaded}
        onLoad={handleImageLoad}
      />
    </ImageContainer>
  );
}

function SpacePage() {
  const { pageVisible, contentVisible } = useOutletContext();
  const [dataLoaded, setDataLoaded] = useState(false);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);

  useEffect(() => {
    // Update browser title
    document.title = "FCC Studio – Space";

    // Show content immediately - we know the layout
    setDataLoaded(true);
  }, []);

  // Show immediately - no need to wait for complex state dependencies
  const visible = true;

  return (
    <FadeInWrapper visible={visible}>
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
