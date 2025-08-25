import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useOutletContext, useNavigate } from "react-router-dom";
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
import ProfilePicture from "../components/ProfilePicture";
import {
  FADE_TRANSITION,
  ANIMATION_DURATION,
  TRANSFORM_TRANSITION
} from "../constants";

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
  cursor: pointer;
  transition: ${TRANSFORM_TRANSITION}, ${FADE_TRANSITION};

  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);

      @media (max-width: 1024px) {
        transform: scale(1.025);
      }
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

function AboutPage() {
  const { pageVisible, contentVisible, handleFadeOut } = useOutletContext();
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Update browser title
    document.title = "FCC Studio – About";

    // Start fade-in after a short delay to ensure proper animation
    const targetFrames = Math.ceil(50 / 16.67); // ~3 frames for 50ms
    let frameCount = 0;

    const waitForDelay = () => {
      frameCount++;
      if (frameCount >= targetFrames) {
        setDataLoaded(true);
      } else {
        requestAnimationFrame(waitForDelay);
      }
    };

    requestAnimationFrame(waitForDelay);
  }, []);

  // Handle person card click with fade-out navigation
  const handlePersonClick = (personName) => {
    if (handleFadeOut) {
      handleFadeOut(); // Trigger fade-out animation

      // Use requestAnimationFrame for animation timing
      const targetFrames = Math.ceil(ANIMATION_DURATION / 16.67); // ~15 frames at 60fps for 250ms
      let frameCount = 0;

      const waitForAnimation = () => {
        frameCount++;
        if (frameCount >= targetFrames) {
          navigate(`/person/${personName.toLowerCase()}`);
        } else {
          requestAnimationFrame(waitForAnimation);
        }
      };

      requestAnimationFrame(waitForAnimation);
    } else {
      // Fallback for direct navigation
      navigate(`/person/${personName.toLowerCase()}`);
    }
  };

  // Combine both pageVisible and contentVisible (for different fade-out types) with dataLoaded (for fade-in timing)
  const visible = pageVisible && contentVisible && dataLoaded;

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
          <ProfileCard onClick={() => handlePersonClick("Zach")}>
            <ProfilePicture
              src="/images/people/zach.jpg"
              alt="Zach"
              size="large"
            />
            <Subheader>Zach</Subheader>
            <SmallText>
              I'm a curious tinkerer, who learns by doing. I like to work on
              projects that present opportunities to think strategically and
              execute nimbly.
            </SmallText>
          </ProfileCard>
          <ProfileCard onClick={() => handlePersonClick("Dan")}>
            <ProfilePicture
              src="/images/people/dan.jpg"
              alt="Dan"
              size="large"
            />
            <Subheader>Dan</Subheader>
            <SmallText>
              I'm a guy that likes design and code. More to come.
            </SmallText>
          </ProfileCard>
          <ProfileCard onClick={() => handlePersonClick("Leo")}>
            <ProfilePicture
              src="/images/people/leo.jpg"
              alt="Leo"
              size="large"
            />
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
