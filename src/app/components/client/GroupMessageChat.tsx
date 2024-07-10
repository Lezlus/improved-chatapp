'use client';


import { Avatar, AvatarBadge, Box, Button, Grid, GridItem, HStack, Heading, Input, InputGroup, Text, VStack, useToast } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

import NavBar from "./util/NavBar";
import { CreateMessageSchemaType, GroupMembershipType, GroupMessageSchemaType, GroupSchemaType, UserType } from "../../../../types/clientSchemas";
import ChatMessage from "./util/ChatMessage";
import { KeyboardEvent, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { GroupChatEvents, pusherGroupChatChannelName } from "../../../../types/pusher";
import GroupChatInviteService from "@/app/_services/groupChatInviteService";
import UserService from "@/app/_services/userService";
import MessageService from "@/app/_services/messageService";

interface GroupMessageChatProps {
  selectedGroupChat?: GroupSchemaType;
  messages:GroupMessageSchemaType[];
  user: UserType;
  handleNewGroupChatMessage: (message: GroupMessageSchemaType) => void;
  handleAddGroupMember: (groupMember: GroupMembershipType) => void;
}

interface GroupChatWindowProps {
  messages: GroupMessageSchemaType[];
  selectedGroupChat: GroupSchemaType;
  user: UserType;
}

const GroupChatWindow = (props: GroupChatWindowProps) => {
  const { messages, selectedGroupChat, user } = props;
  const [value, setValue] = useState("");
  
  const onKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.length >= 1) {
        const data: CreateMessageSchemaType = {
          type: "GROUP",
          senderId: user.id,
          groupId: selectedGroupChat._id,
          content: value,
        }
        const res = await MessageService.create(data);
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
            return <ChatMessage key={message._id} message={message} />
          }) }
        </VStack>
      </Box>
      <Box height="10%" display="flex" alignItems="flex-end">
      <Input 
          color="gray.200"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          value={value} 
          placeholder="Type a message..." 
          size="lg" 
        />
      </Box>
    </Box>
  )
}

export default function GroupMessageChat(props: GroupMessageChatProps) {
  const { selectedGroupChat, messages, handleNewGroupChatMessage, user, handleAddGroupMember } = props;
  const [addUsername, setAddUsername] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (selectedGroupChat) {
      pusherClient.subscribe(pusherGroupChatChannelName(selectedGroupChat._id));
      console.log("connected to channel ", pusherGroupChatChannelName(selectedGroupChat._id))

      const messageHandler = (message: GroupMessageSchemaType) => {
        handleNewGroupChatMessage(message);
      }

      const newMemberHandler = (groupMember: GroupMembershipType) => {
        handleAddGroupMember(groupMember);
      }

      pusherClient.bind(GroupChatEvents.Messaging, messageHandler);
      pusherClient.bind(GroupChatEvents.InviteAccepted, newMemberHandler);
      return () => {
        pusherClient.unsubscribe(pusherGroupChatChannelName(selectedGroupChat._id))
        pusherClient.unbind(GroupChatEvents.InviteAccepted, newMemberHandler);
        pusherClient.unbind(GroupChatEvents.Messaging, messageHandler);
      }

    }
  }, [selectedGroupChat, handleNewGroupChatMessage, handleAddGroupMember])

  const sendGroupInvite = async () => {
    if (addUsername.length < 3) {
      toast({
        title: "Username too short",
        status: "error",
        duration: 3000,
        isClosable: true
      })
    } else {
      const getUserRes = await UserService.get({ name: addUsername });
      if (!getUserRes.success) {
        toast({
          title: "User May Not Exist",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add functionality to check if user was already invited
        const groupChatInviteRes = await GroupChatInviteService.create({
          sender: user.id,
          receiver: getUserRes.user._id,
          status: "PENDING",
          group: selectedGroupChat!._id
        })
        if (groupChatInviteRes.groupChatInvite && !groupChatInviteRes.success) {
          toast({
            title: "User Has Pending Invite!",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Group Invite Sent!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    }
  }

  if (!selectedGroupChat) {
    return (
      <Box>
        <Heading>Loading...</Heading>
      </Box>
    ) 
  }
  return (
    <Box>
      <NavBar>
        <Avatar size='xs' name={selectedGroupChat.groupName} />
        <Text fontSize="sm" color="white">{selectedGroupChat.groupName}</Text>
      </NavBar>
      <Grid templateColumns="80% 20%">
        <GridItem w="100%">
          <GroupChatWindow messages={messages} selectedGroupChat={selectedGroupChat} user={user} />
        </GridItem>
        <GridItem w="100%">
          <Box>
            <Box>
              <VStack alignItems="flex-start">
                <Text color="white" fontWeight="bold">Invite To Group</Text>
              </VStack>
              <Box>
                <HStack>
                  <InputGroup>
                    <Input
                      value={addUsername}
                      onChange={(e) => setAddUsername(e.target.value)}
                      placeholder="Type a username"
                      size="md"
                      color="white"
                    />
                  </InputGroup>
                  <Button colorScheme="blue" onClick={sendGroupInvite}>
                    <Text padding="1em">Invite User</Text>
                  </Button>
                </HStack>
              </Box>
            </Box>
            <VStack>
              {selectedGroupChat.groupMemberships.map(groupMember => {
                return (
                  <Box key={groupMember.user._id}>
                    <HStack>
                      {groupMember.user._id === selectedGroupChat.createdBy._id ? <StarIcon boxSize={3} /> : <Box></Box>}
                      <Avatar size="sm" name={groupMember.user.username}>
                        <AvatarBadge boxSize="1em" bg="green.500" />
                      </Avatar>
                      <Text fontSize="sm" color="white">{groupMember.user.username}</Text>
                    </HStack>
                  </Box>
                )
              })}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
  
}