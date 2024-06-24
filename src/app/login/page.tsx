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
  InputRightElement,
} from '@chakra-ui/react';
import React, { useState, FormEvent } from 'react';
import { validateUsersSchema, validateRegisterLoginUser } from '../../../types/users';
import fetchData from '@/lib/fetchData';
import AuthService from '../_services/authService';
import { useRouter } from 'next/navigation';
import sleep from '@/lib/sleep';
import { signIn } from 'next-auth/react';
import "../styles/app.scss";
import "../styles/registerPage.scss";
import Link from 'next/link';

type LoginFormType = {
  username: string;
  password: string;
}

interface LoginFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginFormElements;
}


export default function LoginPage() {
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<LoginFormElement>) {
    event.preventDefault();
    try {
      const newUser: LoginFormType = {
        username: event.currentTarget.elements.username.value,
        password: event.currentTarget.elements.password.value
      }

      let res = await signIn("credentials", {
        username: newUser.username,
        password: newUser.password,
        redirect: false,
      })
      if (res?.error) {
        setIsError(true);
        setAlertMsg("Username or password wrong");
      }
      setShowAlert(true);
      if (res?.ok) {
        setAlertMsg("Logging in");
        await sleep(1000);
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <Container className="container">
      <Box className="register__box">
        <Heading>Login</Heading>
        <form onSubmit={onSubmit}>
          <FormControl isRequired className="form__control">
            <FormLabel>Username</FormLabel>
            <Input backgroundColor="white" name='username' type="text" />
            <FormHelperText>Must Be Greater than 1 character</FormHelperText>
          </FormControl>
          <FormControl isRequired className="form__control">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} backgroundColor="white" name='password' />
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
        <Link href="/register">{`Don't Have an account? Register Here`}</Link>
      </Box>
    </Container>
  )
}