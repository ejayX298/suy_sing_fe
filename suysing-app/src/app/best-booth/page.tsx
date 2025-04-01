"use client";

import React, { useState, useEffect } from "react";
// import { blueBooths, orangeBooths, redBooths } from "@/data/colorBooths";
import { BestBoothProvider, useBestBooth } from "@/context/BestBoothContext";
import BoothGrid from "@/components/best-booth/BoothGrid";
import VoteSummary from "@/components/best-booth/VoteSummary";
import ThankYouScreen from "@/components/best-booth/ThankYouScreen";
import IntroScreen from "@/components/best-booth/IntroScreen";
import BoothsProgress from "@/components/BoothsProgress";
import { bestBooth } from '@/services/api';
import Swal from 'sweetalert2'

function BestBoothContent() {
  const [step, setStep] = useState<
    "intro" | "blue" | "orange" | "red" | "summary" | "thankyou"
  >("intro");
  const { blueBoothVote, orangeBoothVote, redBoothVote, resetVotes } =
    useBestBooth();

  const [blueBooths, setBlueBooths] = useState([]);
  const [orangeBooths, setOrangeBooths] = useState([]);
  const [redBooths, setRedBooths] = useState([]);


  const fetchData = async () => {
    try {
      const getBooth = await bestBooth.getBoothList();
      
      if(getBooth.success){
        setBlueBooths(getBooth.results.blue_booths)
        setOrangeBooths(getBooth.results.orange_booths)
        setRedBooths(getBooth.results.red_booths)
      }
    
    
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  };



  const handleSubmitBoothVoting = async () => {
    const blue_booth_id = blueBoothVote?.id || ''
    const orange_booth_id = orangeBoothVote?.id || ''
    const red_booth_id = redBoothVote?.id || ''
    console.log(blue_booth_id + ' ' + orange_booth_id + ' ' + red_booth_id) 

    const post_data = [blue_booth_id, orange_booth_id, red_booth_id];
    
    try {
      const submitVote = await bestBooth.submitBoothVoting(post_data);
      
      if(submitVote.success){
        return true;
      }else{
        showMessage("0" , submitVote.message)  
        return false;
      }
    
    } catch (error) {
      showMessage("0" , "Unable to process your request. Please try again later.")   
      return false;
    } finally {
      // setIsLoading(false);
    }
  };


  const showMessage = (status: string, message : string)  => {
    
    let iconType: "success" | "error";
    let titleType: "Success" | "Error";

    if(status == "1"){
      iconType = "success";
      titleType = "Success";
    }else{
      iconType = "error";
      titleType = "Error";
    }

    Swal.fire({
      title: titleType,
      text: message,
      icon: iconType,
      confirmButtonColor: "#F78B1E"
    })
}


  useEffect(() => {
    fetchData();
  }, []);
  
  
  const handleContinue = async () => {
    if (step === "intro") {
      setStep("blue");
    } else if (step === "blue") {
      setStep("orange");
    } else if (step === "orange") {
      setStep("red");
    } else if (step === "red") {
      setStep("summary");
    } else if (step === "summary") {

      const submitVoteResult = await handleSubmitBoothVoting()
      if(submitVoteResult){
        setStep("thankyou");
      }
      
    } else {
      // Reset and go back to intro
      resetVotes();
      setStep("intro");
    }
  };

  const getStepHeader = () => {
    if (step === "summary" || step === "thankyou") {
      return null;
    }

    const colorText =
      step === "intro" || step === "blue"
        ? "Blue Booth"
        : step === "orange"
        ? "Orange Booth"
        : "Red Booth";

    return (
      <div className="px-4 py-3 text-white">
        <BoothsProgress
          visited={10}
          total={80}
          viewList="Tap to view the list of visited and unvisited booths."
        />

        <h1 className="text-[34px] font-bold text-center mt-4 mb-6 leading-10">
          Vote for your best
          <br />
          {colorText}
        </h1>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case "intro":
        return (
          <>
            {getStepHeader()}
            <div className="relative">
              <BoothGrid booths={blueBooths} color="blue" />
              <IntroScreen onContinue={handleContinue} />
            </div>
          </>
        );
      case "blue":
        return (
          <>
            {getStepHeader()}
            <BoothGrid booths={blueBooths} color="blue" />
            <div className="px-4 pb-4">
              <button
                onClick={handleContinue}
                disabled={!blueBoothVote}
                className={`w-full py-3 rounded-lg text-lg font-medium ${
                  blueBoothVote
                    ? "bg-[#F78B1E] text-[#252740]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </>
        );
      case "orange":
        return (
          <>
            {getStepHeader()}
            <BoothGrid booths={orangeBooths} color="orange" />
            <div className="px-4 pb-4">
              <button
                onClick={handleContinue}
                disabled={!orangeBoothVote}
                className={`w-full py-3 rounded-lg text-lg font-medium ${
                  orangeBoothVote
                    ? "bg-[#F78B1E] text-[#252740]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </>
        );
      case "red":
        return (
          <>
            {getStepHeader()}
            <BoothGrid booths={redBooths} color="red" />
            <div className="px-4 pb-4">
              <button
                onClick={handleContinue}
                disabled={!redBoothVote}
                className={`w-full py-3 rounded-lg text-lg font-medium ${
                  redBoothVote
                    ? "bg-[#F78B1E] text-[#252740]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Submit
              </button>
            </div>
          </>
        );
      case "summary":
        return <VoteSummary onSubmit={handleContinue} onCancel={() => setStep("intro")} />;
      case "thankyou":
        return <ThankYouScreen onContinue={handleContinue} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex-1 pb-16">{renderStepContent()}</div>
    </div>
  );
}

export default function BestBoothPage() {
  return (
    <BestBoothProvider>
      <BestBoothContent />
    </BestBoothProvider>
  );
}
