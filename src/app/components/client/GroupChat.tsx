
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
  Text,
  Input,

} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MouseEventHandler, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { validateUsersSchema, UserType, CreateGroupSchemaType, validateCreateGroupSchema, GroupSchemaType } from "../../../../types/clientSchemas";
import { useDisclosure } from "@chakra-ui/react";
import GroupService from "@/app/_services/groupService";
import { v4 as uuidv4 } from 'uuid';
import { stripExcessSpaces } from "@/lib/stripExcessSpaces";

interface GroupChatProps {
  user: UserType;
  handleNewGroupChat: (groupChat: GroupSchemaType) => void;
  handleSelectedGroupChatChange: (groupChat: GroupSchemaType) => void;
}

interface CreateGroupChatProps {
  user: UserType;
  handleNewGroupChat: (groupChat: GroupSchemaType) => void;
}

const CreateGroupChat = (props: CreateGroupChatProps) => {
  const { user, handleNewGroupChat } = props;

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const avatarRef = useRef<HTMLDivElement>(null);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, createGroupMembers] = useState<string[]>([]);

  const onMouseEnter = () => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, { borderRadius: "10px", backgroundColor: "#32cd32", color: "#ffffff", duration: 0.4, ease: "expo.out" })
    }
  }

  const onMouseLeave = () => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, { borderRadius: "25px", color: "#32cd32", backgroundColor: "#2E3036", duration: 0.4, ease: "expo.out"})
    }
  }

  const cleanUpCloseModal = () => {
    onClose();
    onMouseLeave();
  }

  const createGroupChat = async () => {
    const group: CreateGroupSchemaType = {
      groupName: stripExcessSpaces(groupName),
      createdBy: user.id,
      groupMemberships: groupMembers
    }

    const duplicateGroup = await GroupService.get({ name: groupName });
    if (duplicateGroup.success) {
      toast({
        title: "Error",
        description: "Group Name Taken",
        duration: 3000,
      })
    } else {
      console.log(group)
      const validatedGroup = await validateCreateGroupSchema(group);
      if (validatedGroup.error) {
        console.log(validatedGroup.error);
        toast({
          title: "Error",
          description: "Group Name Too Short",
          duration: 3000,
        })
      } else {
        const res = await GroupService.create(validatedGroup.data);
        if (res.success) {
          toast({
            title:"Group Chat Created",
            description: `Group ${groupName} was created`,
            status: 'success',
            duration: 3000
          })
          handleNewGroupChat(res.group);
          cleanUpCloseModal()
        } else {
          toast({
            title:"ERROR",
            status: 'error',
            duration: 3000
          })
        }
      }
    }
  }
    return (
      <Box
        aspectRatio={1}
        height="48px"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        borderRadius="25px"
        ref={avatarRef}
        color="limegreen"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="#2E3036"
        cursor="pointer"
        onClick={onOpen}
      >
        <AddIcon boxSize={4} />
        <Modal isOpen={isOpen} onClose={() => cleanUpCloseModal()}>
          <ModalOverlay />
          <ModalContent backgroundColor="#2E3036">
            <ModalHeader color="gray.300">
              Customize Your Group
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody color="gray.300">
              <Text mb="8px">Group Name</Text>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Name"
              />
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button onClick={(e) => cleanUpCloseModal()}>Back</Button>
                <Button onClick={createGroupChat}>Create</Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    )
  
}

export default function GroupChat(props: GroupChatProps) {
  const { user, handleNewGroupChat, handleSelectedGroupChatChange } = props;
  const container = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: container })

  const onMouseOver = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { borderRadius: "10px", duration: 0.4, ease: "expo.out" })
  })

  const onMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { borderRadius: "25px", duration: 0.4, ease: "expo.out"})
  })

  return (
    <VStack spacing={5} paddingTop="1em" ref={container}>
      {user.groups.map(groupChat => {
        return (
          <Box cursor="pointer" onClick={(e) => handleSelectedGroupChatChange(groupChat)} className="group__chat__wrapper" key={groupChat._id}>
            <Avatar 
              name={groupChat.groupName} 
              size="md" 
              borderRadius="25px"
              onMouseEnter={onMouseOver}
              onMouseLeave={onMouseLeave}
            />
          </Box>
        )
      })}
      {/* Create Group Chat */}
      <CreateGroupChat handleNewGroupChat={handleNewGroupChat} user={user} />
    </VStack>
  )


}