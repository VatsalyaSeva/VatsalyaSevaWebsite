"use client";

import React, { useEffect, useState } from "react";
import UserLayout from "../../components/userLayout";
import { Vacancy } from "@prisma/client";
import { useRouter } from "next/navigation";
import { api } from "../../utils/api";
import { Box, Heading,Grid, GridItem, Stack,Text, Flex, Center } from "@chakra-ui/react";
import ReactHtmlParser from 'react-html-parser'; 


export default function Jobs() {
  const [jobList, setJobList] = useState<Vacancy[]>([]);
  const router = useRouter();
  const getAllJobs = api.vacancy.getAll.useQuery();

  useEffect(() => {
    if (getAllJobs.isSuccess) {
      setJobList(getAllJobs.data);
    }
  }, [getAllJobs.data]);

  return (
    <UserLayout>
      <Heading
        mt="8"
        mb="3"
        mx="5"
        size={"md"}
        alignSelf={"center"}
        textAlign={"center"}
      >
        All Jobs
      </Heading>
      {jobList.length>0 ? 
        <Grid templateColumns={{lg:'repeat(3, 1fr)',sm:'repeat(1,1fr)'}} gap={6} mx={'4'} >
        {jobList.map((item, index) => {
          return (
            <GridItem w='100%' h='100%' bg={'gray.50'} px='5' py='5'rounded={'xl'} boxShadow={'lg'} >
                <Stack spacing={'5'}>
                    <div>
                        <p className="text-lg font-medium">{item.vacancyName}</p>
                        <p className="pb-2 text-sm">
                        {ReactHtmlParser(item.vacancyDescription.slice(0, 90))}
                        </p>
                        <div className="flex lg:flex-row sm:flex-column items-center justify-between border-t-2 border-t-red-600 pt-3">
                        <p className="text-sm font-medium text-gray-700">
                            Job Location
                        </p>
                        <p className="text-sm">{item.location}</p>
                        </div>
                        <div className="flex lg:flex-row sm:flex-column items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                            Accepted Salary
                        </p>
                        <p className="text-sm">{item.salary} ₹</p>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                            Total Posts
                        </p>
                        <p className="text-sm">{item.jobCount}</p>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                            Application Last Date
                        </p>
                        <p className="text-sm">
                            {new Date(item.lastSubmissionDate).toDateString()}
                        </p>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                            Interview Date
                        </p>
                        <p className="text-sm">
                            {new Date(item.interviewDate).toDateString()}
                        </p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-end space-x-3">
                        <p className="text-sm font-medium text-gray-700">
                        Application Fees : {item.fees} ₹
                        </p>
                        <button
                        className="rounded-lg bg-red-600 px-5 py-1 text-white"
                        onClick={() => {
                            router.push(`jobs/${item.id}`);
                        }}
                        >
                        Apply
                        </button>
                    </div>
                </Stack>
            </GridItem>
          );
        })}
        </Grid>:
        <Flex width={'100%'} height={'300px'} >
          <Center width={'100%'} height={'100%'}>
            <Text textAlign={'center'}>No Job Found</Text>
          </Center>
        </Flex>
      }
      
    </UserLayout>
  );
}
