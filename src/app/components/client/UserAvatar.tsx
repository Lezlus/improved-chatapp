import AvatarRow from './util/AvatarRow';
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
  AvatarBadge
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { validateUsersSchema } from '../../../../types';

export default function UserAvatar() {
  const { data: session, status } = useSession();
  const userData = validateUsersSchema(session?.user);

  return (
    <Box backgroundColor="#252729">
      <AvatarRow
        stackProps={{
          w:"95%",
          color:"#8E9297",
          justifyContent:"flex-start",
          paddingInline:"1em",
          paddingBlock:"0.6em",
          spacing:5,
          cursor:"pointer",
        }}
        leftContent={<Avatar name={userData.name}>
          <AvatarBadge boxSize="1em" bg="green.500" />
        </Avatar>}
        rightContent={
          <VStack>
            <Text fontSize="xs">{userData.name}</Text>
            <Text fontSize="xs">Online</Text>
          </VStack>
        }
      />
    </Box>
  )

} 