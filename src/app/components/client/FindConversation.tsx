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
} from '@chakra-ui/react'
import { UserType, UserUnpopulatedType } from '../../../../types/clientSchemas';

interface FindConversationProps {
  user: UserType;
  handleSelectedFriendChange: (friend: UserUnpopulatedType) => void;
}

interface FriendAvatarProps {
  friend: UserUnpopulatedType;
  handleSelectedFriendChange: (friend: UserUnpopulatedType) => void;
  handleModalClose: () => void;
}

const FriendAvatar = (props: FriendAvatarProps) => {
  const { friend, handleSelectedFriendChange, handleModalClose } = props;
  return (
    <HStack onClick={(e) => {handleSelectedFriendChange(friend), handleModalClose()} } padding="0.3em" width="100%"  cursor="pointer" _hover={{ backgroundColor: "#202225" }}>
      <Box>
        <Avatar 
          name={friend.username}
          size="xs"
        />
      </Box>
      <Box color="GrayText">
        <Text fontSize='xs'>{friend.username}</Text>
      </Box>
    </HStack>
  )
}

export default function FindConversation(props: FindConversationProps) {
  const { user, handleSelectedFriendChange } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModalClose = () => {
    onClose();
  }

  return (
    <Box marginBlock="0.5em">
      <Box onClick={onOpen} cursor="pointer" width="90%" margin="0 auto" backgroundColor="#202225" color="GrayText">
        <Text padding="0.3em" fontSize='sm'>Find or start a conversation</Text>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#2E3036">
          <ModalHeader>
            <Box>
              <Input borderColor="transparent" backgroundColor="#202225" color="white" type="text" placeholder='Where would you like to go?' />
            </Box>
          </ModalHeader>
          <ModalBody>
            <Box>
              <Heading as="h3" size="sm" color="GrayText">Friends</Heading>
              <VStack spacing={0} marginTop={2} overflowY="scroll" maxHeight="170px"  alignItems="flex-start">
                {user.friends.map((friend) => {
                  return <FriendAvatar handleModalClose={handleModalClose} handleSelectedFriendChange={handleSelectedFriendChange} key={friend._id} friend={friend} />;
                })}
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}