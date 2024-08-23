import { MainViews } from "../types";
import FriendsOption from "./FriendsOption";
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

interface TabOptionProps {
  handleViewChange: (view: MainViews) => void;
}

export default function TabOption (props: TabOptionProps) {
  const container = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: container })

  const { handleViewChange } = props;

  const onMouseOver = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { backgroundColor: "#1e1e1e", color: "#A3A5A8", duration: 0.1, ease: "power1.in", borderRadius: '10px' })
  })

  const onMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, { backgroundColor: "#000000" ,color: "#8E9297", duration: 0.1, ease: "power1.in", borderRadius: "0px" })
  })

  return (
    <Box>
      <VStack ref={container} alignItems="center">
        <FriendsOption handleViewChange={handleViewChange} onMouseEnter={onMouseOver} onMouseLeave={onMouseLeave} />
      </VStack>
    </Box>
  )
}