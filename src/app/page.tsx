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
  useToast,
  Flex
} from "@chakra-ui/react";
import GroupChatList from "./components/client/GroupChatList";
import FindConversation from "./components/client/FindConversation";
import TabOption from "./components/client/TabOptions/TabOption";
import DirectMessagesList from "./components/client/DirectMessagesList";
import UserAvatar from "./components/client/UserAvatar";
import DirectMessageChatSection from "./components/MainSections/DirectMessageChatSection";
import GroupMessageChatSection from "./components/MainSections/GroupMessageChatSection";
import FriendsSection from "./components/MainSections/FriendsSection";
import { validateUsersSchema, UserType, GroupSchemaType, GroupChatInviteSchemaType, GroupMembershipType } from "../../types/clientSchemas";
import { useEffect, useState, useRef, useCallback } from "react";
import { MainViews } from "./components/client/types";
import { UserUnpopulatedType } from "../../types/clientSchemas/userUnpopulated";
import { FriendInviteSchemaType } from "../../types/clientSchemas/friendInvites";
import MessageService from "./_services/messageService";
import { DirectMessageSchemaType, GroupMessageSchemaType } from "../../types/clientSchemas";
import { toPusherKey } from "@/lib/toPusherKey";
import { pusherFriendInviteChannelName, FriendInviteEvents, pusherGroupChatInviteChannelName, GroupChatInviteEvents, pusherActivityStatusChannelName, ActivityStatusEvents } from "../../types/pusher";
import GroupService from "./_services/groupService";
import ActivityStatusService from "./_services/activityService";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import pusherJs from "pusher-js";
import { ActivityStatusType } from "../../modelSchemas/users";
import AuthService from "./_services/authService";
import { PresenceChannelData } from "pusher";

