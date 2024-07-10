'use client';
import { 
  Container,
  Grid,
  GridItem,
  Flex,
  Stack,
  VStack,
  StackDivider,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import "../styles/app.scss";
import "../styles/registerPage.scss";
import React, { useState, FormEvent } from 'react';
import { validateUsersSchema, validateRegisterLoginUser } from '../../../types/clientSchemas/users';
import fetchData from '@/lib/fetchData';
import AuthService from '../_services/authService';
import { useRouter } from "next/navigation";
import sleep from '@/lib/sleep';
import Link from 'next/link';

type RegisterFormType = {
  username: string;
  password: string;
}

interface RegisterFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface RegisterFormElement extends HTMLFormElement {
  readonly elements: RegisterFormElements;
}



export default function RegisterPage() {
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<RegisterFormElement>) {
    event.preventDefault();
    const newUser: RegisterFormType = {
      username: event.currentTarget.elements.username.value,
      password: event.currentTarget.elements.password.value
    }

    const {success, data, error} = await validateRegisterLoginUser(newUser);
    if (success) {
      let res = await AuthService.register(data);
      if (res.message.userTaken) {
        setIsError(true);
        setAlertMsg("User Taken");
      }
      setShowAlert(true);
      if (!res.message.userTaken) {
        setAlertMsg("User Created");
        await sleep(1000);
        router.push("/login");
      }
    } else {
      setIsError(true);
      setShowAlert(true);
      setAlertMsg("Either Username or password too short")
    }
  }

  return (
    <Container className="container">
      <Box className="register__box">
        <Heading>Register</Heading>
        <form onSubmit={onSubmit}>
          <FormControl mb={2} isRequired className="form__control">
            <FormLabel>Username</FormLabel>
            <Input backgroundColor="white" name='username' type="text" />
            <FormHelperText>Must Be Greater than 3 characters</FormHelperText>
          </FormControl>
          <FormControl mb={2} isRequired className="form__control">
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input backgroundColor="white" name='password' type={showPassword ? "text" : "password"}  />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={(e) => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText>Must Be Greater then 5 characters</FormHelperText>
          </FormControl>
          <Button colorScheme="blue" type='submit'>Submit</Button>
        </form>
        {showAlert && 
          <Alert status={isError ? "error" : "success"}>
            <AlertIcon />
            <AlertTitle>{alertMsg}</AlertTitle>
          </Alert>
        }
        <Link color='white' href="/login">{`Have an account? Login Here`}</Link>
      </Box>
    </Container>
  )
}