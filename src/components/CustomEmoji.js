import React from "react";
import {
  TabList,
  Tab,
  Tabs,
  TabPanel,
  Box,
  TabPanels,
  CloseButton,
  Grid,
  Image,
} from "@chakra-ui/core";
import { FaRegSmile, FaGithub } from "react-icons/fa";

const customData = [
  {
    id: "github",
    icon: FaGithub,
    emojis: [
      {
        imageUrl:
          "https://github.githubassets.com/images/icons/emoji/octocat.png",
        name: "octocat",
      },
    ],
  },
  {
    id: "face",
    icon: FaRegSmile,
    emojis: [
      {
        name: "funny",
        imageUrl:
          "https://tb2.bdstatic.com/tb/editor/images/face/i_f25.png?t=20140803",
      },
    ],
  },
];

function CustomEmoji({ onChange, onClose }) {
  return (
    <Box
      maxWidth={"2xs"}
      border="1px"
      borderRadius="md"
      borderColor="gray.100"
      pb={2}
      position="relative"
      style={{
        backdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <CloseButton
        position="absolute"
        right={0}
        top={0}
        onClick={onClose}
      ></CloseButton>
      <Tabs variant="enclosed" variantColor="teal">
        <TabList>
          {customData.map((category) => {
            return (
              <Tab key={category.id}>
                <Box as={category.icon}></Box>
              </Tab>
            );
          })}
        </TabList>
        <TabPanels mt={2}>
          {customData.map((category) => {
            return (
              <TabPanel key={category.id} px={2}>
                <Grid templateColumns="repeat(5, 1fr)" gap={1}>
                  {category.emojis.map((emoji) => {
                    return (
                      <Image
                        key={emoji.name}
                        data-id={emoji.name}
                        data-category={category.id}
                        size={"48px"}
                        src={emoji.imageUrl}
                        onClick={(e) => {
                          console.log("Image");
                          onChange(emoji);
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      ></Image>
                    );
                  })}
                </Grid>
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default CustomEmoji;
