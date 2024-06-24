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

interface Friend {
  name: string;
  id: string;
}

const friends: Friend[] = [
  {name: "Rafael B", id: '1'},
  {name: "Vic B", id: '2'},
  { name: "Sarah E", id: '3' },
  { name: "Mary T", id: '4' },
  { name: "Adonis Y", id: '5' },
  { name: "Gary D", id: '8' }
]

const FriendAvatar = (props: { friend: Friend }) => {
  return (
    <HStack padding="0.3em" width="100%"  cursor="pointer" _hover={{ backgroundColor: "#202225" }}>
      <Box>
        <Avatar 
          name={props.friend.name}
          size="xs"
        />
      </Box>
      <Box color="GrayText">
        <Text fontSize='xs'>{props.friend.name}</Text>
      </Box>
    </HStack>
  )
}

export default function FindConversation() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                {friends.map((friend) => {
                  return <FriendAvatar key={friend.id} friend={friend} />;
                })}
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}