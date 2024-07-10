'use client';

import { Avatar, HStack, VStack, Text } from "@chakra-ui/react";
import { DirectMessageSchemaType, GroupMessageSchemaType } from "../../../../../types/clientSchemas";
import { dateFormatter } from "@/lib/dateFormatter";

interface ChatMessageProps {
  message: DirectMessageSchemaType | GroupMessageSchemaType
}

export default function ChatMessage(props: ChatMessageProps) {
  const { message } = props;
  return (
    <HStack p="1em">
      <Avatar name={message.senderId.username} />
      <VStack align="start" spacing={0}>
        <HStack>
          <Text fontWeight="bold" color="white">{message.senderId.username}</Text>
          <Text fontSize="sm" color="gray.400">{dateFormatter(message.createdAt)}</Text>
        </HStack>
        <Text color="gray.300">{message.content}</Text>
      </VStack>
    </HStack>
  )
}