'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Box,
  Flex,
  Text,
  useDisclosure,
  Heading,
  VStack,
  HStack,
  Stack,
  Avatar,
  Grid,
  GridItem,
  AvatarBadge,
  Card,
  CardBody,
  StackDivider,
  CardHeader,
  Divider,
  Container,
} from '@chakra-ui/react'
import NavBar from './util/NavBar';
import { UserType } from '../../../../types/clientSchemas';
import { UserUnpopulatedType } from '../../../../types/clientSchemas/userUnpopulated';
import { DirectMessageSchemaType } from '../../../../types/clientSchemas/messages';
import { pusherClient } from '@/lib/pusher';
import { KeyboardEvent, useEffect, useState } from 'react';
import { toPusherKey } from '@/lib/toPusherKey';
import { sortObjectIds } from '@/lib/sortObjectId';
import MessageService from '@/app/_services/messageService';
import { CreateMessageSchemaType } from '../../../../types/clientSchemas/messages';
import { dateFormatter } from '@/lib/dateFormatter';
import ChatMessage from './util/ChatMessage';
import { pusherDirectMessageChannelName, DirectMessageEvents } from '../../../../types/pusher';

interface DirectMessageChatProps {
  user: UserType;
  friend?: UserUnpopulatedType;
  messages: DirectMessageSchemaType[];
  handleNewMessage: (message: DirectMessageSchemaType) => void;
}

interface ChatWindowProps {
  messages: DirectMessageSchemaType[];
  friend: UserUnpopulatedType;
  user: UserType;
}

const ChatWindow = (props: ChatWindowProps) => {
  const { messages, friend, user } = props;
  const [value, setValue] = useState("");

  const onKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.length >= 1) {
        const data: CreateMessageSchemaType = {
          type: "PRIVATE",
          senderId: user.id,
          receiverId: friend._id,
          content: value
        }
        const res =  await MessageService.create(data)
        if (res.success) {
          setValue("");
        }
      }
    }
  }

  return (
    <Box height="94vh" backgroundColor="#2E3036">
      <Box height="90%">
        <VStack alignItems="flex-start">
          { messages.map(message => {
            return (
              <ChatMessage key={message._id} message={message} />
            )
          }) }
        </VStack>
      </Box>
      <Box height="10%" display="flex" alignItems="flex-end">
        <Input 
          color="gray.200"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          value={value} 
          placeholder={`Message @${friend.username}`} 
          size="lg" 
        />
      </Box>
    </Box>
  )
}

export default function DirectMessageChat(props: DirectMessageChatProps) {
  const { user, friend, messages, handleNewMessage } = props;

  useEffect(() => {
    if (friend) {
      pusherClient.subscribe(pusherDirectMessageChannelName(user.id, friend._id));
      console.log("connected to channel ", pusherDirectMessageChannelName(user.id, friend._id))
      const messageHandler = (message: DirectMessageSchemaType) => {
        console.log("EVENT CALLED", message);
        handleNewMessage(message);
      }

      pusherClient.bind(DirectMessageEvents.Incoming, messageHandler);

      return () => {
        pusherClient.unsubscribe(pusherDirectMessageChannelName(user.id, friend._id));
        pusherClient.unbind(DirectMessageEvents.Incoming, messageHandler);
      }
    }


  }, [user, friend, handleNewMessage])

  if (!friend) {
    return (
      <Box>
        <Heading>Loading...</Heading>
      </Box>
    )
  }
  return (
    <Box>
      <NavBar>
        <Avatar size="xs" name={friend.username}>
          <AvatarBadge boxSize="1em" bg="green.500" />
        </Avatar>
        <Text fontSize="sm" color="white">{friend.username}</Text>
      </NavBar>
      <Grid
        templateColumns="80% 20%"
      >
        <GridItem w="100%">
          <ChatWindow user={user} friend={friend} messages={messages} />
        </GridItem>
        <GridItem w="100%">
          <Box>
            <VStack alignItems="flex-start">
              <Avatar name={friend.username}>
                <AvatarBadge boxSize="1em" bg="green.500" />
              </Avatar>
              <Card w="100%" backgroundColor="black" color="white">
                <CardBody>
                  <Stack divider={<StackDivider />} spacing={4}>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        {friend.username}
                      </Heading>
                      <Text pt={2} fontSize="sm">
                        {friend.username}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Member Since
                      </Heading>
                      <Text pt={2} fontSize="sm">
                        {dateFormatter(friend.createdAt)}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}