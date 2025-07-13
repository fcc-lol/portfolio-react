import React from "react";
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

function AboutPage() {
  return (
    <Page>
      <Container>
        <Navigation />
        <VStack>
          <Card>
            <TextContent>
              <Header>
                We are a technology and art collective that makes fun software
                and hardware.
              </Header>
              <LargeText>We think computing should be fun.</LargeText>
            </TextContent>
          </Card>
          <HStack>
            <Card>
              <TextContent>
                <Subheader>Zach</Subheader>
                <SmallText>
                  I'm a curious tinkerer, who learns by doing. I like to work on
                  projects that present opportunities to think strategically and
                  execute nimbly.
                </SmallText>
              </TextContent>
            </Card>
            <Card>
              <TextContent>
                <Subheader>Dan</Subheader>
                <SmallText>
                  I'm a guy that likes design and code. More to come.
                </SmallText>
              </TextContent>
            </Card>
            <Card>
              <TextContent>
                <Subheader>Leo</Subheader>
                <SmallText>
                  I'm a designer, engineer, and artist. I believe design and
                  technology should encourage community, equal opportunity, and
                  social progress.
                </SmallText>
              </TextContent>
            </Card>
          </HStack>
        </VStack>
      </Container>
    </Page>
  );
}

export default AboutPage;
