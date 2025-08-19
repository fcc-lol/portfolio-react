import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { VStack } from "../components/Layout";
import { ProjectSkeleton, Error } from "../components/States";
import {
  Header,
  MediumText,
  HeaderTextContent,
  SmallText
} from "../components/Typography";
import { useTheme } from "../contexts/ThemeContext";
import {
  FADE_TRANSITION,
  ANIMATION_DURATION,
  TRANSFORM_TRANSITION
} from "../constants";

const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const MediaCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  position: relative;
  ${(props) => props.$aspectRatio && `aspect-ratio: ${props.$aspectRatio};`}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: ${(props) =>
      props.$isDarkMode ? "none" : "2px solid rgba(0, 0, 0, 0.1)"};
    pointer-events: none;
    z-index: 1;
    border-radius: 1.5rem;
  }
`;

const HeaderCard = styled(Card)`
  min-height: 10rem;
`;

const Title = styled(Header)`
  hyphens: manual;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid ${(props) => props.theme.border};
`;

const MediaContainer = styled.div`
  width: 100%;
  position: relative;
`;

const FadeInImage = styled.img`
  width: 100%;
  object-fit: cover;
  display: block;
  opacity: ${(props) => {
    // If image was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const FadeInVideo = styled.video`
  width: 100%;
  object-fit: cover;
  display: block;
  opacity: ${(props) => {
    // If video was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const Credits = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1.5rem;
  }
`;

const Credit = styled.div`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
`;

const ProfilePictureImg = styled.img`
  object-fit: cover;
  border-radius: 100%;
  width: 2.5rem;
  height: 2.5rem;
  user-select: none;
  pointer-events: none;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }
`;

const HiddenImage = styled.img`
  display: none;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LinkButton = styled.a`
  display: inline-block;
  color: ${(props) => props.theme.textSecondary};
  text-decoration: underline;
  font-weight: normal;
  transition: color ${ANIMATION_DURATION}ms ease-in-out, ${TRANSFORM_TRANSITION};
  font-size: 1.125rem;

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.textPrimary};
    }
  }

  &:active {
    transform: scale(0.9);
  }
`;

const formatTitle = (title) => {
  if (title.length < 12) {
    return title;
  }

  const name = title;
  const words = name.split(" ");

  // Find the longest word that's suitable for hyphenation
  // Only hyphenate words that are 12+ characters (like "commemorative")
  let longestWordIndex = -1;
  let longestWordLength = 0;

  words.forEach((word, index) => {
    if (word.length > longestWordLength && word.length >= 12) {
      longestWordLength = word.length;
      longestWordIndex = index;
    }
  });

  // If no word is long enough for hyphenation, return original name
  if (longestWordIndex === -1) {
    return name;
  }

  // Calculate position within the longest word to insert soft hyphen
  const word = words[longestWordIndex];
  const wordMidPoint = Math.floor(word.length / 2);

  // Insert soft hyphen in the middle of the longest word
  const modifiedWord =
    word.slice(0, wordMidPoint) + "\u00AD" + word.slice(wordMidPoint);

  // Reconstruct the name with the modified word
  const modifiedWords = [...words];
  modifiedWords[longestWordIndex] = modifiedWord;

  return modifiedWords.join(" ");
};

// Helper function to determine if a URL is a video
const isVideoFile = (url) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

function ProfilePicture({ src, alt, name }) {
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
      />
    </>
  );
}

function MediaItem({ mediaItem, projectName, index }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Handle both old format (string) and new format (object)
  const mediaUrl = typeof mediaItem === "string" ? mediaItem : mediaItem.url;
  const isVideo = isVideoFile(mediaUrl);

  // Check if media was already loaded in this session immediately
  const wasLoadedBefore = mediaUrl ? isImageLoaded(mediaUrl) : false;

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!mediaUrl);
  const imageRef = useRef(null);

  useEffect(() => {
    if (mediaUrl && !isVideo) {
      // If media was already loaded before, trigger fade-in immediately
      if (wasLoadedBefore) {
        // Small delay to ensure fade-in effect is visible
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
        markImageAsLoaded(mediaUrl);
      }
    } else if (mediaUrl && isVideo) {
      // For videos, handle fade-in similarly
      if (wasLoadedBefore) {
        setTimeout(() => setLoaded(true), 50);
      }
    }
  }, [mediaUrl, wasLoadedBefore, markImageAsLoaded, isVideo]);

  const handleMediaLoad = () => {
    setLoaded(true);

    // Mark this media as loaded in the global state
    if (mediaUrl) {
      markImageAsLoaded(mediaUrl);
    }
  };

  if (isVideo) {
    return (
      <MediaContainer>
        <FadeInVideo
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          loaded={loaded}
          shouldAnimate={!!mediaUrl}
          wasLoadedBefore={wasLoadedBefore}
          onLoadedData={handleMediaLoad}
        />
      </MediaContainer>
    );
  }

  return (
    <MediaContainer>
      <HiddenImage
        ref={imageRef}
        src={mediaUrl}
        onLoad={handleMediaLoad}
        alt=""
      />
      <FadeInImage
        src={mediaUrl}
        alt={`${projectName} - ${index + 1}`}
        loaded={loaded}
        shouldAnimate={!!mediaUrl}
        wasLoadedBefore={wasLoadedBefore}
      />
    </MediaContainer>
  );
}

