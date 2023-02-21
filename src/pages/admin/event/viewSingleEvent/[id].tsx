"use client";
import { Vacancy, SpecialGuest, Performer, Member, Organizers } from "@prisma/client";
import React, { useState, useEffect, useCallback } from "react";
import { Loader } from "../../../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDeleteLeft, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next";
import ReactHtmlParser from "react-html-parser";
import { AppProps } from "next/app";
import { api } from "../../../../utils/api";
import moment from "moment";
import Modal from "react-overlays/Modal";
import { sanityClient } from "../../../../server/storage";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../../server/api/trpc";

let ModeType = {
  cover: "cover",
  guest: "guest",
  organizer: "organizer",
  performer: "performer",
  eventImage: "eventImage",
  eventVideo: "eventVideo",
};

type ModelKeys = keyof typeof ModeType;

ViewSingleEvent.getInitialProps = async (ctx: { query: { id: string; }; }) => {
  return { id: ctx.query.id };
};

export default function ViewSingleEvent(pageProp: AppProps["pageProps"]) {
  const [eventData, setEventDate] = useState<(typeof getSingleEvent)["data"]>(
    {} as (typeof getSingleEvent)["data"]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelVisibility, setModelVisibility] = useState<boolean>(false);
  const [selectedModelType, setSelectedModelType] = useState<
    ModelKeys | string
  >("");
  const [selectedGuest,setSelectedGuest] = useState<SpecialGuest>({} as SpecialGuest)
  const [selectedPerformer,setSelectedPerformer] = useState<Performer>({} as Performer)
  const router = useRouter();

  const getSingleEvent = api.event.getById.useQuery({ id: pageProp.id });
  const removeCover = api.event.removeCoverImage.useMutation()
  const removeSingleImage = api.event.removeEventImage.useMutation()
  const removeSingleVideo = api.event.removeEventVideo.useMutation()
  const removeSingleGuest = api.event.removeSpecialGuest.useMutation()
  const removeSinglePerformer = api.event.removePerformer.useMutation()
  const removeSingleOrganizer = api.event.removeOrganizer.useMutation()

  useEffect(() => {
    if (getSingleEvent.isSuccess) {
      if (getSingleEvent.data != null) {
        setEventDate(getSingleEvent.data);
      }
    }
  }, [getSingleEvent.data]);

  useEffect(() => {
    if (removeCover.isSuccess) {
        getSingleEvent.refetch()
    }
  }, [removeCover.isSuccess]);

  useEffect(() => {
    if (removeSingleImage.isSuccess) {
        getSingleEvent.refetch()
    }
  }, [removeSingleImage.isSuccess]);

  useEffect(() => {
    if (removeSingleVideo.isSuccess) {
        getSingleEvent.refetch()
    }
  }, [removeSingleVideo.isSuccess]);

  useEffect(() => {
    if (removeSingleGuest.isSuccess) {
        getSingleEvent.refetch()
    }
  }, [removeSingleGuest.isSuccess]);

  useEffect(() => {
    if (removeSinglePerformer.isSuccess) {
        getSingleEvent.refetch()
    }
  }, [removeSinglePerformer.isSuccess]);

  useEffect(() => {
    if (removeSingleOrganizer.isSuccess) {
        getSingleEvent.refetch()
    }
  }, [removeSingleOrganizer.isSuccess]);
  

  return (
    <div className="h-min-[100vh] container flex w-[100vw] justify-center">
      {getSingleEvent.isLoading ? (
        <div className="w-full h-[100vh] flex justify-center items-center">
            <p>Loading</p>
        </div>
      ) : (
        eventData != null &&
        Object.keys(eventData).length > 0 && (
          <div className="w-[100vw] px-4 py-10 md:px-8 lg:w-[80vw]">
            {/* header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <button
                  className="flex flex-row items-center"
                  onClick={() => router.back()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} fontSize={24} />
                </button>
                <p className="text-lg font-bold md:text-xl ">
                  {eventData?.name}
                </p>
              </div>
              <button
                className="rounded-lg  bg-green-700 px-3 py-1 text-white"
                onClick={() =>
                  router.push(`/admin/event/editSingleEvent/${eventData?.id}`)
                }
              >
                Edit
              </button>
            </div>
            {/* cover Image */}
            <div className="my-4 mx-4 md:mx-8 flex justify-center">
              {eventData.coverImageUrl != null ? (
                <div className="relative">
                  <img
                    src={eventData.coverImageUrl}
                    alt=""
                    className="h-[50vh] w-[80vw] rounded-lg"
                  />
                  <div className="bottom-[10px] right-[10px] absolute z-[2px] space-x-2">
                    <button className=" text-white bg-red-700 rounded-lg px-3 py-1 text-sm "
                        onClick={()=> {removeCover.mutate({id:pageProp.id,coverImagePath:eventData.coverImage ? eventData.coverImage:''})}}
                    >Delete</button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[150px] w-full items-center justify-center rounded-lg bg-sec ">
                  <div className="flex h-[150px] w-full items-center justify-center rounded-lg bg-tri">
                    <button
                      className="rounded-lg bg-sec px-3 py-1"
                      onClick={() => {
                        
                        setSelectedModelType(ModeType.cover);
                        setModelVisibility(true);
                      }}
                    >
                      <p className="text-sm text-white">Add Cover Image</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* event details */}
            <div className="my-4 mx-4 md:mx-8">
              <div className=" ">
                <div className="">
                  <div className="my-4 flex flex-col justify-center space-y-2 rounded-lg bg-pri px-4 py-4">
                    <p className=" text-black">
                      Location: {eventData?.location}
                    </p>
                    <p className=" text-black">
                      Event Date:{" "}
                      {moment(eventData?.dateTime).format(" MMMM Do YYYY")}
                    </p>
                    <p className="text-black">
                      Event Time:{" "}
                      {moment(eventData?.dateTime).format("hh:mm a")}
                    </p>
                  </div>

                  <div className="text-md py-2">
                    {ReactHtmlParser(eventData?.description)}
                  </div>
                </div>
              </div>
            </div>
            {/* organizer */}
            <div className="mb-4 mt-8 mx-4 md:mx-8">
                <div className="flex justify-between items-center">
                    <p>Event Organizers</p>
                    { eventData.organizers.length > 0  && 
                        <button
                            className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                            onClick={() => {
                                setSelectedModelType(ModeType.organizer);
                                setModelVisibility(true);
                            }}
                        >Add</button>
                    }
                </div>
              <div className="my-3 flex space-x-3">
                {eventData.organizers.length > 0 ? (
                  <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 md:gap-x-3 gap-x-1 gap-y-5 place-content-center">
                  {eventData?.organizers.map((orgs, index) => {
                      return (
                      <div key={index}>
                          <div className="relative">
                            <div className="h-[130px] w-[130px] bg-tri rounded-xl grid place-content-center">
                                <p className="text-3xl text-white">{orgs.name.slice(0,2)}</p>
                            </div>
                              <button className=" absolute z-[3px] top-[5px] right-[8px]"
                                  onClick={()=> removeSingleOrganizer.mutate({id:orgs.id})}
                              >
                                  <FontAwesomeIcon icon={faTrash} color={'white'} fontSize={16}/>
                              </button>
                              
                          </div>
                          <p className="mt-3 text-sm">{orgs.name}</p>
                      </div>
                      )}
                  )}
              </div>
                ) : (
                  <div className="flex h-[150px] w-full  items-center justify-center rounded-lg">
                    <div className="flex h-[150px] w-full  flex-col items-center justify-center rounded-lg">
                      <p className="text-sm text-sec">
                        No Organizer Found for this event{" "}
                      </p>
                      <button
                        className="color-tri mt-1 text-sm font-bold "
                        onClick={() => {
                          setSelectedModelType(ModeType.organizer);
                          setModelVisibility(true);
                        }}
                      >
                        Add Organizer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* special guest */}
            <div className="mb-4 mt-8 mx-4 md:mx-8">
              <div className="flex items-center justify-between">
                <p>Special Guests</p>
                { eventData.specialGuests.length > 0  && 
                    <button
                        className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                        onClick={() => {
                            setSelectedModelType(ModeType.guest);
                            setModelVisibility(true);
                        }}
                    >Add</button>
                }
              </div>
              <div className="my-3 flex ">
                {eventData.specialGuests.length > 0 ? (
                    <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 md:gap-x-3 gap-x-1 gap-y-5 place-content-center">
                        {eventData?.specialGuests.map((guest, index) => {
                            return (
                            <div key={index}>
                                <div className="relative">
                                    {guest.profilePic != null ?
                                        <img 
                                            src={guest.profilePic} 
                                            alt="" 
                                            className="rounded-xl h-[130px] w-[130px]"
                                        />:
                                        <div className="h-[130px] w-[130px] bg-tri rounded-xl grid place-content-center">
                                            <p className="text-3xl text-white">{guest.name.slice(0,2)}</p>
                                        </div>
                                    }
                                    <button className=" absolute z-[3px] top-[5px] right-[8px]"
                                        onClick={()=> removeSingleGuest.mutate({id:guest.id})}
                                    >
                                        <FontAwesomeIcon icon={faTrash} color={'white'} fontSize={16}/>
                                    </button>
                                    <button className=" absolute z-[3px] top-[5px] right-[28px]"
                                        onClick={()=> {
                                            setSelectedGuest(guest)
                                            setSelectedModelType(ModeType.guest);
                                            setModelVisibility(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} color={'white'} fontSize={16}/>
                                    </button>
                                </div>
                                <p className="mt-3 text-sm">{guest.name}</p>
                            </div>
                            )}
                        )}
                    </div>
                ) : (
                  <div className="flex h-[150px] w-full  items-center justify-center rounded-lg">
                    <div className="flex h-[150px] w-full  flex-col items-center justify-center rounded-lg">
                      <p className="text-sm text-sec">
                        No Guest Found for this event{" "}
                      </p>
                      <button
                        className="color-tri mt-1 text-sm font-bold "
                        onClick={() => {
                          setSelectedModelType(ModeType.guest);
                          setModelVisibility(true);
                        }}
                      >
                        Add Guest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* performer */}
            <div className="mb-4 mt-8 mx-4 md:mx-8">
              <div className="flex items-center justify-between">
                <p>Event Performers</p>
                { eventData.performers.length > 0  && 
                    <button
                        className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                        onClick={() => {
                            setSelectedModelType(ModeType.performer);
                            setModelVisibility(true);
                        }}
                    >Add</button>
                }
              </div>
              <div className="my-3 flex ">
                {eventData.performers.length > 0 ? (
                    <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 md:gap-x-3 gap-x-1 gap-y-5 place-content-center">
                        {eventData?.performers.map((performer, index) => {
                            return (
                            <div key={index}>
                                <div className="relative">
                                    {performer.profilePic != null ?
                                        <img 
                                            src={performer.profilePic} 
                                            alt="" 
                                            className="rounded-xl h-[130px] w-[130px]"
                                        />:
                                        <div className="h-[130px] w-[130px] bg-tri rounded-xl grid place-content-center">
                                            <p className="text-3xl text-white">{performer.name.slice(0,2)}</p>
                                        </div>
                                    }
                                    <button className=" absolute z-[3px] top-[5px] right-[12px]"
                                        onClick={()=> removeSinglePerformer.mutate({id:performer.id})}
                                    >
                                        <FontAwesomeIcon icon={faTrash} color={'white'} fontSize={16}/>
                                    </button>
                                    <button className=" absolute z-[3px] top-[5px] right-[32px]"
                                        onClick={()=> {
                                            setSelectedPerformer(performer)
                                            setSelectedModelType(ModeType.performer);
                                            setModelVisibility(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} color={'white'} fontSize={16}/>
                                    </button>
                                </div>
                                <p className="mt-3 text-sm">{performer.name}</p>
                            </div>
                            )}
                        )}
                    </div>
                ) : (
                  <div className="flex h-[150px] w-full  items-center justify-center rounded-lg">
                    <div className="flex h-[150px] w-full  flex-col items-center justify-center rounded-lg">
                      <p className="text-sm text-sec">
                        No Guest Found for this event{" "}
                      </p>
                      <button
                        className="color-tri mt-1 text-sm font-bold "
                        onClick={() => {
                          setSelectedModelType(ModeType.performer);
                          setModelVisibility(true);
                        }}
                      >
                        Add Guest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* imageEvent */}
            <div className="mb-4 mt-8 mx-4 md:mx-8">
              <div className="flex items-center justify-between">
                <p>Additional Event Images</p>
                <button
                  className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                  onClick={() => {
                    setSelectedModelType(ModeType.eventImage);
                    setModelVisibility(true);
                  }}
                >
                  Add
                </button>
              </div>
              <div className="my-3  flex justify-center items-center">
                {eventData.additionalImages.length > 0 ? (
                    <div className="grid lg:grid-cols-4 place-content-center md:grid-cols-3 sm:grid-cols-2 gap-x-1 gap-y-1">
                        {eventData.additionalImages.map((images, index) => {
                              return (
                                <div key={index} className="relative">
                                  <img
                                    src={images.imageUrl}
                                    alt=""
                                    className="h-full w-full rounded-lg"
                                  />
                                  <button className=" absolute z-[3px] top-[5px] right-[8px]"
                                      onClick={()=> removeSingleImage.mutate({imageId:images.id,imagePath:images.image})}
                                  >
                                      <FontAwesomeIcon icon={faTrash} color={'white'} fontSize={16}/>
                                  </button>
                                </div>
                              );
                            })
                        }
                    </div>
                ) : (
                  <div className="flex h-[150px] w-full  items-center justify-center rounded-lg">
                    <p className="text-sec">No Images Found</p>
                  </div>
                )}
              </div>
            </div>
            {/* videoEvent */}
            {/* <div className="my-4 mx-4 md:mx-8">
              <div className="flex items-center justify-between">
                <p>Additional Event Videos</p>
                <button
                  className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                  onClick={() => {
                    setSelectedModelType(ModeType.eventVideo);
                    setModelVisibility(true);
                  }}
                >
                  Add
                </button>
              </div>
              <div className="my-3  flex justify-center items-center">
                {eventData.additionalVideos.length > 0 ? (
                    <div className="grid lg:grid-cols-4 place-content-center md:grid-cols-3 sm:grid-cols-2 gap-x-1 gap-y-1">
                        {eventData?.additionalVideos.map((video, index) => {
                              return (
                                <div key={index} className="relative">
                                  <video
                                    controls
                                    src={`/${video.video}`}
                                    
                                    className="h-full w-full rounded-lg"
                                  />
                                  <button className=" absolute z-[3px] top-[5px] right-[8px]"
                                      onClick={()=> removeSingleVideo.mutate({videoId:video.id})}
                                  >
                                      <FontAwesomeIcon icon={faTrash} color={'white'} fontSize={16}/>
                                  </button>
                                </div>
                              );
                            })

                        }
                    </div>
                ) : (
                  <div className="flex h-[150px] w-full  items-center justify-center rounded-lg">
                    <div className="flex h-[150px] w-full  items-center justify-center rounded-lg">
                      <p className="text-sec">No Videos Found</p>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
            <Modal
              style={{
                top: 0,
                position: "absolute",
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              backdrop={true}
              onBackdropClick={() => setModelVisibility(false)}
              show={modelVisibility}
            >
              <div className="h-min-[100vh] mx-10 my-5 w-[80vw] flex-1 rounded-2xl bg-gray-200 px-10 py-5 shadow-xl">
                <div className="flex items-start space-x-4 ">
                  <button
                    className="flex flex-row items-center"
                    onClick={() => {
                      setModelVisibility(false);
                      setSelectedModelType("");
                      setSelectedGuest({} as SpecialGuest)
                      setSelectedPerformer({} as Performer)
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} fontSize={24} />
                  </button>
                  <p className="text-lg font-bold md:text-xl ">Back</p>
                </div>
                {selectedModelType == ModeType.cover && (
                  <UploadCoverView
                    id={eventData.id}
                    defaultCover={eventData.coverImage != null? eventData.coverImage:''}
                    onSubmitSuccess={() => {
                        getSingleEvent.refetch()
                      setModelVisibility(false);
                      setSelectedModelType("");
                    }}
                  />
                )}
                {selectedModelType == ModeType.eventImage && 
                    <UploadAdditionalImage 
                        id={eventData.id} 
                        onSubmitSuccess={() => {
                            getSingleEvent.refetch()
                            setModelVisibility(false);
                            setSelectedModelType("");
                        }}
                    />
                }
                {selectedModelType == ModeType.eventVideo &&
                    <UploadAdditionalVideo
                        id={eventData.id} 
                        onSubmitSuccess={() => {
                            getSingleEvent.refetch()
                            setModelVisibility(false);
                            setSelectedModelType("");
                        }}
                    />
                }
                {selectedModelType == ModeType.guest &&
                    <AddSpecialGuest
                        id={eventData.id} 
                        onSubmitSuccess={() => {
                            getSingleEvent.refetch()
                            setModelVisibility(false);
                            setSelectedModelType("");
                            setSelectedGuest({} as SpecialGuest)
                        }}
                        mode={Object.keys(selectedGuest).length>0 ? 'UPDATE':'ADD'}
                        data={selectedGuest}
                    />
                }
                {selectedModelType == ModeType.performer &&
                    <AddPerformerGuest
                        id={eventData.id} 
                        onSubmitSuccess={() => {
                            getSingleEvent.refetch()
                            setModelVisibility(false);
                            setSelectedModelType("");
                            setSelectedPerformer({} as Performer)
                        }}
                        mode={Object.keys(selectedPerformer).length>0 ? 'UPDATE':'ADD'}
                        data={selectedPerformer}
                    />
                }
                {selectedModelType == ModeType.organizer &&
                    <AddOrganizer
                        id={eventData.id} 
                        onSubmitSuccess={() => {
                            getSingleEvent.refetch()
                            setModelVisibility(false);
                            setSelectedModelType("");
                        }}
                        data={eventData.organizers}
                    />
                }
              </div>
            </Modal>
          </div>
        )
      )}
    </div>
  );
}

type coverProp = {
  id: string;
  defaultCover:string
  onSubmitSuccess: () => void;
};

const UploadCoverView = ({ id, onSubmitSuccess,defaultCover }: coverProp) => {
  const [selectedImage, setSelectedImage] = useState<File | string>(defaultCover);
  let addCover = api.event.addCoverImage.useMutation()

  useEffect(()=>{
    if(addCover.isSuccess){
      onSubmitSuccess()
    }
  },[addCover.data])

  const handleCoverUpload = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if(typeof(selectedImage) != 'string'){
      sanityClient.assets.upload('image',selectedImage,{
        filename:`${selectedImage.name}`
      }).then(data=>{
        addCover.mutate({
          id:id,
          coverImagePath:data._id,
          coverImagePathUrl:data.url
        })
      })
    }
  };
  
  return (
    <div className="mt-5 flex  h-full w-full flex-col items-center justify-center">
      <div className="overflow-hidden rounded-xl">
          <img
            src={typeof(selectedImage) == 'string' ? selectedImage:URL.createObjectURL(selectedImage)}
            alt=""
            className="h-[150px] w-[150px] md:h-[25vw] md:w-[50vw]"
          />
        
      </div>
      <form
        className="mt-4 grid grid-rows-2 gap-4"
        onSubmit={handleCoverUpload}
      >
        <input
          className=""
          type="file"
          name=""
          placeholder="Select Cover Image"
          onChange={(e) => {
            if (e.target.files != null) {
              if (e.target.files[0] != undefined) {
                setSelectedImage(e.target.files[0]);
              }
            }
          }}
          accept="image/*"
        />
        {typeof(selectedImage) == 'object' && <button
          className=" rounded-lg bg-green-500 px-3 py-1 text-white"
          type="submit"
        >
          Upload
        </button>}
      </form>
    </div>
  );
};

type additionImage = Pick<coverProp, 'id' | 'onSubmitSuccess'>

const UploadAdditionalImage = ({id,onSubmitSuccess}:additionImage)=>{
    const [selectedImage, setSelectedImage] = useState<File>({} as File);
    let addImages = api.event.addEventImage.useMutation()

    useEffect(()=>{
      if(addImages.isSuccess){
        onSubmitSuccess()
      }
    },[addImages.data])


    const handleCoverUpload = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      sanityClient.assets.upload('image',selectedImage,{
        filename:selectedImage.name
      }).then(data=>{
        addImages.mutate({
          eventId:id,
          imagePath:data._id,
          imagePathUri:data.url
        })
      })
    };
    
    return (
      <div className="mt-5 flex  h-full w-full flex-col items-center justify-center">
        <form
          className="mt-4 grid grid-rows-2 gap-4"
          onSubmit={handleCoverUpload}
        >
          <input
            className=""
            type="file"
            name=""
            placeholder="Select Cover Image"
            onChange={(e) => {
              if (e.target.files != null) {
                if (e.target.files[0] != undefined) {
                  setSelectedImage(e.target.files[0]);
                }
              }
            }}
            accept="image/*"
          />
          {typeof(selectedImage) == 'object' && <button
            className=" rounded-lg bg-green-500 px-3 py-1 text-white"
            type="submit"
          >
            Upload
          </button>}
        </form>
      </div>
    );
}

type additionVideo = Pick<coverProp, 'id' | 'onSubmitSuccess'>

const UploadAdditionalVideo = ({id,onSubmitSuccess}:additionVideo)=>{
    const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const handleCoverUpload = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    let body = new FormData();
    body.append("id", id);
    selectedImage.forEach((item)=>{
        body.append("additionalVideo", item);
    })

    fetch("/api/admin/events/addAdditionalVideo", {
      method: "POST",
      headers: { "Access-Control-Allow-Headers": "*" },
      body: body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          onSubmitSuccess();
        }
      });
  };
  
  return (
    <div className="mt-5 flex  h-full w-full flex-col items-center justify-center">
      <form
        className="mt-4 grid grid-rows-2 gap-4"
        onSubmit={handleCoverUpload}
      >
        <input
          className=""
          type="file"
          name=""
          multiple
          placeholder="Select Cover Video"
          onChange={(e) => {
            if (e.target.files != null) {
              if (e.target.files[0] != undefined) {
                let files = Array.from(e.target.files)
                setSelectedImage(files);
              }
            }
          }}
          accept="video/*"
        />
        {typeof(selectedImage) == 'object' && <button
          className=" rounded-lg bg-green-500 px-3 py-1 text-white"
          type="submit"
        >
          Upload
        </button>}
      </form>
    </div>
  );
}

type specialGuestType =  {
    mode:string,
    data:SpecialGuest
} & additionVideo

const AddSpecialGuest = ({id,onSubmitSuccess,mode ,data}:specialGuestType)=>{
    const [name, setName] = useState<string>('')
    const [bio,setBio] = useState<string>('')
    const addGuest = api.event.addSpecialGuest.useMutation()
    const updateGuest = api.event.updateSpecialGuest.useMutation()

    useEffect(()=>{
        if(mode == 'UPDATE'){
            setName(data.name)
            setBio(typeof(data.bio) == 'string' ? data.bio:'')
        }
    },[data])

    const handleCoverUpload = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(mode == 'UPDATE'){
            updateGuest.mutate({
                guestId:data.id,
                guestName:name,
                guestBio:bio
            })
        }
        else{
            addGuest.mutate({
                eventId:id,
                guestName:name,
                guestBio:bio
            })
        }
    };

    useEffect(()=>{
        if(addGuest.isSuccess){
            onSubmitSuccess()
        }
    },[addGuest.data])

    useEffect(()=>{
        if(updateGuest.isSuccess){
            onSubmitSuccess()
        }
    },[updateGuest.data])
  
  return (
    <div className="mt-5 flex  h-full w-full flex-col items-center justify-center">
      <form
        className="mt-4 flex flex-col items-center w-full px-5 space-y-4"
        onSubmit={handleCoverUpload}
      >
        <div className="space-y-2 w-[300px]">
            <p>Enter Guest Name</p>
            <input 
                type="text" 
                defaultValue={name}
                onChange={(e)=> setName(e.target.value)}
                placeholder="enter name"    
                className="border-1 border-amber-500 rounded-lg px-2 py-1 w-full h-[40px]"
            />

        </div>
        <div className="space-y-2 w-[300px]">
            <p>Enter Guest Bio</p>
            <input 
                type="textarea" 
                defaultValue={bio}

                onChange={(e)=> setBio(e.target.value)}
                placeholder="enter bio"    
                className="border-1 border-amber-500 rounded-lg px-2 py-1 w-full h-[40px]"
            />
        </div>
        
         <button
          className=" rounded-lg bg-green-500 px-3 py-1 text-white"
          type="submit"
        >
          {mode == 'UPDATE' ? 'Update':'Add Guest'}
        </button>
      </form>
    </div>
  );
}

type PerformerType =  {
    mode:string,
    data:Performer
} & additionVideo

const AddPerformerGuest = ({id,onSubmitSuccess,data,mode}:PerformerType)=>{
    const [name, setName] = useState<string>('')
    const [bio,setBio] = useState<string>('')
    const addPerformer = api.event.addPerformer.useMutation()
    const updatePerformer = api.event.updatePerformer.useMutation()

    useEffect(()=>{
        if(mode == 'UPDATE'){
            setName(data.name)
            setBio(typeof(data.bio) == 'string' ? data.bio:'')
        }
    },[data])

    const handleCoverUpload = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(mode == 'UPDATE'){
            updatePerformer.mutate({
                performerId:data.id,
                performerName:name,
                performerBio:bio
            })
        }
        else{
            addPerformer.mutate({
                eventId:id,
                performerName:name,
                performerBio:bio
            })
        }
    };

    useEffect(()=>{
        if(addPerformer.isSuccess){
            onSubmitSuccess()
        }
    },[addPerformer.data])

    useEffect(()=>{
        if(updatePerformer.isSuccess){
            onSubmitSuccess()
        }
    },[updatePerformer.data])
  
  return (
    <div className="mt-5 flex  h-full w-full flex-col items-center justify-center">
      <form
        className="mt-4 flex flex-col items-center w-full px-5 space-y-4"
        onSubmit={handleCoverUpload}
      >
        <div className="space-y-2 w-[300px]">
            <p>Enter Performer Name</p>
            <input 
                type="text" 
                defaultValue={name}
                onChange={(e)=> setName(e.target.value)}
                placeholder="enter name"    
                className="border-1 border-amber-500 rounded-lg px-2 py-1 w-full h-[40px]"
            />

        </div>
        <div className="space-y-2 w-[300px]">
            <p>Enter Performer Bio</p>
            <input 
                type="textarea" 
                defaultValue={bio}
                onChange={(e)=> setBio(e.target.value)}
                placeholder="enter bio"    
                className="border-1 border-amber-500 rounded-lg px-2 py-1 w-full h-[40px]"
            />
        </div>
        
         <button
          className=" rounded-lg bg-green-500 px-3 py-1 text-white"
          type="submit"
        >
          {mode == 'UPDATE' ? 'Update' :'Add Performer'}
        </button>
      </form>
    </div>
  );
}

type OrganizerType =  {
    data:Organizers[]
} & additionVideo

const AddOrganizer = ({id,onSubmitSuccess,data}:OrganizerType)=>{
    type selectedOrg = Pick<Organizers, 'memberId'| 'role' | 'name'>

    let getAllMember = api.member.getAll.useQuery()
    const [members,setMembers] = useState<Member[]>([])
    const [selectedMembers,setSelectedMembers] = useState<selectedOrg[]>([])

    let addOrganizers = api.event.addOrganizer.useMutation()

    useEffect(()=>{
        if(getAllMember.isSuccess){
          
            const filtered = getAllMember.data.filter(element => {
                return !data.some(item => item.memberId === element.id)
              })
            setMembers(filtered)
        }
    },[getAllMember.data])

    const handleUpdate = ()=>{
        addOrganizers.mutate({
            eventId:id,
            organizers:selectedMembers
        })
    }

    useEffect(()=>{
        if(addOrganizers.isSuccess){
            onSubmitSuccess()
        }
    },[addOrganizers.data])

    return(
        <div className="mt-5 flex  h-full w-full flex-col items-center ">
            <div className="">
                {members.length > 0 ? (
                    <div className="w-[70vw]">
                        <div className="my-5 w-full flex justify-between items-center">
                            <p className="text-lg">Select Members</p>
                            {selectedMembers.length>0 &&<button
                                className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                                onClick={() => {
                                    handleUpdate()
                                }}
                                >
                                Update
                                </button>}
                        </div>
                        <div>
                            <ul className=" w-full grid  grid-cols-2 gap-x-2 gap-y-3">
                            {members.map(member => (
                                <li key={member.id}>
                                <label>
                                    <input type="checkbox" 
                                    value={member.id} 
                                    checked={selectedMembers.some(selectedMember => selectedMember.memberId === member.id)}
                                    onChange={e => {
                                        if (e.target.checked) {
                                          setSelectedMembers([...selectedMembers, 
                                            {memberId: member.id,role:member.role,name:member.name}]);
                                        } else {
                                          setSelectedMembers(selectedMembers.filter(selectedMember => selectedMember.memberId !== member.id));
                                        }
                                      }}
                                    />
                                     {"  "}{member.name} {` (${member.role})`}
                                </label>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                ):
                <div className="h-[400px] flex flex-col justify-center">
                    <p>No Organizer found</p>
                </div> 

                }
            </div>

        </div>
    )
}


export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (!user?.isLoggedIn) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
},
sessionOptions);