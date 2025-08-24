import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  useParams,
  useOutletContext,
  useNavigate,
  useLocation
} from "react-router-dom";
import Card from "../components/Card";
import { VStack } from "../components/Layout";
import { ProjectSkeleton, Error } from "../components/States";
import {
  Header,
  MediumText,
  HeaderTextContent,
  SmallText
} from "../components/Typography";
import ProfilePicture from "../components/ProfilePicture";
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
    border: 2px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 1;
    border-radius: 1.5rem;
    opacity: ${(props) => (props.$isDarkMode || !props.$mediaLoaded ? 0 : 1)};
    transition: ${FADE_TRANSITION};
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
    gap: 1.125rem;
  }
`;

const Credit = styled.div`
  padding: 0;
`;

const PersonContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  transition: ${TRANSFORM_TRANSITION};

  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PersonName = styled.span`
  font-size: 1.125rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.375;
  color: ${(props) => props.theme.textSecondary};
  transition: color ${ANIMATION_DURATION}ms ease-in-out;

  ${PersonContainer}:hover & {
    color: ${(props) => props.theme.textPrimary};
  }
`;

const LinksAndTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const LinksContainer = styled.div`
  display: contents;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const TagsContainer = styled.div`
  display: contents;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const Tag = styled.button`
  display: inline-block;
  color: ${(props) => props.theme.textSecondary};
  text-decoration: underline;
  font-weight: normal;
  font-size: 1.125rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color ${ANIMATION_DURATION}ms ease-in-out, ${TRANSFORM_TRANSITION};

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.textPrimary};
    }
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Separator = styled.span`
  color: ${(props) => props.theme.textSecondary};
  font-size: 1.125rem;
  font-weight: normal;

  @media (max-width: 768px) {
    display: none;
  }
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

function MediaItem({ mediaItem, projectName, index, onLoad }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Handle both old format (string) and new format (object)
  const mediaUrl = typeof mediaItem === "string" ? mediaItem : mediaItem.url;
  const isVideo = isVideoFile(mediaUrl);

  // Check if media was already loaded in this session immediately
  const wasLoadedBefore = mediaUrl ? isImageLoaded(mediaUrl) : false;

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!mediaUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (mediaUrl && !isVideo) {
      // If media was already loaded before, show it using requestAnimationFrame
      if (wasLoadedBefore) {
        requestAnimationFrame(() => {
          setLoaded(true);
          // Only call onLoad if this was actually previously loaded successfully
          if (onLoad && !hasError) onLoad(index);
        });
        return;
      }
      // For new images, rely on the onLoad/onError handlers
    } else if (mediaUrl && isVideo) {
      // For videos, handle fade-in similarly (videos are less prone to dimension issues)
      if (wasLoadedBefore) {
        requestAnimationFrame(() => {
          setLoaded(true);
          if (onLoad && !hasError) onLoad(index);
        });
      }
      // For new videos, rely on the onLoadedData/onError handlers
    }
  }, [mediaUrl, wasLoadedBefore, isVideo, onLoad, index, hasError]);

  const handleMediaLoadInternal = (event) => {
    // For images, verify it actually loaded successfully
    if (!isVideo && event?.target) {
      const img = event.target;
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        // Image didn't actually load successfully
        handleMediaError();
        return;
      }
    }

    setLoaded(true);

    // Mark this media as loaded in the global state
    if (mediaUrl) {
      markImageAsLoaded(mediaUrl);
    }

    // Only notify parent for border animation if there's no error
    if (onLoad && !hasError) {
      onLoad(index);
    }
  };

  const handleMediaError = () => {
    setHasError(true);
    setLoaded(false); // Don't show broken image
    // Don't notify parent - no border for broken images
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
          onLoadedData={handleMediaLoadInternal}
          onError={handleMediaError}
        />
      </MediaContainer>
    );
  }

  return (
    <MediaContainer>
      <FadeInImage
        src={mediaUrl}
        alt={`${projectName} - ${index + 1}`}
        loaded={loaded}
        shouldAnimate={!!mediaUrl}
        wasLoadedBefore={wasLoadedBefore}
        onLoad={handleMediaLoadInternal}
        onError={handleMediaError}
      />
    </MediaContainer>
  );
}

function ProjectPage() {
  const location = useLocation();
  const prefillData = location.state?.prefillData;

  // Initialize with prefilled data if available, otherwise null
  const [project, setProject] = useState(prefillData || null);
  const [loading, setLoading] = useState(!prefillData); // Not loading if we have prefill data

  const [dataLoaded, setDataLoaded] = useState(false); // Always start false to trigger fade-in animation
  const [loadedMedia, setLoadedMedia] = useState({}); // Track which media items have loaded
  const { projectId } = useParams();
  const { isDarkMode } = useTheme();
  const { pageVisible, contentVisible, handleFadeOut } = useOutletContext();
  const navigate = useNavigate();

  // Handle name click with fade-out animation
  const handleNameClick = (personName) => {
    handleFadeOut(); // This triggers pageVisible = false and setIsNavigating = true

    // Wait for fade-out animation to complete using requestAnimationFrame
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
  };

  // Handle tag click with fade-out animation
  const handleTagClick = (tag) => {
    handleFadeOut(); // This triggers pageVisible = false and setIsNavigating = true

    // Wait for fade-out animation to complete using requestAnimationFrame
    const targetFrames = Math.ceil(ANIMATION_DURATION / 16.67); // ~15 frames at 60fps for 250ms
    let frameCount = 0;

    const waitForAnimation = () => {
      frameCount++;
      if (frameCount >= targetFrames) {
        navigate(`/tag/${tag}`);
      } else {
        requestAnimationFrame(waitForAnimation);
      }
    };

    requestAnimationFrame(waitForAnimation);
  };

  // Handle media load for border animation
  const handleMediaLoad = (mediaIndex) => {
    setLoadedMedia((prev) => ({
      ...prev,
      [mediaIndex]: true
    }));
  };

  useEffect(() => {
    // If we have prefill data, start fade-in immediately using requestAnimationFrame
    if (prefillData) {
      // Use requestAnimationFrame for more reliable timing
      const triggerFadeIn = () => {
        requestAnimationFrame(() => {
          setDataLoaded(true);
        });
      };
      triggerFadeIn();
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(
          `https://portfolio-api.fcc.lol/projects/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data); // This will update/replace the prefilled data with complete data
      } catch (error) {
        console.error(error);
        // If we have prefill data and API fails, keep showing prefill data
        if (!prefillData) {
          return;
        }
      } finally {
        setLoading(false);
        // If we didn't have prefill data, start fade-in after data is loaded
        if (!prefillData) {
          requestAnimationFrame(() => {
            setDataLoaded(true);
          });
        }
      }
    };

    fetchProject();
  }, [projectId, prefillData]);

  // Update browser title when project is loaded
  useEffect(() => {
    if (project && project.name) {
      document.title = `FCC Studio – ${project.name}`;
    }
  }, [project]);

  // Combine both pageVisible and contentVisible (for different fade-out types) with dataLoaded (for fade-in timing)
  const visible = pageVisible && contentVisible && dataLoaded;

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
            {((project.tags && project.tags.length > 0) ||
              (project.links && project.links.length > 0)) && (
              <LinksAndTagsContainer>
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
                {project.links &&
                  project.links.length > 0 &&
                  project.tags &&
                  project.tags.length > 0 && <Separator>·</Separator>}
                {project.tags && project.tags.length > 0 && (
                  <TagsContainer>
                    {project.tags.map((tag, index) => (
                      <Tag key={index} onClick={() => handleTagClick(tag)}>
                        #{tag}
                      </Tag>
                    ))}
                  </TagsContainer>
                )}
              </LinksAndTagsContainer>
            )}
            {project.credits && project.credits.length > 0 && (
              <Credits>
                {project.credits.map((credit, index) => (
                  <Credit key={index} $isDarkMode={isDarkMode}>
                    <PersonContainer
                      onClick={() => handleNameClick(credit.name)}
                    >
                      <ProfilePicture
                        alt={credit.name}
                        name={credit.name}
                        size="small"
                      />
                      <PersonName>{credit.name}</PersonName>
                    </PersonContainer>
                    {credit.bio && <SmallText>{credit.bio}</SmallText>}
                  </Credit>
                ))}
              </Credits>
            )}
          </HeaderTextContent>
        </HeaderCard>

        {project.media && project.media.length > 0 && (
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
                  $mediaLoaded={loadedMedia[index] || false}
                >
                  <MediaItem
                    mediaItem={mediaItem}
                    projectName={project.name}
                    index={index}
                    onLoad={handleMediaLoad}
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
