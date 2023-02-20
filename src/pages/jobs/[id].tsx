"use client";

import React, { FormEvent, useEffect, useState } from "react";
import UserLayout from "../../components/userLayout";
import { useRouter } from "next/navigation";
import { Vacancy } from "@prisma/client";
import type { AppProps } from "next/app";
import { api } from "../../utils/api";
import { sanityClient } from "../../server/storage";
import { basename } from "path";
import ReactHtmlParser from 'react-html-parser'; 
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Image,
  Text,
  Heading,
} from "@chakra-ui/react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

Jobs.getInitialProps = async (ctx: { query: { id: string } }) => {
  return { id: ctx.query.id };
};

export default function Jobs(pageProp: { id: string }) {
  const route = useRouter();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cvFile, setCvFile] = useState<File>({} as File);
  const [transactionId, setTransactionId] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [jobData, jobSetData] = useState<Vacancy>({} as Vacancy);
  const [applicationID,setApplicationID] = useState<string>('')

  const getSingleJob = api.vacancy.getById.useQuery({
    id: pageProp.id,
    applicant: false,
  });
  const addApplicant = api.applicants.createRecord.useMutation();

  useEffect(() => {
    if (getSingleJob.isSuccess) {
      const data = getSingleJob.data;
      if (data) {
        jobSetData(data);
        
      }
    }
  }, [getSingleJob.data]);

  useEffect(() => {
    if(addApplicant.isLoading){
        setIsLoading(true)
    }
    if (addApplicant.isSuccess) {
      const a = addApplicant.data;
      if (a.code == 400) {
        setServerError(a.message);
        if(a.data?.id){
          setApplicationID(a.data.id)
        }
        setIsLoading(false)
      } else {
        if(a.data){
          setApplicationID(a.data.id)
        }
        setIsSuccess(true);
      }
    }
  }, [addApplicant.data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await sanityClient.assets.upload("file", cvFile, {
      filename: `${name}_${email}${transactionId}`,
    });

    if (data) {
      setIsLoading(false);
      addApplicant.mutate({
        vacancyId: pageProp.id,
        add: {
          name: name,
          phone: phone,
          email: email,
          transactionId: transactionId,
          upiId: upiId,
          cvFilePath: data._id,
          cvFilePathUrl: data.url,
        },
      });
    }
  };



  return (
    <UserLayout>
        <div className="flex justify-center items-center my-5">
            <Box width={['xs','container.sm','container.md']} >
                {Object.keys(jobData).length > 0 && (
                    <div className="my-4 mx-4 md:mx-8">
                    <div className=" ">
                        <div className="">
                            <div className="flex items-center gap-x-3">
                                <FontAwesomeIcon 
                                    icon={faArrowLeft} fontSize={28} onClick={()=> route.back()}/>
                                <Heading my='5' size={'lg'} >{jobData.vacancyName}</Heading>

                            </div>
                        <div>
                            <p className=" mt-2 text-black">Vacancy ID:{jobData.id}</p>
                            <p className=" mt-2 text-black">Salary: ₹{jobData.salary}</p>
                            <p className=" mt-2 text-black">Form Fees: ₹{jobData.fees}</p>
                            <p className=" mt-2 text-black">
                            Job Count: {jobData.jobCount}
                            </p>
                            <p className=" mt-2 text-black">
                            Job Location: {jobData.location}
                            </p>
                            <p className=" mt-2 text-black">
                            Job Created: {`${jobData.createdAt}`}
                            </p>
                        </div>

                        <div className="my-4 flex flex-col justify-center rounded-lg bg-pri px-4 py-4">
                            <p className=" font-semibold text-black">
                            Last Form Submission Date:{" "}
                            {moment(jobData.lastSubmissionDate).format(" MMMM Do YYYY")}
                            </p>
                            <p className=" mt-2 text-black">
                            Interview Date:{" "}
                            {moment(jobData.interviewDate).format(" MMMM Do YYYY")}
                            </p>
                        </div>

                        <div className="text-md py-2">
                            {ReactHtmlParser(jobData.vacancyDescription)}
                        </div>
                        </div>
                    </div>
                    </div>
                )}
                <div className="my-4 mx-4 md:mx-8">
                    {isLoading || isSuccess || serverError.length>0?
                    <Box >
                        {isLoading && <Heading size={'md'}>Submitting...</Heading>}
                        {isSuccess && 
                          <Box>
                            <Heading size={'md'}>Application Submitted Successfully</Heading> 
                            <Text>Your Application ID:- {applicationID}</Text>
                          </Box>
                        }
                        {serverError.length>0 && 
                          <Box>
                            <Heading size={'md'}>{serverError}</Heading>
                            <Text>Your Application ID:- {applicationID}</Text>
                          </Box>
                        }
                    </Box>:
                    <Box >
                        <h1 className="color-black my-8 text-2xl font-bold self-center text-center">
                            Vacancy Form
                        </h1>
                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <Stack spacing={5} >
                            <FormControl isRequired>
                                <FormLabel size={"xs"}>First name</FormLabel>
                                <Input
                                size={"md"}
                                variant="outline"
                                type={"text"}
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel size={"xs"}>Phone Number</FormLabel>
                                <InputGroup>
                                <InputLeftAddon children="+91" />
                                <Input
                                    size={"md"}
                                    variant="outline"
                                    type={"tel"}
                                    name="phone"
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter phone"
                                />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel size={"xs"}>Email Address</FormLabel>

                                <Input
                                size={"md"}
                                variant="outline"
                                type={"email"}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel size={"xs"}>Upload your CV (.pdf)</FormLabel>

                                <Input
                                size={"md"}
                                variant="outline"
                                type={"file"}
                                name="cv"
                                onChange={(e) => {
                                    if (e.target.files != null) {
                                    if (e.target.files[0] != undefined) {
                                        setCvFile(e.target.files[0]);
                                    }
                                    }
                                }}
                                placeholder="upload CV"
                                accept="application/pdf"
                                />
                            </FormControl>

                            {typeof (jobData.qrCodePathUrl) == "string" && (
                                <div className="flex w-full flex-col justify-center">
                                <Stack spacing={5}>
                                    <FormControl isRequired>
                                    <FormLabel size={"xs"}>Enter UPI Id</FormLabel>
                                    <Input
                                        size={"md"}
                                        variant="outline"
                                        type={"text"}
                                        name="text"
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="Enter UPI Id"
                                    />
                                    </FormControl>
                                    <label className="text-md mt-3 mb-2 text-center">
                                    Scan QR:- Form Fees of ₹{jobData.fees}
                                    </label>
                                    <div className="self-center">
                                        <Box boxSize="sm" >
                                        <Image
                                            boxSize={"sm"}
                                            objectFit="contain"
                                            src={jobData.qrCodePathUrl}
                                        />
                                        </Box>

                                    </div>
                                    <p className="mb-4 w-[30vw] self-center text-center text-sm">
                                    After the QR Payment, enter your UPI ID and
                                    transaction Id in the form.
                                    </p>
                                    <FormControl isRequired>
                                    <FormLabel size={"xs"}>
                                        Enter Transaction Id
                                    </FormLabel>
                                    <Input
                                        size={"md"}
                                        variant="outline"
                                        type={"text"}
                                        name="text"
                                        onChange={(e) =>
                                        setTransactionId(e.target.value)
                                        }
                                        placeholder="Enter Transaction Id"
                                    />
                                    </FormControl>
                                </Stack>

                                <button
                                    className="mt-2 w-full rounded-md bg-amber-600 px-4 py-1 text-white"
                                    type="submit"
                                >
                                    Apply
                                </button>
                                </div>
                            )}
                            </Stack>
                        </form>
                    </Box>}
                
                </div>
            </Box>
        </div>
    </UserLayout>
    
  );
}
