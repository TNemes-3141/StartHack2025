'use client'

import { cn } from "@/lib/utils";

import { ThemeSwitcher } from "./components/ThemeSwitcher";
import {Input} from "@heroui/input";
import styles from "./page.module.css"
import logo from "@/public/SIX_Group_logo.svg"
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { History, X } from "lucide-react"
import CardContainer from "./components/CardContainer";
import { useEffect, useState } from "react";
import AudioRecorder from "./components/audio_recorder/audio_recorder";
import {ScrollShadow} from "@heroui/react";
import CandleChart from "./components/charts/CandleChart";
import LineChart from "./components/charts/LineChart";
import PieChart from "./components/charts/PieChart"
import { candle_data_list, line_data_list } from "./components/charts/PlaceholderData";
import { AxisChartDataList } from "./components/charts/ApexSeriesConverter";





// chat can we get a pog chat?
type ChatHistory = {
  sender: "assistant" | "user",
  message: string
}[]

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]) // id's of the selected cards
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [history, setHistory] = useState<ChatHistory>([]);
  const [dataList, setDataList] = useState<({id: string, data: AxisChartDataList | string})[]>([])

  const addCard = (cardId: string) => {
    if (!selectedCards.includes(cardId)) {
      setSelectedCards([... selectedCards, cardId])
      // console.log("added " + cardId)
    }
  }


  const removeCard = (cardId: string) => {
    setSelectedCards(selectedCards.filter(ele => ele !== cardId))
    // console.log("removed " + cardId)
  }

  // todo: add functionality to add selected cards and so on.
  const sendPrompt = (promptMessage: string) => {

    const currentHistory = history;
    currentHistory.push({
      message: promptMessage,
      sender: "user"
    });
    setInputValue("");
    setHistory([...currentHistory]);

  }


  const updateDataList = (id: string, data: AxisChartDataList | string ) => {
    setDataList([...dataList.filter(ele => ele.id != id), {id, data}])
  }


  useEffect(() => {
    console.log(dataList)
  }, [dataList])


  return <>
    <div className="h-screen w-screen flex">
      <aside className={
        cn(styles.history, "h-full flex flex-col bg-secondary-light dark:bg-secondary-dark", 
          "duration-500 ease-in-out transition-[transform,width]",
          "z-[999] absolute top-0 left-0 shadow-2xl lg:static",
          showHistory ? "w-[80%] lg:w-[30%] translate-x-0" : "w-[0] translate-x-[-400px]")
      }>
        <div className="flex p-5 justify-between items-center">
          <h2>Interaction Chat</h2>
          <Button isIconOnly onPress={() => setShowHistory(!showHistory)}>
            <X />
          </Button>
        </div>
        <ScrollShadow hideScrollBar>
          <main className="w-full overflow-y-auto no-scrollbar">
            <div className="w-full flex flex-col p-5 justify-self-end">
              {
                history.map((message, idx) => {
                  return <Card className={cn("my-2 p-2 w-fit w-max-[200px] bg-main-light dark:bg-main-dark", message.sender == "user" ? "self-end" : "self-start")} key={idx}>
                    {message.message}
                  </Card>
                })
              }
            </div>
          </main>
        </ScrollShadow>
      </aside>
      <div className="h-screen w-full flex flex-col">
        <header className="px-5 h-14 w-full flex items-center gap-5 justify-between">
          <div className="flex gap-5 items-center">
            <Image src={logo} alt="sixlogo" width={100} />
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex flex-col h-full w-full justify-end">
          <div className="relative grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-full p-5 pb-[170px]">
            <CardContainer id="1" title="card 1" content={<CandleChart dataList={candle_data_list} id="1" onDataChange={updateDataList}/>} onSelect={addCard} onDeselect={removeCard} colSpan="2"/>
            <CardContainer id="2" title="card 2" content="This is card 2" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="3" title="card 3" content="This is card 3" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="4" title="card 4" content={<LineChart dataList={line_data_list} id="4" onDataChange={updateDataList}/>} onSelect={addCard} onDeselect={removeCard} colSpan="2"/>
            <div className="absolute bottom-0 left-0 w-full px-5">
              <Card className="w-full h-[150px] self-center bg-secondary-light dark:bg-secondary-dark">
                <CardBody>
                  <h2>AI Assistant: </h2>
                </CardBody>
              </Card>
            </div>
          </div>
          <form className="w-full self-center p-5 flex gap-3" onSubmit={(e) => {

            e.preventDefault();
            if (!inputValue) return;
            sendPrompt(inputValue);

          }}>
            <Button isIconOnly className="h-full" onPress={() => {
                console.log("toggling history: ");
                console.log(showHistory);
                setShowHistory(!showHistory);
              }}>
              <History className="cursor-pointer"/>
            </Button>
            <Input label="Prompt Your Assistant" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <Button color="primary" type="submit" className="h-full">
              Submit
            </Button>
            <AudioRecorder onWhisperResponse={(res) => sendPrompt(res)}/>
          </form>
        </main> 
      </div>
    </div>
  </>
}