function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dataLoaded, setDataLoaded] = useState(false);
  const { projectId } = useParams();
  const { isDarkMode } = useTheme();
  const { pageVisible } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset data loaded state when projectId changes
    setDataLoaded(false);

    const fetchProject = async () => {
      try {
        const response = await fetch(
          `https://portfolio-api.fcc.lol/projects/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error(error);
        return;
      } finally {
        setLoading(false);
        // Start fade-in after data is loaded
        setTimeout(() => {
          setDataLoaded(true);
        }, 50);
      }
    };

    fetchProject();
  }, [projectId]);

  // Update browser title when project is loaded
  useEffect(() => {
    if (project && project.name) {
      document.title = `FCC Studio – ${project.name}`;
    }
  }, [project]);

  // Combine pageVisible (for fade-out) with dataLoaded (for fade-in timing)
  const visible = pageVisible && dataLoaded;

  if (loading) {
    return (
      <FadeInWrapper visible={false}>
        <ProjectSkeleton mediaItems={project?.media} />
      </FadeInWrapper>
    );
  }

  if (!project) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <FadeInWrapper visible={visible}>
      <VStack>
        <HeaderCard $isDarkMode={isDarkMode}>
          <HeaderTextContent>
            <Title>{formatTitle(project.name)}</Title>
            <MediumText>{project.description}</MediumText>
            {project.links && project.links.length > 0 && (
              <LinksContainer>
                {project.links.map((link, index) => (
                  <LinkButton
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </LinkButton>
                ))}
              </LinksContainer>
            )}
            {project.credits && project.credits.length > 0 && (
              <Credits>
                {project.credits.map((credit, index) => (
                  <Credit key={index} $isDarkMode={isDarkMode}>
                    <ProfilePicture
                      src={credit.profilePictureUrl}
                      alt={credit.name}
                      name={credit.name}
                    />
                    <SmallText>{credit.name}</SmallText>
                    {credit.bio && <SmallText>{credit.bio}</SmallText>}
                  </Credit>
                ))}
              </Credits>
            )}
          </HeaderTextContent>
        </HeaderCard>

        {project.media && (
          <VStack>
            {project.media.map((mediaItem, index) => {
              // Calculate aspect ratio for the card
              const aspectRatio =
                typeof mediaItem === "object" && mediaItem.dimensions
                  ? mediaItem.dimensions.width / mediaItem.dimensions.height
                  : null;

              return (
                <MediaCard
                  key={index}
                  $isDarkMode={isDarkMode}
                  $aspectRatio={aspectRatio}
                >
                  <MediaItem
                    mediaItem={mediaItem}
                    projectName={project.name}
                    index={index}
                  />
                </MediaCard>
              );
            })}
          </VStack>
        )}
      </VStack>
    </FadeInWrapper>
  );
}

export default ProjectPage;
