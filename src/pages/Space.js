import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack } from "../components/Layout";

const FadeInImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: ${(props) =>
    props.shouldAnimate ? "opacity 0.5s ease-in-out" : "none"};
`;

function SpacePage() {
  const [imageLoaded, setImageLoaded] = useState({
    image1: false,
    image2: false,
    image3: false
  });

  const [shouldAnimate, setShouldAnimate] = useState({
    image1: true,
    image2: true,
    image3: true
  });

  const imageRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null)
  };

  useEffect(() => {
    // Check if images are already loaded (cached)
    Object.keys(imageRefs).forEach((key) => {
      const img = imageRefs[key].current;
      if (img && img.complete && img.naturalWidth > 0) {
        setImageLoaded((prev) => ({
          ...prev,
          [key]: true
        }));
        setShouldAnimate((prev) => ({
          ...prev,
          [key]: false
        }));
      }
    });
  }, []);

  const handleImageLoad = (imageKey) => {
    setImageLoaded((prev) => ({
      ...prev,
      [imageKey]: true
    }));
  };

  return (
    <Page>
      <Container>
        <Navigation />
        <VStack>
          <Card style={{ padding: "0" }}>
            <FadeInImage
              ref={imageRefs.image1}
              src="https://static.fcc.lol/studio-photos/IMG_8796.jpeg"
              alt="1"
              loaded={imageLoaded.image1}
              shouldAnimate={shouldAnimate.image1}
              onLoad={() => handleImageLoad("image1")}
            />
          </Card>
          <Card style={{ padding: "0" }}>
            <FadeInImage
              ref={imageRefs.image2}
              src="https://static.fcc.lol/studio-photos/IMG_8806.jpeg"
              alt="1"
              loaded={imageLoaded.image2}
              shouldAnimate={shouldAnimate.image2}
              onLoad={() => handleImageLoad("image2")}
            />
          </Card>
          <Card style={{ padding: "0" }}>
            <FadeInImage
              ref={imageRefs.image3}
              src="https://static.fcc.lol/studio-photos/IMG_8813.jpeg"
              alt="1"
              loaded={imageLoaded.image3}
              shouldAnimate={shouldAnimate.image3}
              onLoad={() => handleImageLoad("image3")}
            />
          </Card>
        </VStack>
      </Container>
    </Page>
  );
}

export default SpacePage;
