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
  Avatar,
  Icon,
} from '@chakra-ui/react'
import { FaUserFriends } from 'react-icons/fa';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MouseEventHandler, useRef } from "react";
import AvatarRow from './util/AvatarRow';
import { MainViews } from './types';

interface FriendsOptionProps {
  onMouseEnter: MouseEventHandler<HTMLSpanElement>;
  onMouseLeave: MouseEventHandler<HTMLSpanElement>;
  handleViewChange: (view: MainViews) => void;
}

interface TabOptionProps {
  handleViewChange: (view: MainViews) => void;
}

const FriendsOption = (props: FriendsOptionProps) => {
  const { onMouseEnter, onMouseLeave, handleViewChange } = props;
  return (
    <>
      <AvatarRow 
        leftContent={<Icon boxSize={9} as={FaUserFriends} />}
        rightContent={<Text fontSize="md">Friends</Text>}
        stackProps={{
          w:"95%",
          color:"#8E9297",
          justifyContent:"flex-start",
          paddingInline:"1em",
          paddingBlock:"0.6em",
          spacing:5,
          onMouseEnter:onMouseEnter,
          onMouseLeave:onMouseLeave,
          cursor:"pointer",
          }}
        onClick={(e) => handleViewChange("FRIENDS")}
      />
    </>
  )
}

export default function TabOption (props: TabOptionProps) {
  const container = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: container })

  const { handleViewChange } = props;

  const onMouseOver = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { backgroundColor: "#3F4249", color: "#A3A5A8", duration: 0.1, ease: "power1.in", borderRadius: '10px' })
  })

  const onMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { backgroundColor: "#303346" ,color: "#8E9297", duration: 0.1, ease: "power1.in", borderRadius: "0px" })
  })

  return (
    <Box>
      <VStack ref={container} alignItems="center">
        <FriendsOption handleViewChange={handleViewChange} onMouseEnter={onMouseOver} onMouseLeave={onMouseLeave} />
      </VStack>
    </Box>
  )
}