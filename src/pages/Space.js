import React, { useState } from "react";
import styled from "styled-components";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack } from "../components/Layout";

const FadeInImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

function SpacePage() {
  const [imageLoaded, setImageLoaded] = useState({
    image1: false,
    image2: false,
    image3: false
  });

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
              src="https://static.fcc.lol/studio-photos/IMG_8796.jpeg"
              alt="1"
              loaded={imageLoaded.image1}
              onLoad={() => handleImageLoad("image1")}
            />
          </Card>
          <Card style={{ padding: "0" }}>
            <FadeInImage
              src="https://static.fcc.lol/studio-photos/IMG_8806.jpeg"
              alt="1"
              loaded={imageLoaded.image2}
              onLoad={() => handleImageLoad("image2")}
            />
          </Card>
          <Card style={{ padding: "0" }}>
            <FadeInImage
              src="https://static.fcc.lol/studio-photos/IMG_8813.jpeg"
              alt="1"
              loaded={imageLoaded.image3}
              onLoad={() => handleImageLoad("image3")}
            />
          </Card>
        </VStack>
      </Container>
    </Page>
  );
}

export default SpacePage;
