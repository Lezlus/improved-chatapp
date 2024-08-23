import { 
  Box,
  HStack,
  Divider,
} from '@chakra-ui/react'

interface NavBarProps {
  children: React.ReactNode
}

export default function NavBar({ children }: NavBarProps) {
  return (
    <Box className="nav" background="black">
      <HStack height="5vh">
        {children}
      </HStack>
      <Divider />
    </Box>
  )
}