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
  overflow: hidden;
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
  const { markImageAsLoaded } = useTheme();
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
    markImageAsLoaded(imageUrl);
  };

  return (
    <ImageContainer>
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
  const { pageVisible } = useOutletContext();
  const [dataLoaded, setDataLoaded] = useState(false);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);

  useEffect(() => {
    // Start fade-in after a short delay to ensure proper animation
    setTimeout(() => {
      setDataLoaded(true);
    }, 50);
  }, []);

  // Combine pageVisible (for fade-out) with dataLoaded (for fade-in timing)
  const visible = pageVisible && dataLoaded;

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
