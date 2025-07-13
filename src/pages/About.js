import React from "react";
import styled from "styled-components";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack, HStack } from "../components/Layout";
import {
  Header,
  Subheader,
  LargeText,
  SmallText,
  TextContent
} from "../components/Typography";

const ProfileCard = styled(Card)`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 2rem 2rem 3rem 2rem;
  gap: 0.5rem;
`;

const ProfilePicture = styled.img`
  object-fit: cover;
  border-radius: 100%;
  width: 8rem;
  height: 8rem;
  margin-bottom: 0.5rem;
  user-select: none;
  pointer-events: none;
`;

function AboutPage() {
  return (
    <Page>
      <Container>
        <Navigation />
        <VStack>
          <Card>
            <TextContent style={{ padding: "1.5rem 2rem" }}>
              <Header>
                FCC Studio is a technology and art collective that makes fun
                software and hardware.
              </Header>
              <LargeText>
                We design and build custom products to explore novel ways of
                interacting with computers.
              </LargeText>
            </TextContent>
          </Card>
          <HStack>
            <ProfileCard>
              <ProfilePicture src="/images/zach.jpg" alt="Zach" />
              <Subheader>Zach</Subheader>
              <SmallText>
                I'm a curious tinkerer, who learns by doing. I like to work on
                projects that present opportunities to think strategically and
                execute nimbly.
              </SmallText>
            </ProfileCard>
            <ProfileCard>
              <ProfilePicture src="/images/dan.jpg" alt="Dan" />
              <Subheader>Dan</Subheader>
              <SmallText>
                I'm a guy that likes design and code. More to come.
              </SmallText>
            </ProfileCard>
            <ProfileCard>
              <ProfilePicture src="/images/leo.jpg" alt="Leo" />
              <Subheader>Leo</Subheader>
              <SmallText>
                I'm a designer, engineer, and artist. I believe design and
                technology should encourage community, equal opportunity, and
                social progress.
              </SmallText>
            </ProfileCard>
          </HStack>
        </VStack>
      </Container>
    </Page>
  );
}

export default AboutPage;