export default function Home() {
  const { data: session, status, update } = useSession();
  const toast = useToast();
  const [view, setView] = useState<MainViews>("DIRECT")
  const [user, setUser] = useState<UserType>();
  const [selectedFriend, setSelectedFriend] = useState<UserUnpopulatedType>();
  const [messages, setMessages] = useState<DirectMessageSchemaType[]>([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState<GroupSchemaType>();
  const [groupChatMessages, setGroupChatMessages] = useState<GroupMessageSchemaType[]>([]);

  const userGoesOffline = useCallback(() => {
    const data = { id: user?.id!, activityStatus: user?.activityStatus! };
    const stringifiedData = JSON.stringify(data);
    navigator.sendBeacon("/api/activityStatus/offline", stringifiedData);
  }, [user])

  useEffect(() => {
    console.log("Ran window event hook");
    window.addEventListener("unload", userGoesOffline);
    window.addEventListener("pagehide", userGoesOffline);

    return () => {
      window.removeEventListener("unload", userGoesOffline)
      window.removeEventListener("pagehide", userGoesOffline);
    }

  }, [userGoesOffline])

  useEffect(() => {
    const friendsActivityChannel: Channel[] = [];

    const activityStatusChangeHandler = (user: UserUnpopulatedType) => {
      console.log("Activity Status Change: ", user);
      setUser((prev) => {
        if (prev) {
          const updatedFriends = prev.friends.map((friend) => {
            if (friend._id === user._id) {
              return user;
            }
            return friend;
          })
          return {
            ...prev,
            friends: updatedFriends
          }
        }
        return undefined;
      })
    }

    user?.friends.forEach(friend => {
      const channel = pusherClient.subscribe(pusherActivityStatusChannelName(friend._id));

      channel.bind(ActivityStatusEvents.StatusOffline, activityStatusChangeHandler)

      channel.bind(ActivityStatusEvents.StatusOnline, activityStatusChangeHandler)

      friendsActivityChannel.push(channel);
    })

    return () => {
      friendsActivityChannel.forEach(channel => {
        channel.unsubscribe()
        channel.unbind(ActivityStatusEvents.StatusOffline, activityStatusChangeHandler);
        channel.unbind(ActivityStatusEvents.StatusOnline, activityStatusChangeHandler);
      })
    }

  }, [user])

  // useEffect(() => {
  //   const activityStatusPresenceChannel = pusherClient.subscribe(pusherActivityStatusChannelName(user?.id!))
  //   activityStatusPresenceChannel.bind("pusher:subscription_succeeded", (members: PresenceChannelData) => {
  //     console.log(members)
  //     ActivityStatusService.goOnline({
  //       id: user?.id!,
  //       activityStatus: user?.activityStatus!
  //     }).then(data => {
  //       if (data.success) {
  //         setUser((prev) => {
  //           if (prev) {
  //             return {
  //               ...prev,
  //               activityStatus: data.user.activityStatus,
  //               online: data.user.online,
  //             }
  //           }
  //           return undefined
  //         })
  //       }
  //     })
  //   })

  //   return () => {

  //     activityStatusPresenceChannel.unsubscribe();
  //     activityStatusPresenceChannel.unbind_all();
  //   }

  // }, [user])

  useEffect(() => {
    if (session?.user) {


      const user = validateUsersSchema(session?.user);
      setUser(user);
      
      const activityStatusPresenceChannel = pusherClient.subscribe(pusherActivityStatusChannelName(user.id))

      activityStatusPresenceChannel.bind("pusher:subscription_succeeded", (members: PresenceChannelData) => {
        ActivityStatusService.goOnline({
          id: user.id,
          activityStatus: user.activityStatus
        }).then(data => {
          if (data.success) {
            setUser((prev) => {
              if (prev) {
                return {
                  ...prev,
                  activityStatus: data.user.activityStatus,
                  online: data.user.online,
                }
              }
              return undefined
            })
          }
        })
      })

      pusherClient.subscribe(pusherFriendInviteChannelName(user.id));
      pusherClient.subscribe(pusherGroupChatInviteChannelName(user.id));
      const friendsActivityChannel: Channel[] = [];

      const activityStatusChangeHandler = (user: UserUnpopulatedType) => {
        setUser((prev) => {
          if (prev) {
            const updatedFriends = prev.friends.map((friend) => {
              if (friend._id === user._id) {
                return user;
              }
              return friend;
            })
            return {
              ...prev,
              friends: updatedFriends
            }
          }
          return undefined;
        })
      }

      user.friends.forEach(friend => {
        const channel = pusherClient.subscribe(pusherActivityStatusChannelName(friend._id));

        channel.bind(ActivityStatusEvents.StatusOffline, activityStatusChangeHandler)

        channel.bind(ActivityStatusEvents.StatusOnline, activityStatusChangeHandler)
        channel.bind(ActivityStatusEvents.StatusChange, activityStatusChangeHandler)

        friendsActivityChannel.push(channel);
      })

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

        activityStatusPresenceChannel.unsubscribe();
        activityStatusPresenceChannel.unbind_all();

        friendsActivityChannel.forEach(channel => {
          channel.unsubscribe();
          channel.unbind(ActivityStatusEvents.StatusOffline, activityStatusChangeHandler);
          channel.unbind(ActivityStatusEvents.StatusOnline, activityStatusChangeHandler);
        })
      }

    }
  }, [session?.user, toast, session])

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

  const handleChangeActivityStatus = async (activityStatus: ActivityStatusType) => {
    const res = await ActivityStatusService.update({ id: user.id, activityStatus });
    if (res.success) {
      setUser((prev) => {
        if (prev) {
          return {
            ...prev,
            activityStatus,
          }
        }
        return undefined
      })
    }
  }

  const renderPage = () => {
    switch (view) {
      case "FRIENDS": 
        return <FriendsSection handleAcceptOrDeclineGroupChatInvite={acceptOrDeclineGroupChatInvite} handleNewGroupChat={handleNewGroupChat} handleAcceptOrDeclineFriendRequest={handleAcceptOrDeclineFriendRequest} user={user} />;
      case "DIRECT":
        return <DirectMessageChatSection handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
      case "GROUP":
        return <GroupMessageChatSection handleAddGroupMember={handleAddGroupMember} user={user} selectedGroupChat={selectedGroupChat} messages={groupChatMessages} handleNewGroupChatMessage={handleNewGroupChatMessage}  />;
        
      default:
        return <DirectMessageChatSection handleNewMessage={handleNewMessage} messages={messages} user={user} friend={selectedFriend} />;
    }
  }

  return (
    <Grid 
      as="main"
      templateColumns="7% 17% 76%"
    >
      <GridItem w="100%" backgroundColor="black">
        <GroupChatList 
          handleNewGroupChat={handleNewGroupChat}
          user={user} 
          handleSelectedGroupChatChange={handleSelectedGroupChatChange}
        />
        </GridItem>
      <GridItem w="100%" backgroundColor="black">
        <Flex flexDirection="column" height="100%">
          <Box flex="0 0 5%">
            <FindConversation user={user} handleSelectedFriendChange={handleSelectedFriendChange} />
            <Divider />
          </Box>
          <Box flex="0 0 20%" overflowY="scroll" className="tab-options">
            <TabOption handleViewChange={handleViewChange} />
          </Box>
          <Box flex="1" overflowY="scroll" className="direct-messages">
            <DirectMessagesList handleSelectedFriendChange={handleSelectedFriendChange} user={user} />
          </Box>
          <Box flex="0 0 5%">
            <UserAvatar user={user} handleChangeActivityStatus={handleChangeActivityStatus} />
          </Box>
        </Flex>
      </GridItem>
      <GridItem w="100%">
        {renderPage()}
      </GridItem>
    </Grid>
  );
}
