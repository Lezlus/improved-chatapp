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
import { validateUsersSchema, UserType, GroupSchemaType, GroupChatInviteSchemaType, GroupMembershipType } from "../../types/clientSchemas";
import { useEffect, useState, useRef } from "react";
import { MainViews } from "./components/client/types";
import FriendsSection from "./components/client/FriendsSection";
import { UserUnpopulatedType } from "../../types/clientSchemas/userUnpopulated";
import { FriendInviteSchemaType } from "../../types/clientSchemas/friendInvites";
import MessageService from "./_services/messageService";
import { DirectMessageSchemaType, GroupMessageSchemaType } from "../../types/clientSchemas";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/toPusherKey";
import { pusherFriendInviteChannelName, FriendInviteEvents, pusherGroupChatInviteChannelName, GroupChatInviteEvents } from "../../types/pusher";
import GroupService from "./_services/groupService";

export default function Home() {
  const { data: session, status, update } = useSession();
  const toast = useToast();
  const [view, setView] = useState<MainViews>("DIRECT")
  const [user, setUser] = useState<UserType>();
  const [selectedFriend, setSelectedFriend] = useState<UserUnpopulatedType>();
  const [messages, setMessages] = useState<DirectMessageSchemaType[]>([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState<GroupSchemaType>();
  const [groupChatMessages, setGroupChatMessages] = useState<GroupMessageSchemaType[]>([]);

  useEffect(() => {
    if (session?.user) {
      const user = validateUsersSchema(session?.user);
      setUser(user);

      pusherClient.subscribe(pusherFriendInviteChannelName(user.id));
      pusherClient.subscribe(pusherGroupChatInviteChannelName(user.id));

      const friendInviteHandler = (friendInvite: FriendInviteSchemaType) => {
        toast({
          title: "Incoming Friend Request",
          description: `${friendInvite.sender.username} sent a friend request`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        setUser((prev) => {
          if (prev) {
            const newFriendInvites = [...prev.friendInvites, friendInvite];
            return {
              ...prev,
              friendInvites: newFriendInvites
            }
          }
          return undefined;
        })
      }

      const groupChatInviteHandler = (groupChatInvite: GroupChatInviteSchemaType) => {
        toast({
          title: "Incoming Group Invite",
          description: `Invite to join ${groupChatInvite.group.groupName}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        setUser((prev) => {
          if (prev) {
            const newGroupChatInvites = [...prev.groupChatInvites, groupChatInvite];
            return {
              ...prev,
              groupChatInvites: newGroupChatInvites
            }
          }
          return undefined;
        })
      }

      const friendInviteAcceptedHandler = (friend: UserUnpopulatedType) => {
        setUser((prev) => {
          if (prev) {
            const newFriends = [...prev.friends, friend];
            return {
              ...prev,
              friends: newFriends
            }
          } 
          return undefined;
        })
      }

      pusherClient.bind(GroupChatInviteEvents.InviteIncoming, groupChatInviteHandler);
      pusherClient.bind(FriendInviteEvents.Incoming, friendInviteHandler);
      pusherClient.bind(FriendInviteEvents.Accepted, friendInviteAcceptedHandler);
      return () => {
        pusherClient.unsubscribe(pusherFriendInviteChannelName(user.id));
        pusherClient.unsubscribe(pusherGroupChatInviteChannelName(user.id));
        pusherClient.unbind(GroupChatInviteEvents.InviteIncoming, groupChatInviteHandler);
        pusherClient.unbind(FriendInviteEvents.Incoming, friendInviteHandler);
        pusherClient.unbind(FriendInviteEvents.Accepted, friendInviteAcceptedHandler);
      }

    }
  }, [session?.user, toast])

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

  useEffect(() => {
    if (selectedGroupChat) {
      if (user) {
        GroupService.getMessages({ id: selectedGroupChat._id })
          .then(res => {
            if (res.success) {
              setGroupChatMessages(res.messages);
            }
          })
      }
    }
  }, [selectedGroupChat, user])

  const handleViewChange = (newView: MainViews) => {
    setView(newView);
  }

  const handleSelectedFriendChange = (friend: UserUnpopulatedType) => {
    setSelectedFriend(friend);
    handleViewChange("DIRECT");
  }

  const handleSelectedGroupChatChange = async (groupChat: GroupSchemaType) => {
    // Bad solution but in order to show new added users refetch fresh data
    const res = await GroupService.get({ name: groupChat.groupName });
    if (res.success) {
      setSelectedGroupChat(res.group);
      handleViewChange("GROUP");
    }
  }

  const handleAddGroupMember = (groupMember: GroupMembershipType) => {
    setSelectedGroupChat(prev => {
      if (prev) {
        const updatedGroupMemberships = [...prev.groupMemberships, groupMember];
        return {
          ...prev,
          groupMemberships: updatedGroupMemberships
        }
      } 
      return undefined;
    })
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

  const handleNewMessage = (message: DirectMessageSchemaType) => {
    setMessages((prev) => [...prev, message]);
  }

  const handleNewGroupChatMessage = (message: GroupMessageSchemaType) => {
    setGroupChatMessages((prev) => [...prev, message]);
  }

  const handleNewGroupChat = (groupChat: GroupSchemaType) => {
    setUser((prevUser) => {
      if (prevUser) {
        const groupChats = [...prevUser.groups, groupChat];
        return {
          ...prevUser,
          groups: groupChats
        }
      } 
      return undefined
    })
  }

  const acceptOrDeclineGroupChatInvite = (groupChatInvite: GroupChatInviteSchemaType) => {
    setUser((prevUser) => {
      if (prevUser) {
        const groupChatInvites = prevUser.groupChatInvites.filter((invite) => invite._id != groupChatInvite._id);
        return {
          ...prevUser,
          groupChatInvites,
        }
      }
      return undefined
    })
  }

  const renderPage = () => {
    switch (view) {
      case "FRIENDS": 
        return <FriendsSection handleAcceptOrDeclineGroupChatInvite={acceptOrDeclineGroupChatInvite} handleNewGroupChat={handleNewGroupChat} handleAcceptOrDeclineFriendRequest={handleAcceptOrDeclineFriendRequest} user={user} />;
      case "DIRECT":
        return <DirectMessageChat handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
      case "GROUP":
        return <GroupMessageChat handleAddGroupMember={handleAddGroupMember} user={user} selectedGroupChat={selectedGroupChat} messages={groupChatMessages} handleNewGroupChatMessage={handleNewGroupChatMessage}  />;
        
      default:
        return <DirectMessageChat handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
    }
  }

  return (
    <Grid 
      as="main"
      templateColumns="7% 17% 76%"
    >
      <GridItem w="100%">
        <GroupChat 
          handleNewGroupChat={handleNewGroupChat}
          user={user} 
          handleSelectedGroupChatChange={handleSelectedGroupChatChange}
        />
        </GridItem>
      <GridItem w="100%" backgroundColor="#303346">
        <Box h="5vh" position="sticky" top={0}>
          <FindConversation user={user} handleSelectedFriendChange={handleSelectedFriendChange} />
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
