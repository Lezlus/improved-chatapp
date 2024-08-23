"use client";

import { SessionProvider } from "next-auth/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react"; 
import { GlobalStyleProps } from "@chakra-ui/theme-tools";
import { Session } from "next-auth";

type Props = {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  return (
  <SessionProvider>
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  </SessionProvider>
  )
}

export default AuthProvider;