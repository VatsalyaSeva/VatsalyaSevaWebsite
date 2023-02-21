import {
  faCalendar,
  faCoins,
  faFile,
  faImage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Stack,Image } from "@chakra-ui/react";
import { api } from "../../utils/api";

export default function Admin() {
  const router = useRouter();

  const [email,setEmail] = useState<string>('')
  const [password,setPassword] = useState<string>('')

  const login = api.admin.login.useMutation({
    onSuccess: (data) => {
      console.log(data);
      router.replace('/admin/dashboard')
    },
    onError: (data) => {
      console.log(data);
    },
  });

  return (
    <Flex width={'100vw'} height={'100vh'}>
      <Center width={'100%'} height={'100%'}>
        <Stack spacing={5}>
          <Box>
            <Image src={'/logo.jpg'} width={'200px'} height={'250px'}/>
          </Box>
        {/* <Heading fontSize={'xl'} textAlign='center' mb='8' mt='2'>Admin Login</Heading> */}
          <FormControl isRequired>
            <FormLabel size={"xs"}>Enter Email</FormLabel>
            <Input
              size={"md"}
              variant="outline"
              type={"text"}
              name="name"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel size={"xs"}>Enter Password</FormLabel>
            <Input
              size={"md"}
              variant="outline"
              type={"text"}
              name="name"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter name"
            />
          </FormControl>
          <Button
              onClick={()=> login.mutate({
                  email:email,
                  password:password
              })}
          >Login</Button>
          
        </Stack>
      </Center>
    </Flex>
  );
}
