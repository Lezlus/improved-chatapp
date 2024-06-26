"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import "./styles/app.scss";
import {
  Grid,
  GridItem,
  Heading,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Divider,
  Box,
  Button,
  useToast
} from "@chakra-ui/react";
import GroupChat from "./components/client/GroupChat";
import FindConversation from "./components/client/FindConversation";
import TabOption from "./components/client/TabOption";
import DirectMessages from "./components/client/DirectMessages";
import UserAvatar from "./components/client/UserAvatar";
import DirectMessageChat from "./components/client/DirectMessageChat";
import GroupMessageChat from "./components/client/GroupMessageChat";
import { validateUsersSchema, UserType } from "../../types/clientSchemas";
import { useEffect, useState, useRef } from "react";
import { MainViews } from "./components/client/types";
import FriendsSection from "./components/client/FriendsSection";
import { UserUnpopulatedType } from "../../types/clientSchemas/userUnpopulated";
import { FriendInviteSchemaType } from "../../types/clientSchemas/friendInvites";
import MessageService from "./_services/messageService";
import { PopulatedMessageSchemaType } from "../../types/clientSchemas/messages";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/toPusherKey";

export default function Home() {
  const { data: session, status, update } = useSession();
  const toast = useToast();
  const [view, setView] = useState<MainViews>("DIRECT")
  const [user, setUser] = useState<UserType>();
  const [selectedFriend, setSelectedFriend] = useState<UserUnpopulatedType>();
  const [messages, setMessages] = useState<PopulatedMessageSchemaType[]>([]);
  const [friendInvites, setFriendInvites] = useState<FriendInviteSchemaType[]>([]);

  useEffect(() => {
    if (session?.user) {
      const user = validateUsersSchema(session?.user);
      setUser(user);
      setFriendInvites(user.friendInvites);

      pusherClient.subscribe(toPusherKey(`friendInvite:${user.id}`))
      console.log("connected to channel ", toPusherKey(`friendInvite:${user.id}`))

      const friendInviteHandler = (friendInvite: FriendInviteSchemaType) => {
        console.log("Friend Invite Even Called", friendInvite);
        toast({
          title: "Incoming Friend Request",
          description: `${friendInvite.sender.username} sent a friend request`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        setFriendInvites((prev) => [...prev, friendInvite]);
      }

      pusherClient.bind("incoming-friendinvite", friendInviteHandler);
      return () => {
        pusherClient.unsubscribe(toPusherKey(`friendInvite:${user.id}`));
        pusherClient.unbind("incoming-friendinvite", friendInviteHandler);
      }

    }
  }, [session?.user])

  useEffect(() => {
    if (selectedFriend) {
      if (user) {
        MessageService.getMessagesBetweenUsers({ currentUser: user.id, nextUser: selectedFriend._id })
          .then(res => {
            if (res.success) {
              setMessages(res.messages);
            }
          })

      }
    }
  }, [selectedFriend, user]);

  const handleViewChange = (newView: MainViews) => {
    setView(newView);
  }

  const handleSelectedFriendChange = (friend: UserUnpopulatedType) => {
    setSelectedFriend(friend);
    handleViewChange("DIRECT");
  }

  if (status === "unauthenticated" || status === "loading" || !user) {
    return <div>Loading</div>
  }

  const handleAcceptOrDeclineFriendRequest = (friends: UserUnpopulatedType[], friendInvites: FriendInviteSchemaType[]) => {
    
    setUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          friends,
          friendInvites
        }
      } 
      return undefined;
    })
  }

  const handleNewMessage = (message: PopulatedMessageSchemaType) => {
    setMessages((prev) => [...prev, message]);
  }

  const handleNewFriendInvite = (friendInvite: FriendInviteSchemaType) => {
    setFriendInvites((prev) => [...prev, friendInvite]);
  }

  const renderPage = () => {
    switch (view) {
      case "FRIENDS": 
        return <FriendsSection handleAcceptOrDeclineFriendRequest={handleAcceptOrDeclineFriendRequest} user={user} />;
      case "DIRECT":
        return <DirectMessageChat handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
      case "GROUP":
        return <DirectMessageChat  handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
      default:
        return <DirectMessageChat handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
    }
  }

  return (
    <Grid 
      as="main"
      templateColumns="7% 17% 76%"
    >
      <GridItem w="100%"><GroupChat user={user} /></GridItem>
      <GridItem w="100%" backgroundColor="#303346">
        <Box h="5vh" position="sticky" top={0}>
          <FindConversation />
          <Divider />
        </Box>
        <Box overflowY="scroll" h="86vh">
          <TabOption handleViewChange={handleViewChange} />
          <DirectMessages handleSelectedFriendChange={handleSelectedFriendChange} user={user} />
        </Box>
        <Box h="5vh">
          <UserAvatar />
        </Box>
      </GridItem>
      <GridItem w="100%">
        {renderPage()}
      </GridItem>
    </Grid>
  );
}
