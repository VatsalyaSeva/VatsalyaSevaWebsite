"use client";
import { Applicant, Vacancy } from "@prisma/client";
import React, { useState, useEffect, useCallback } from "react";
import { Loader } from "../../../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next";
import ReactHtmlParser from "react-html-parser";
import { AppProps } from "next/app";
import { api } from "../../../../utils/api";
import moment from "moment";
import Lottie from "lottie-react";
import { useFilePicker } from "use-file-picker";
import { sanityClient } from "../../../../server/storage";
import { basename } from "path";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../../server/api/trpc";

ViewSingleJob.getInitialProps = async (ctx: { query: { id: string } }) => {
  return { id: ctx.query.id };
};

export default function ViewSingleJob(pageProp: AppProps["pageProps"]) {
  type vacancy = Vacancy & {
    applecants: Applicant[];
  };
  const [jobData, setJobData] = useState<vacancy>({} as vacancy);
  const addQRCode = api.vacancy.addQRCode.useMutation();
  const removeQRCode = api.vacancy.removeQRCode.useMutation();
  const router = useRouter();
  const [openFileSelector, { filesContent, loading, errors, clear }] =
    useFilePicker({
      accept: "image/*",
      multiple: false,
      readAs: "ArrayBuffer",
      maxFileSize: 4,
    });

  useEffect(() => {
    if (filesContent.length > 0 && !errors[0]?.fileSizeToolarge) {
      const file = filesContent[0];
      if (file) {
        const n = Buffer.from(file.content);
        sanityClient.assets
          .upload("image", n, {
            filename: basename(file.name),
          })
          .then((data) => {
            addQRCode.mutate({
              vacancyId: pageProp.id,
              qrCodePath: data._id,
              qrCodePathUrl: data.url,
            });
          });
      }
    }
  }, [filesContent, errors]);

  const getSingleJob = api.vacancy.getById.useQuery({
    id: pageProp.id,
    applicant: true,
  });
  useEffect(() => {
    if (getSingleJob.isSuccess) {
      if (getSingleJob.data != null) {
        setJobData(getSingleJob.data);
      }
    }
  }, [getSingleJob.data]);

  useEffect(() => {
    if (addQRCode.isSuccess) {
      if (getSingleJob.data != null) {
        setJobData({
          ...jobData,
          qrCodePath: getSingleJob.data.qrCodePath,
          qrCodePathUrl: getSingleJob.data.qrCodePathUrl,
        });
      }
    }
  }, [addQRCode.data]);

  useEffect(() => {
    if (removeQRCode.isSuccess) {
      if (removeQRCode.data != null) {
        setJobData({
          ...jobData,
          qrCodePath: removeQRCode.data.qrCodePath,
          qrCodePathUrl: removeQRCode.data.qrCodePathUrl,
        });
      }
    }
  }, [removeQRCode.data]);

  return (
    <div className="h-min-[100vh] container flex w-[100vw] justify-center">
      {getSingleJob.isLoading ? (
        <div className="grid h-[400px] w-[100vw] place-content-center">
          <Lottie
            animationData={require("../../../../../public/lottie/loading.json")}
            className="h-[50px] w-[50px]"
          />
        </div>
      ) : (
        <div className="w-[100vw] px-4 py-10 md:px-8 lg:w-[80vw]">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <button
                className="flex flex-row items-center"
                onClick={() => router.back()}
              >
                <FontAwesomeIcon icon={faArrowLeft} fontSize={24} />
              </button>
              <p className="text-lg font-bold md:text-xl ">
                {jobData.vacancyName}
              </p>
            </div>
            <button
              className="rounded-lg  bg-green-700 px-3 py-1 text-white"
              onClick={() =>
                router.push(`/admin/job/editSingleJob/${jobData.id}`)
              }
            >
              Edit
            </button>
          </div>
          {Object.keys(jobData).length > 0 && (
            <div className="my-4 mx-4 md:mx-8">
              <div className=" ">
                <div className="">
                  <div className="flex w-full items-center space-x-5">
                    <div className="h-full ">
                      {jobData.qrCodePathUrl ? (
                        <div className="relative border">
                          <img
                            src={jobData.qrCodePathUrl}
                            className="h-[200px] w-[180px] rounded-lg"
                          />
                          <div className="absolute top-[10px] right-[10px] z-[3px]">
                            <FontAwesomeIcon
                              icon={faTrash}
                              fontSize={20}
                              color={"red"}
                              onClick={() =>
                                removeQRCode.mutate({
                                  vacancyId: pageProp.id,
                                  qrCodePath: jobData.qrCodePath
                                    ? jobData.qrCodePath
                                    : "",
                                })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid h-[200px] w-[180px] place-content-center rounded-lg bg-tri">
                          <button
                            className="rounded-md bg-sec px-3 py-1 text-sm text-white"
                            onClick={() => openFileSelector()}
                          >
                            Add QR
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className=" mt-2 text-black">
                        Vacancy ID:{jobData.id}
                      </p>
                      <p className=" mt-2 text-black">
                        Salary: ₹{jobData.salary}
                      </p>
                      <p className=" mt-2 text-black">
                        Form Fees: ₹{jobData.fees}
                      </p>
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
                  </div>
                  <div className="my-4 flex flex-col justify-center rounded-lg bg-pri px-4 py-4">
                    <p className=" font-semibold text-black">
                      Last Form Submission Date:{" "}
                      {moment(jobData.lastSubmissionDate).format(
                        " MMMM Do YYYY"
                      )}
                    </p>
                    <p className=" mt-2 text-black">
                      Interview Date:{" "}
                      {moment(jobData.interviewDate).format(" MMMM Do YYYY")}
                    </p>
                  </div>

                  <div className="text-md py-2">
                    {ReactHtmlParser(jobData.vacancyDescription)}
                  </div>
                  <div>
                    <p className="mb-4 mt-6 text-2xl text-sec">
                      All Applicants
                    </p>
                    {jobData.applecants.length > 0 ? (
                      jobData.applecants.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="my-2 flex flex-row items-center justify-between rounded-lg bg-tri px-4 py-3"
                          >
                            <div>
                              <p className="text-lg font-bold text-black">
                                {item.name}
                              </p>
                              <p className="text-sm text-black">ApplicationID:-  {item.id}</p>
                              <p className="text-sm text-black">UPI ID:-  {item.upiId}</p>
                              <p className="text-sm text-black">Phone:-  {item.phone}</p>
                              <p className="text-sm text-black">Email:-  {item.email}</p>
                            </div>
                            <a
                              className="text-md rounded-lg bg-sec px-5 py-2 font-bold text-white"
                              href={item.cvFilePathUrl}
                              target={"_blank"}
                            >
                              View CV
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <p className="my-2 flex h-[80px] w-[100%] flex-row items-center justify-center rounded-lg bg-tri px-4 py-3 text-center">
                        No Applicant found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

