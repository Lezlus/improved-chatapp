'use client';
import {
  Grid,
  GridItem,
  Heading,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  VStack,
  Box,
  Container,
  HStack,
  Text,
  Icon,
  Button,
  Divider,
  Input,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import NavBar from "../client/util/NavBar";
import AvatarRow from "../client/util/AvatarRow";
import { useSession } from "next-auth/react";
import { FaUserFriends } from "react-icons/fa";
import { validateUsersSchema, UserType, GroupSchemaType, GroupChatInviteSchemaType } from "../../../../types/clientSchemas";
import FriendInviteService from "@/app/_services/friendInviteService";
import UserService from "@/app/_services/userService";
import GroupChatInviteService from "@/app/_services/groupChatInviteService";
import { FriendInviteSchemaType, OutGoingFriendInviteSchemaType } from "../../../../types/clientSchemas/friendInvites";
import { MainViews } from "../client/types";
import { UserUnpopulatedType } from "../../../../types/clientSchemas/userUnpopulated";

// interface FriendsOptionProps {
//   handleViewChange: (newView: MainViews) => void;
// }

interface FriendsSectionProps {
  user: UserType;
  handleAcceptOrDeclineFriendRequest: (friends: UserUnpopulatedType[], friendInvites: FriendInviteSchemaType[]) => void;
  handleNewGroupChat: (groupChat: GroupSchemaType) => void;
  handleAcceptOrDeclineGroupChatInvite: (groupChatInvite: GroupChatInviteSchemaType) => void;

}

interface PendingTabProps {
  user: UserType;
  handleNewGroupChat: (groupChat: GroupSchemaType) => void;
  handleAcceptOrDeclineGroupChatInvite: (groupChatInvite: GroupChatInviteSchemaType) => void;
  handleAcceptOrDeclineFriendRequest: (friends: UserUnpopulatedType[], friendInvites: FriendInviteSchemaType[]) => void;
}

interface AddFriendTabProps {
  user: UserType;
}

interface AllTabProps {
  user: UserType;
}

interface OnlineTabProps {
  user: UserType;
}

const OnlineTab = () => {
  return (
    <Box>

    </Box>
  )
}

const AllTab = (props: AllTabProps) => {
  const { user } = props;
  const { data: session, status } = useSession();
  const userData = validateUsersSchema(session?.user);

  return (
    <Container>
      <Box>
        {/* search bar */}
      </Box>
      <Box>
        <VStack>
          {user.friends.map(friend => {
            return (
              <AvatarRow
                key={friend._id}
                stackProps={{
                  w:"95%",
                  color:"#8E9297",
                  justifyContent:"flex-start",
                  paddingInline:"1em",
                  paddingBlock:"0.6em",
                  spacing:5,
                  cursor:"pointer",
                }}
                leftContent={<Avatar name={friend.username}>
                  <AvatarBadge boxSize="1em" bg="green.500" />
                </Avatar>}
                rightContent={
                  <VStack>
                    <Text fontSize="xs">{friend.username}</Text>
                    <Text fontSize="xs">Offline</Text>
                  </VStack>
                }
            />
            )
          })}
        </VStack>
      </Box>
    </Container>
  )
}

const PendingTab = (props: PendingTabProps) => {
  const { handleAcceptOrDeclineFriendRequest, user, handleAcceptOrDeclineGroupChatInvite, handleNewGroupChat } = props;

  const [outgoingInvites, setOutgoingInvites] = useState<OutGoingFriendInviteSchemaType[]>([]);
  useEffect(() => {
    FriendInviteService.getOutgoing({ id: user.id })
      .then(res => {
        if (res.success) {
          setOutgoingInvites(res.outGoingFriendInvites);
        }
      }) 
  }, [user.id])

  const acceptFriendRequest = async (sender: string, friendRequestId: string) => {
    const res = await FriendInviteService.acceptFriendInvite({
      _id: friendRequestId,
      sender,
      receiver: user.id
    });
    if (res.success) {
      handleAcceptOrDeclineFriendRequest(res.friends!, res.friendInvites!);

    }
  }

  const declineFriendRequest = async (sender: string, friendRequestId: string) => {
    const res = await FriendInviteService.declineFriendInvite({
      _id: friendRequestId,
      sender,
      receiver: user.id,
    })
    if (res.success) {
      handleAcceptOrDeclineFriendRequest(res.friends!, res.friendInvites!);
    }
  }

  const acceptGroupChatInvite = async (groupChatInvite: GroupChatInviteSchemaType) => {
    const res = await GroupChatInviteService.accept(groupChatInvite);
    if (res.success) {
      handleAcceptOrDeclineGroupChatInvite(groupChatInvite);
      handleNewGroupChat(res.group);
    }
  }

  const declineGroupChatInvite = async (groupChatInvite: GroupChatInviteSchemaType) => {
    const res = await GroupChatInviteService.decline(groupChatInvite);
    if (res.success) {
      handleAcceptOrDeclineGroupChatInvite(groupChatInvite);
    }
  }

  return (
    <Container>
      <Box>
        {/* Search Bar */}
      </Box>
      <Box>
        <Tabs variant="enclosed">
          <TabList color="white">
            <Tab>Incoming</Tab>
            <Tab>Outgoing</Tab>
            <Tab>Group Invites</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box>
                <Text color="white">{`Pending-${user.friendInvites.length}`}</Text>
              </Box>
              <Divider />
              <Box>
                <VStack>
                  {user.friendInvites.map(friendInvite => {
                    return (
                      <HStack
                        w="95%"
                        key={friendInvite.sender._id}
                        color="#8E9297"
                        justifyContent="space-between"
                        paddingInline="1em"
                        paddingBlock="0.6em"

                      >
                        <Box>
                          <HStack gap="2rem">
                            <Avatar name={friendInvite.sender.username}>
                              <AvatarBadge boxSize="1em" bg="green.500" />
                            </Avatar>
                            <VStack alignItems="flex-start">
                              <Text color='white' fontWeight="bold" fontSize="sm">{friendInvite.sender.username}</Text>
                              <Text fontSize="sm">Incoming Friend Requests</Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box>
                          <Tooltip hasArrow label="Accept" placement="top">
                            <CheckIcon onClick={(e) => acceptFriendRequest(friendInvite.sender._id, friendInvite._id)} _hover={{ color: "green" }} boxSize={6} cursor="pointer"  />
                          </Tooltip>
                        </Box>
                        <Box>
                          <Tooltip hasArrow label="Decline" placement="top">
                            <CloseIcon onClick={(e) => declineFriendRequest(friendInvite.sender._id, friendInvite._id)} _hover={{ color: "red" }} boxSize={6} cursor="pointer" />
                          </Tooltip>
                        </Box>
                      </HStack>
                    )
                  })}
                </VStack>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Text color="white">{`Pending-${outgoingInvites.length}`}</Text>
              </Box>
              <Divider />
              <Box>
                <VStack>
                  {outgoingInvites.map(friendInvite => {
                    return (
                      <HStack
                        w="95%"
                        key={friendInvite.receiver._id}
                        color="#8E9297"
                        justifyContent="space-between"
                        paddingInline="1em"
                        paddingBlock="0.6em"

                      >
                        <Box>
                          <HStack gap="2rem">
                            <Avatar name={friendInvite.receiver.username}>
                              <AvatarBadge boxSize="1em" bg="green.500" />
                            </Avatar>
                            <VStack alignItems="flex-start">
                              <Text color='white' fontWeight="bold" fontSize="sm">{friendInvite.receiver.username}</Text>
                              <Text fontSize="sm">Outgoing Friend Requests</Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box>
                          {/* <Tooltip hasArrow label="Cancel" placement="top">
                            <CloseIcon _hover={{ color: "red" }} boxSize={6} cursor="pointer"  />
                          </Tooltip> */}
                        </Box>
                      </HStack>
                    )
                  })}
                </VStack>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Text color="white">{`Pending-${user.groupChatInvites.length}`}</Text>
              </Box>
              <Divider />
              <Box>
                <VStack>
                  {user.groupChatInvites.map(invite => {
                    return (
                      <HStack
                        w="95%"
                        key={invite._id}
                        color="#8E9297"
                        justifyContent="space-between"
                        paddingInline="1em"
                        paddingBlock="0.6em"
                      >
                        <Box>
                          <HStack gap="2rem">
                            <Avatar name={invite.group.groupName}>
                              <AvatarBadge boxSize="1em" bg="green.500" />
                            </Avatar>
                            <VStack alignItems="flex-start">
                              <Text color='white' fontWeight="bold" fontSize="sm">{invite.group.groupName}</Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Tooltip hasArrow label="Accept" placement="top">
                          <CheckIcon onClick={(e) => acceptGroupChatInvite(invite)} _hover={{ color: "green" }} boxSize={6} cursor="pointer" />
                        </Tooltip>
                        <Tooltip hasArrow label="Decline" placement="top">
                          <CloseIcon onClick={(e) => declineGroupChatInvite(invite)} _hover={{ color: "red" }} boxSize={6} cursor="pointer" />
                        </Tooltip>
                      </HStack>
                    )
                  })}
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

const AddFriendTab = () => {
  const { data: session, status } = useSession();
  const [addUsername, setAddUsername] = useState("");
  const userData = validateUsersSchema(session?.user);
  const toast = useToast();
  
  const sendFriendRequest = async () => {
    if (addUsername.length < 3) {
      toast({
        title: "Username too short",
        status: "error",
        duration: 3000,
        isClosable: true
      })
    } else {
      const res = await UserService.get({ name: addUsername });
      if (!res.success) {
        toast({
          title: "User May Not Exist",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Check if user sent a pending friend request already
        const outgoingFriendReqRes = await FriendInviteService.getOutgoing({ id: userData.id });
        if (outgoingFriendReqRes.success) {
          const outgoingRequests = outgoingFriendReqRes.outGoingFriendInvites;
          if (outgoingRequests.some(friendInvite => friendInvite.receiver._id === res.user._id)) {
            toast({
              title: "You Already Have a Pending Friend Request",
              status: "error",
              duration: 3000
            })
          }
        } else {
          console.log("Trying to send request rn");
          // Send Friend Request
          const friendReqRes = await FriendInviteService.post({
            sender: userData.id,
            receiver: res.user._id,
            status: "PENDING"
          })
          if (!friendReqRes.success) {
            toast({
              title: "Error Sending Friend request",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Friend Request Sent!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }
    }
  }

  return (
    <Container>
      <Box>
        <VStack alignItems="flex-start">
          <Text color="white" fontWeight="bold">Add Friend</Text>
          <Text color="gray.300">You can add friends with their username</Text>
        </VStack>
      </Box>
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
          <Button colorScheme="blue" onClick={sendFriendRequest}>
            <Text padding="1em">Send Friend Request</Text>
          </Button>
        </HStack>
      </Box>
    </Container>
  )
}


export default function FriendsSection(props: FriendsSectionProps) {
  const { user, handleAcceptOrDeclineFriendRequest, handleAcceptOrDeclineGroupChatInvite, handleNewGroupChat } = props;
  const [currentTab, setCurrentTab] = useState<"ONLINE" | "ALL" | "PENDING" | "ADD FRIEND">("ONLINE");

  const renderTab = () => {
    switch (currentTab) {
      case "ONLINE":
        return <OnlineTab />;
      case "ALL":
        return <AllTab user={user} />;
      case "PENDING":
        return <PendingTab handleAcceptOrDeclineGroupChatInvite={handleAcceptOrDeclineGroupChatInvite} handleNewGroupChat={handleNewGroupChat} user={user} handleAcceptOrDeclineFriendRequest={handleAcceptOrDeclineFriendRequest} />;
      case "ADD FRIEND":
        return <AddFriendTab />;
      default:
        return null;
    }
  }
  return (
    <Box>
      <NavBar>
        <AvatarRow 
          leftContent={<Icon boxSize={5} as={FaUserFriends} />}
          rightContent={<Text fontSize="sm">Friends</Text>}
          stackProps={{
            w:"95%",
            color:"#8E9297",
            justifyContent:"flex-start",
            paddingInline:"1em",
            paddingBlock:"0.6em",
            spacing:5,
            }}
        />
        <ButtonGroup size='sm' variant="ghost">
          <Button _hover={{backgroundColor: "#292a2f"}} backgroundColor={currentTab === "ONLINE" ? "#292a2f": "transparent"} color="gray.400" onClick={(e) => setCurrentTab("ONLINE")}>
            Online
          </Button>
          <Button _hover={{backgroundColor: "#292a2f"}} backgroundColor={currentTab === "ALL" ? "#292a2f": "transparent"} color="gray.400" onClick={(e) => setCurrentTab("ALL")}>
            All
          </Button>
          <Button _hover={{backgroundColor: "#292a2f"}} backgroundColor={currentTab === "PENDING" ? "#292a2f": "transparent"} color="gray.400" onClick={(e) => setCurrentTab("PENDING")}>
            Pending
          </Button>
        </ButtonGroup>
        <Button size='sm' colorScheme="green" onClick={(e) => setCurrentTab("ADD FRIEND")}>
            Add Friend
          </Button>
      </NavBar>
      <Grid>
        <GridItem mt="1em">
          {renderTab()}
        </GridItem>
      </Grid>
    </Box>
  )
}