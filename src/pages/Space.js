import React from "react";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack } from "../components/Layout";

function SpacePage() {
  return (
    <Page>
      <Container>
        <Navigation />
        <VStack>
          <Card style={{ padding: "0" }}>
            <img
              src="https://static.fcc.lol/studio-photos/IMG_8796.jpeg"
              alt="1"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>
          <Card style={{ padding: "0" }}>
            <img
              src="https://static.fcc.lol/studio-photos/IMG_8806.jpeg"
              alt="1"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>
          <Card style={{ padding: "0" }}>
            <img
              src="https://static.fcc.lol/studio-photos/IMG_8813.jpeg"
              alt="1"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>
        </VStack>
      </Container>
    </Page>
  );
}

export default SpacePage;
