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
    StackProps,
    BoxProps
  } from '@chakra-ui/react'
import React from 'react'

interface AvatarRowProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  stackProps: BoxProps & StackProps;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

export default function AvatarRow(props: AvatarRowProps) {
  const { leftContent, rightContent, stackProps, onClick } = props;

  return (
    <HStack {...stackProps} onClick={onClick}>
      <Box>{leftContent}</Box>
      <Box>{rightContent}</Box>
    </HStack>
  )
}