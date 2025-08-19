import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { VStack, HStack } from "../components/Layout";
import {
  Header,
  Subheader,
  LargeText,
  SmallText,
  HeaderTextContent
} from "../components/Typography";
import { useTheme } from "../contexts/ThemeContext";
import { FADE_TRANSITION } from "../constants";

const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const ProfileCard = styled(Card)`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 2rem 2rem 3rem 2rem;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ProfilePictureImg = styled.img`
  object-fit: cover;
  border-radius: 100%;
  width: 8rem;
  height: 8rem;
  margin-bottom: 0.5rem;
  user-select: none;
  pointer-events: none;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};

  @media (max-width: 768px) {
    width: 6rem;
    height: 6rem;
    margin-bottom: 0;
  }
`;

const HiddenImage = styled.img`
  display: none;
`;

function ProfilePicture({ src, alt }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Check if image was already loaded in this session immediately
  const wasLoadedBefore = src ? isImageLoaded(src) : false;

  const [loaded, setLoaded] = useState(wasLoadedBefore || !src);
  const [shouldAnimate, setShouldAnimate] = useState(!wasLoadedBefore && src);
  const imageRef = useRef(null);

  useEffect(() => {
    if (src) {
      // If we've seen this image before in this session, don't animate
      if (isImageLoaded(src)) {
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
        markImageAsLoaded(src);
      }
    }
  }, [src, isImageLoaded, markImageAsLoaded]);

  const handleImageLoad = () => {
    setLoaded(true);

    // Mark this image as loaded in the global state
    if (src) {
      markImageAsLoaded(src);
    }
  };

  return (
    <>
      {src && (
        <HiddenImage ref={imageRef} src={src} onLoad={handleImageLoad} alt="" />
      )}
      <ProfilePictureImg
        src={src}
        alt={alt}
        loaded={loaded}
        shouldAnimate={shouldAnimate}
      />
    </>
  );
}

function AboutPage() {
  const { pageVisible } = useOutletContext();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Update browser title
    document.title = "FCC Studio – About";

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
        <Card>
          <HeaderTextContent>
            <Header>
              FCC Studio is a technology and art collective that makes fun
              software and hardware.
            </Header>
            <LargeText>
              We design and build custom products to explore novel ways of
              interacting with electronics.
            </LargeText>
            <Button link="mailto:studio@fcc.lol">Contact us</Button>
          </HeaderTextContent>
        </Card>
        <HStack>
          <ProfileCard>
            <ProfilePicture src="/images/people/zach.jpg" alt="Zach" />
            <Subheader>Zach</Subheader>
            <SmallText>
              I'm a curious tinkerer, who learns by doing. I like to work on
              projects that present opportunities to think strategically and
              execute nimbly.
            </SmallText>
          </ProfileCard>
          <ProfileCard>
            <ProfilePicture src="/images/people/dan.jpg" alt="Dan" />
            <Subheader>Dan</Subheader>
            <SmallText>
              I'm a guy that likes design and code. More to come.
            </SmallText>
          </ProfileCard>
          <ProfileCard>
            <ProfilePicture src="/images/people/leo.jpg" alt="Leo" />
            <Subheader>Leo</Subheader>
            <SmallText>
              I'm a designer, engineer, and artist. I believe design and
              technology should encourage community, equal opportunity, and
              social progress.
            </SmallText>
          </ProfileCard>
        </HStack>
      </VStack>
    </FadeInWrapper>
  );
}

export default AboutPage;
