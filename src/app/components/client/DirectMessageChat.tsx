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
import { UserType } from '../../../../types';
import { UserUnpopulatedType } from '../../../../types/userUnpopulated';
import { PopulatedMessageSchemaType } from '../../../../types/messages';
import { pusherClient } from '@/lib/pusher';
import { KeyboardEvent, useEffect, useState } from 'react';
import { toPusherKey } from '@/lib/toPusherKey';
import { sortObjectIds } from '@/lib/sortObjectId';
import MessageService from '@/app/_services/messageService';
import { CreateMessageSchemaType } from '../../../../types/messages';
import { dateFormatter } from '@/lib/dateFormatter';

interface DirectMessageChatProps {
  user: UserType;
  friend?: UserUnpopulatedType;
  messages: PopulatedMessageSchemaType[];
  handleNewMessage: (message: PopulatedMessageSchemaType) => void;
}

interface ChatWindowProps {
  messages: PopulatedMessageSchemaType[];
  friend: UserUnpopulatedType;
  user: UserType;
}

interface ChatMessageProps {
  message: PopulatedMessageSchemaType;
}

const ChatMessage = (props: ChatMessageProps) => {
  const { message } = props;
  return (
    <HStack p="1em">
      <Avatar name={`${message.senderId.username}`} />
      <VStack align="start" spacing={0}>
        <HStack>
          <Text fontWeight="bold" color="white">{message.senderId.username}</Text>
          <Text fontSize="sm" color="gray.400">{dateFormatter(message.createdAt)}</Text>
        </HStack>
        <Text color="gray.300">{message.content}</Text>
      </VStack>
    </HStack>
  )
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
        await MessageService.create(data)
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
      pusherClient.subscribe(toPusherKey(`chat:${sortObjectIds(user.id, friend._id)}`));
      console.log("connected to channel ", toPusherKey(`chat:${sortObjectIds(user.id, friend._id)}`))
      const messageHandler = (message: PopulatedMessageSchemaType) => {
        console.log("EVENT CALLED", message);
        handleNewMessage(message);
      }

      pusherClient.bind("incoming-message", messageHandler);

      return () => {
        pusherClient.unsubscribe(toPusherKey(`chat:${sortObjectIds(user.id, friend._id)}`));
        pusherClient.unbind("incoming-message", messageHandler);
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