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
  AvatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { UserType, validateUsersSchema } from '../../../../types/clientSchemas';
import { ActivityStatusType } from '../../../../modelSchemas/users';
import { activityStatusColor, activityStatusText } from './types';
import { MoonIcon, ViewOffIcon } from '@chakra-ui/icons';

interface UserAvatarProps {
  user: UserType;
  handleChangeActivityStatus: (status: ActivityStatusType) => void;
}

export default function UserAvatar(props: UserAvatarProps) {
  const { user, handleChangeActivityStatus } = props

  return (
    <Box backgroundColor="#252729">
      <Menu>
        <MenuButton>
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
            leftContent={<Avatar name={user.name}>
              <AvatarBadge boxSize="1em" bg={activityStatusColor(user.activityStatus)} />
            </Avatar>}
            rightContent={
              <VStack>
                <Text fontSize="xs">{user.name}</Text>
                <Text fontSize="xs">{activityStatusText(user.activityStatus)}</Text>
              </VStack>
            }
          />
        </MenuButton>
        <MenuList backgroundColor="#252729" color="white">
          <MenuItem backgroundColor="#252729" onClick={() => handleChangeActivityStatus("ONLINE")}>
            <HStack>
              <Box height="10px" backgroundColor="green.500" aspectRatio={1} borderRadius="4px"></Box>
              <Text fontSize="sm">Online</Text>
            </HStack>
          </MenuItem>
          <MenuDivider />
          <MenuItem backgroundColor="#252729" onClick={() => handleChangeActivityStatus("AWAY")}>
            <HStack>
              <MoonIcon boxSize={4} color="#ecb511" />
              <Text fontSize="sm">Away</Text>
            </HStack>
          </MenuItem>
          <MenuItem backgroundColor="#252729">
            <HStack>
              <ViewOffIcon boxSize={4} color="#ef1e1e" onClick={() => handleChangeActivityStatus("DO NOT DISTURB")} />
              <Text fontSize="sm">Do Not Disturb</Text>
            </HStack>
          </MenuItem>
          <MenuItem backgroundColor="#252729" onClick={() => handleChangeActivityStatus("OFFLINE")}>
            <HStack>
              <Box height="10px" backgroundColor="#afabab" aspectRatio={1} borderRadius="4px"></Box>
              <Text fontSize="sm">Invisible</Text>
            </HStack>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )

} 