import { MainViews } from "../types";
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
import AvatarRow from "../util/AvatarRow";

interface FriendsOptionProps {
  onMouseEnter: MouseEventHandler<HTMLSpanElement>;
  onMouseLeave: MouseEventHandler<HTMLSpanElement>;
  handleViewChange: (view: MainViews) => void;
}

export default function FriendsOption(props: FriendsOptionProps) {
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
