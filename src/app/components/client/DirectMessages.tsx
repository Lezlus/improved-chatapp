
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
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MouseEventHandler, useRef } from "react";
import AvatarRow from "./util/AvatarRow";
import { useSession } from "next-auth/react";
import { validateUsersSchema, UserType } from "../../../../types/clientSchemas";
import { UserUnpopulatedType } from "../../../../types/clientSchemas/userUnpopulated";

interface DirectMessageRowProps {
  onMouseEnter: MouseEventHandler<HTMLSpanElement>
  onMouseLeave: MouseEventHandler<HTMLSpanElement>
  user: UserUnpopulatedType;
  handleSelectedFriendChange: (friend: UserUnpopulatedType) => void;

}

interface DirectMessagesProps {
  user: UserType;
  handleSelectedFriendChange: (friend: UserUnpopulatedType) => void;
}

const DirectMessageRow = (props: DirectMessageRowProps) => {
  const { onMouseEnter, onMouseLeave, user, handleSelectedFriendChange } = props;

  return (
    <>
      <AvatarRow 
        stackProps={{
          w:"95%",
          color:"#8E9297", 
          justifyContent:"flex-start", 
          paddingInline:"1em", 
          paddingBlock:"0.6em", 
          spacing:3,
          onMouseEnter:onMouseEnter,
          onMouseLeave:onMouseLeave,
          cursor:"pointer",
        }}
        leftContent={<Avatar name={user.username}>
        <AvatarBadge boxSize="1em" bg="green.500" />
      </Avatar>}
        rightContent={<Text fontSize="sm">{user.username}</Text>}
        onClick={() => handleSelectedFriendChange(user)}
      />
    </>
  )
}

export default function DirectMessages(props: DirectMessagesProps) {
  const { user, handleSelectedFriendChange } = props;

  const container = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: container })
  const onMouseOver = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { backgroundColor: "#3F4249", color: "#A3A5A8", duration: 0, ease: "expo.out", borderRadius: '10px' })
  })

  const onMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { backgroundColor: "#303346" ,color: "#8E9297", duration: 0, ease: "expo.out", borderRadius: "0px"})
  })

  return (
    <Box>
      <Box><Heading color="#8E9297" as="h2" size="xs">DIRECT MESSAGES</Heading></Box>
      <VStack ref={container} maxH="100%">
        { user.friends.map(friend => {
          return (
          <DirectMessageRow 
            key={friend._id} 
            user={friend}
            onMouseEnter={onMouseOver}
            onMouseLeave={onMouseLeave}
            handleSelectedFriendChange={handleSelectedFriendChange}
          />
        )
        }) }
      </VStack>
    </Box>

  )

}