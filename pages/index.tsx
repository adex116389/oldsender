import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Textarea,
  Button,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import type { NextPage } from "next";
import Head from "next/head";
import SocketIOClient, { Socket } from "socket.io-client";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FileUpload } from "../components/FileUpload";
import { numbersToArray } from "../utility/numbersToArray";
import { FileContext } from "../context/fileContext";

const schema = yup.object().shape({
  file: yup.mixed(),
  apiKey: yup.string().required(`Please provide a telnyx api key`),
  msgProfileId: yup
    .string()
    .required(`Please provide a telnyx messaging profile id`),
  numbers: yup
    .string()
    .test(
      `numbersLnegth`,
      `Too many numbers, upload a file instead`,
      (numbers) => {
        const numsArr = numbers ? numbersToArray(numbers) : [];

        return numsArr.length < 1000;
      }
    ),
  message: yup.string().required(`Please provide a message to send`),
});

const Home: NextPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { file: uploadedFile } = useContext(FileContext) as FileType;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: `onSubmit`,
  });

  const [messages, setMessages] = useState<string[]>();

  let statuses: string[] = [];

  // useEffect(() => {
  //   const pusher = new Pusher("908bf57448af32f0c002", {
  //     cluster: "mt1",
  //   });

  //   const channel = pusher.subscribe("status");
  //   channel.bind("hook", function (data: { response: string }) {
  //     statuses.push(data.response);
  //     setMessages(statuses);
  //   });
  // });

  let socket: Socket;

  const socketInitializer = async () => {
    await fetch(`/api/socketio`);
    // connect to socket server
    socket = SocketIOClient();

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      // setConnected(true);
    });

    // update chat on new message dispatched
    socket.on("status", (data: { response: string }) => {
      statuses.push(data.response);
      setMessages(statuses);
    });
  };

  useEffect((): any => {
    socketInitializer();

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  });

  const toast = useToast();
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.numbers && !data.file) {
        toast({
          description: "Either provide a file of numbers or enter the numbers",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      const formData = new FormData();
      formData.append(`data`, JSON.stringify(data));
      formData.append(`file`, uploadedFile);

      await fetch("/api/message", {
        method: "POST",
        body: formData,
      });

      // reset();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Box>
      <Head>
        <title>Zubzero Sender</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex p={`50px`} pos={`relative`} flexDir={`column`} minH={`100vh`}>
        <Heading
          color={`black`}
          fontSize={`32px`}
          margin={0}
          textAlign={`center`}
          lineHeight={0.9}
          fontFamily={`didot`}
          pos={`absolute`}
          style={{
            writingMode: `vertical-lr`,
          }}
        >
          Zubzero Sender
        </Heading>
        <Stack spacing={4} px={`20px`} w={`50%`} ml={`20px`}>
          <InputGroup w={`50%`} flexDir={`column`}>
            <InputLeftElement
              pointerEvents="none"
              // eslint-disable-next-line react/no-children-prop
              children={`🔐`}
            />
            <Input
              py={`10px`}
              w={`100%`}
              placeholder="Telnyx API Key"
              borderRadius={0}
              errorBorderColor="crimson"
              isInvalid={errors.apiKey && errors.apiKey.message}
              {...register(`apiKey`)}
            />
            {errors.apiKey && errors.apiKey.message ? (
              <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                {errors.apiKey.message}
              </Text>
            ) : null}
          </InputGroup>
          <InputGroup w={`50%`} flexDir={`column`}>
            <InputLeftElement
              pointerEvents="none"
              // eslint-disable-next-line react/no-children-prop
              children={`💡`}
            />
            <Input
              py={`10px`}
              w={`100%`}
              placeholder="Messaging Profile ID"
              borderRadius={0}
              errorBorderColor="crimson"
              isInvalid={errors.msgProfileId && errors.msgProfileId.message}
              {...register(`msgProfileId`)}
            />
            {errors.msgProfileId && errors.msgProfileId.message ? (
              <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                {errors.msgProfileId.message}
              </Text>
            ) : null}
          </InputGroup>
          <Tabs
            index={tabIndex}
            onChange={(index) => {
              setTabIndex(index);
            }}
          >
            <TabList>
              <Tab _focus={{}}>📞 Numbers</Tab>
              <Tab _focus={{}}>📁 File</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <InputGroup mt={`16px`} flexDir={`column`}>
                  <InputLeftElement
                    pointerEvents="none"
                    // eslint-disable-next-line react/no-children-prop
                    children={`📞`}
                  />
                  {tabIndex === 0 ? (
                    <>
                      <Textarea
                        h={`100px`}
                        w={`100%`}
                        placeholder="Phone numbers..."
                        borderRadius={0}
                        pl={`30px`}
                        resize={`none`}
                        errorBorderColor="crimson"
                        isInvalid={errors.numbers && errors.numbers.message}
                        {...register(`numbers`)}
                      />
                      {errors.numbers && errors.numbers.message ? (
                        <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                          {errors.numbers.message}
                        </Text>
                      ) : null}
                    </>
                  ) : null}
                </InputGroup>
              </TabPanel>
              <TabPanel px={0}>
                {tabIndex === 1 ? (
                  <FileUpload
                    accept={".txt"}
                    // multiple
                    register={register("file")}
                    error={errors.file && errors.file.message}
                  />
                ) : null}
                {errors.file && errors.file.message ? (
                  <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                    {errors.file.message}
                  </Text>
                ) : null}
              </TabPanel>
            </TabPanels>
          </Tabs>
          <InputGroup flexDir={`column`}>
            <InputLeftElement
              pointerEvents="none"
              // eslint-disable-next-line react/no-children-prop
              children={`✍️`}
            />
            <Textarea
              h={`150px`}
              w={`100%`}
              placeholder="Message..."
              borderRadius={0}
              pl={`30px`}
              resize={`none`}
              errorBorderColor="crimson"
              isInvalid={errors.message && errors.message.message}
              {...register(`message`)}
            />
            {errors.message && errors.message.message ? (
              <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                {errors.message.message}
              </Text>
            ) : null}
          </InputGroup>
          {messages ? (
            <ScrollableFeed>
              <Box
                h={`100px`}
                bgColor={`blackAlpha.800`}
                w={`100%`}
                mt={`32px !important`}
                overflowY={`scroll`}
                pos={`relative`}
                p={`10px`}
                px={`20px`}
              >
                {messages ? (
                  <Flex pos={`absolute`} right={`10px`} bottom={`10px`}>
                    <Text mr={`10px`} color={`yellow`}>
                      sent:{" "}
                      {
                        messages.map((message) => message.includes(`sent`))
                          .length
                      }
                    </Text>
                    <Text color={`lightgreen`}>
                      delivered:{" "}
                      {
                        messages.map((message) => message.includes(`delivered`))
                          .length
                      }
                    </Text>
                  </Flex>
                ) : null}
                {messages.map((message, index) => (
                  <Text
                    key={`${message}${index}`}
                    as={`span`}
                    color={
                      message.includes(`sent`)
                        ? `yellow`
                        : message.includes(`delivered`)
                        ? `lightgreen`
                        : message.includes(`fail`)
                        ? `crimson`
                        : `white`
                    }
                  >
                    {message.includes(`sent`) ? (
                      <Text
                        as={`span`}
                        fontSize={`11px`}
                        display={`block`}
                        w={`100%`}
                      >
                        🟡 {message}
                      </Text>
                    ) : message.includes(`delivered`) ? (
                      <Text
                        as={`span`}
                        fontSize={`11px`}
                        display={`block`}
                        w={`100%`}
                      >
                        🟢 {message}
                      </Text>
                    ) : message.includes(`fail`) ? (
                      <Text
                        as={`span`}
                        fontSize={`11px`}
                        display={`block`}
                        w={`100%`}
                      >
                        🔴 {message}
                      </Text>
                    ) : (
                      <Text
                        as={`span`}
                        fontSize={`11px`}
                        display={`block`}
                        w={`100%`}
                      >
                        ⚪ {message}
                      </Text>
                    )}
                  </Text>
                ))}
              </Box>
            </ScrollableFeed>
          ) : null}
          <Box my={`32px !important`}>
            <Button
              leftIcon={<Text as={`span`}>📬</Text>}
              colorScheme="black"
              variant="solid"
              bgColor={`black`}
              color={`white`}
              borderRadius={0}
              minW={`200px`}
              onClick={onSubmit}
            >
              Send
            </Button>
          </Box>
        </Stack>
        <Box
          pos={`absolute`}
          bottom={`20px`}
          fontSize={`12px`}
          color={`gray.500`}
        >
          Built with ❤️ by{" "}
          <Link href={`https://t.me/rocketsmsgateway`}>Rocket</Link> 🚀
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
