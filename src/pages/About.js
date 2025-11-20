import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faYoutube,
  faTwitch,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faUser } from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import { VStack } from "../components/Layout";
import {
  Header,
  Subheader,
  LargeText,
  SmallText,
  HeaderTextContent
} from "../components/Typography";
import { Link } from "../components/Link";
import ProfilePicture from "../components/ProfilePicture";
import { FadeInWrapper } from "../components/AnimationHelpers";
import { ANIMATION_DURATION } from "../constants";

const AboutHeader = styled(Header)`
  padding-right: 12rem;

  @media (max-width: 1024px) {
    padding-right: 0;
  }
`;

const AboutHeaderLargeText = styled(LargeText)`
  padding-right: 5rem;

  @media (max-width: 768px) {
    padding-right: 0;
  }

  a {
    color: ${(props) => props.theme.textPrimary};
    text-decoration: underline;
    font-weight: normal;
    transition: color ${ANIMATION_DURATION}ms ease-in-out;
    cursor: pointer;

    @media (hover: hover) {
      &:hover {
        color: ${(props) => props.theme.textSecondary};
      }
    }

    &:active {
      color: ${(props) => props.theme.textTertiary};
    }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProfileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProfileCard = styled(Card)`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  padding: 2rem 2rem 2.5rem 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1.5rem;
  }
`;

const ProfilePictureAndNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1.5rem;
  }
`;

const Name = styled(Subheader)`
  @media (max-width: 768px) {
    margin: 0 0 0.125rem 0;
  }
`;

const Description = styled(SmallText)`
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const ProfileLinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
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
            <AboutHeader>
              FCC Studio is a technology and art collective that makes fun
              software and hardware.
            </AboutHeader>
            <AboutHeaderLargeText>
              We love to explore novel ways of
              interacting with electronics. For updates,{" "}
              <a
                href="https://forms.gle/J8rMgwjYFKZNyqnE9"
                target="_blank"
                rel="noopener noreferrer"
              >
                join our newsletter
              </a>!
            </AboutHeaderLargeText>
            <LinksContainer>
              <Link
                href="https://github.com/fcc-lol"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faGithub} />
                GitHub
              </Link>
              <Link
                href="https://youtube.com/@fcc-lol"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faYoutube} />
                YouTube
              </Link>
              <Link
                href="https://twitch.tv/fcclol"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faTwitch} />
                Twitch
              </Link>
              <Link
                href="https://www.instagram.com/fcclol/"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faInstagram} />
                Instagram
              </Link>
              <Link href="mailto:studio@fcc.lol" noUnderline>
                <FontAwesomeIcon icon={faEnvelope} />
                Email
              </Link>
            </LinksContainer>
          </HeaderTextContent>
        </Card>
        <ProfileCardsContainer>
          <ProfileCard>
            <ProfileInfo>
              <ProfilePictureAndNameContainer>
                <ProfilePicture
                  src="/images/people/zach.jpg"
                  alt="Zach"
                  size="large"
                />
                <Name>Zach</Name>
              </ProfilePictureAndNameContainer>
              <Description>
                I'm a curious tinkerer, who learns by doing. I like to work on
                projects that present opportunities to think strategically and
                execute nimbly.
              </Description>
            </ProfileInfo>
            <ProfileLinksContainer>
              <Link onClick={() => handlePersonClick("Zach")} noUnderline>
                <FontAwesomeIcon icon={faUser} />
                Projects
              </Link>
              <Link
                href="https://zach.coffee"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faLink} />
                Portfolio
              </Link>
            </ProfileLinksContainer>
          </ProfileCard>
          <ProfileCard>
            <ProfileInfo>
              <ProfilePictureAndNameContainer>
                <ProfilePicture
                  src="/images/people/dan.jpg"
                  alt="Dan"
                  size="large"
                />
                <Name>Dan</Name>
              </ProfilePictureAndNameContainer>
              <Description>
                I'm a guy that likes design and code. More to come.
              </Description>
            </ProfileInfo>
            <ProfileLinksContainer>
              <Link onClick={() => handlePersonClick("Dan")} noUnderline>
                <FontAwesomeIcon icon={faUser} />
                Projects
              </Link>
              <Link
                href="https://danzaharia.com"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faLink} />
                Portfolio
              </Link>
            </ProfileLinksContainer>
          </ProfileCard>
          <ProfileCard>
            <ProfileInfo>
              <ProfilePictureAndNameContainer>
                <ProfilePicture
                  src="/images/people/leo.jpg"
                  alt="Leo"
                  size="large"
                />
                <Name>Leo</Name>
              </ProfilePictureAndNameContainer>
              <Description>
                I'm a designer, engineer, and artist. I believe design and
                technology should encourage community, equal opportunity, and
                social progress.
              </Description>
            </ProfileInfo>
            <ProfileLinksContainer>
              <Link onClick={() => handlePersonClick("Leo")} noUnderline>
                <FontAwesomeIcon icon={faUser} />
                Projects
              </Link>
              <Link
                href="https://leo.gd"
                target="_blank"
                rel="noopener noreferrer"
                noUnderline
              >
                <FontAwesomeIcon icon={faLink} />
                Portfolio
              </Link>
            </ProfileLinksContainer>
          </ProfileCard>
        </ProfileCardsContainer>
      </VStack>
    </FadeInWrapper>
  );
}

export default AboutPage;
