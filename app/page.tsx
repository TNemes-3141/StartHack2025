'use client'

import { cn, generatePDF } from "@/lib/utils";

import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { Input } from "@heroui/input";
import styles from "./page.module.css"
import logo from "@/public/Sixth_Sense_Logo.svg"
import Image from "next/image";
import { Button } from "@heroui/button";
import { Badge, Card, CardBody, CardHeader, Code, Spinner } from "@heroui/react";
import { BotMessageSquare, History, SquareMousePointer, X } from "lucide-react"
import CardContainer from "./components/CardContainer";
import { useEffect, useState } from "react";
import AudioRecorder from "./components/audio_recorder/audio_recorder";
import { ScrollShadow } from "@heroui/react";
import CandleChart from "./components/charts/CandleChart";
import LineChart from "./components/charts/LineChart";
import PieChart from "./components/charts/PieChart"
import { usePortfolioDataContext } from '@/context/portfolioData';
import UserSelector from "./components/user_selector/user_selector";
import TableChart from "./components/charts/TableCard";
import TableCard from "./components/charts/TableCard";
import NewsCard from "./components/charts/NewsCard";
import { code_font } from "@/lib/fonts"; // Adjust the import path

import { textToSpeech } from "./api/generate/actions";
import { candle_data_list, line_data_list, pie_data_list } from "./components/charts/PlaceholderData";
import { AxisChartDataList } from "./components/charts/ApexSeriesConverter";
import { OrchestratorData } from "./components/charts/OrchestratorInterface";
import KpiCard from "./components/KpiCard";
import { extractFinalJsonAndMessage } from "./components/json_decoder";
import { json } from "stream/consumers";


// chat can we get a pog chat?
export type ChatHistory = {
  sender: "assistant" | "user",
  message: string
}[]

type ChartData = {
  x: Date,
  y: number | [number, number, number, number]
}

export default function Home() {
  const defaultMessage = "Hi! I'm the AMA with your personal finances. What are you looking for today?"

  const [selectedCards, setSelectedCards] = useState<string[]>([]) // id's of the selected cards
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [history, setHistory] = useState<ChatHistory>([]); // {sender: 'assistant', message: "blabl"}
  const [dataList, setDataList] = useState<({ id: string, data: AxisChartDataList | string })[]>([])
  const [selectedTableCells, setSelectedTableCells] = useState<{ id: string, x: number, y: number, data: string }[]>([])
  const [sixMsg, setSixMsg] = useState(defaultMessage);



  const addCard = (cardId: string) => {
    if (!selectedCards.includes(cardId)) {
      setSelectedCards([...selectedCards, cardId])
      // console.log("added " + cardId)
    }
  }


  const removeCard = (cardId: string) => {
    setSelectedCards(selectedCards.filter(ele => ele !== cardId))
    // console.log("removed " + cardId)
  }

  // todo: add functionality to add selected cards and so on.
  const sendPrompt = (promptMessage: string) => {

    console.log(promptMessage);

    if (selectedTableCells.length > 0) {
      const selectedTableCell = selectedTableCells[0];
      const selectedTableCellId = parseInt(selectedTableCell.id.slice(6), 10);

      callFocus(promptMessage, selectedTableCell.data, jsonData[selectedTableCellId]);
    } else {
      if (selectedCards.length > 0) {
        let filtered_list: any[] = [];
        selectedCards.forEach((sc, i) => {
          const sc_id = parseInt(sc.slice(6), 10);
          filtered_list.push(jsonData[sc_id]);
        });
        callOrchestrator(promptMessage, filtered_list);
      } else {
        callOrchestrator(promptMessage, undefined);
      }
    }

    const currentHistory = history;
    currentHistory.push({
      message: promptMessage,
      sender: "user"
    });
    setInputValue("");
    setHistory([...currentHistory]);

  }

  const userContext = usePortfolioDataContext();
  if (!userContext) {
    return null;
  }
  const { portfolioData, setPortfolioData } = userContext;

  const [messages, setMessages] = useState<string[]>([]);
  const [jsonData, setJsonData] = useState<OrchestratorData>([])
  const [loading, setLoading] = useState(false);

  const callOrchestrator = async (promptMessage: string, insightData: any[] | undefined) => {
    setMessages([]);
    setLoading(true);

    const query = promptMessage;
    const portfolio = portfolioData;
    const conversationHistory = history.length > 0 ? history : null;

    try {
      const res = await fetch("/api/orchestrator/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, portfolio, conversationHistory, insightData }),
      });

      // Read the response as a stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Failed to read response stream");

      const decoder = new TextDecoder();
      let newMessages: string[] = [];
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the streamed text
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk; // Append to full response

        console.log(chunk);

        // Update UI with new message (excluding the final JSON)
        if (!chunk.startsWith("FINAL_JSON:")) {
          newMessages = [...newMessages, chunk.trim()];
          setMessages([...newMessages]);
        } else {
          // Extract JSON data from the final chunk
          try {
            const data = extractFinalJsonAndMessage(chunk);
            console.log(data.jsonData);

            setJsonData([jsonData, ...data.jsonData]);
            setSixMsg(data.message);

            const currentHistory = history;
            currentHistory.push({
              message: data.message,
              sender: "assistant"
            });
            setHistory([...currentHistory]);
          } catch (error) {
          }
        }
      }
    } catch (error) {
      console.error("Error calling orchestrator:", error);
      setMessages(["Error communicating with the server."]);
    } finally {
      setLoading(false);
    }
  }

  const callFocus = async (promptMessage: string, focusPoint: string, parentChart: any) => {
    setMessages([]);
    setLoading(true);
    const query = promptMessage;
    const portfolio = portfolioData;
    const conversationHistory = history.length > 0 ? history : null;

    try {
      const res = await fetch("/api/orchestrator/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, portfolio, conversationHistory, focusPoint, parentChart }),
      });

      // Read the response as a stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Failed to read response stream");

      const decoder = new TextDecoder();
      let newMessages: string[] = [];
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the streamed text
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk; // Append to full response

        // Update UI with new message (excluding the final JSON)
        if (!chunk.startsWith("FINAL_RESPONSE:")) {
          newMessages = [...newMessages, chunk.trim()];
          setMessages([...newMessages]);
        } else {
          // Extract JSON data from the final chunk
          const response = chunk.replace("FINAL_RESPONSE:", "");
          // speakResponse(response);
          setSixMsg(response);
          const currentHistory = history;
          currentHistory.push({
            message: response,
            sender: "assistant"
          });
          setHistory([...currentHistory]);
        }
      }
    } catch (error) {
      console.error("Error calling orchestrator:", error);
      setMessages(["Error communicating with the server."]);
    } finally {
      setLoading(false);
    }
  }

  async function speakResponse(text: string) {
    const blob: Blob = await textToSpeech(text);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  }

  const updateDataList = (id: string, data: AxisChartDataList | string) => {
    setDataList([...dataList.filter(ele => ele.id != id), { id, data }])
  }


  const updateSelectedTableCells = (type: "select" | "deselect", id: string, x: number, y: number, data: string) => {
    if (type === "select") {
      setSelectedTableCells([...selectedTableCells.filter(ele => ele.id !== id), { id: id, x: x, y: y, data: data }])
      console.log(selectedTableCells)
    } else if (type === "deselect") {
      setSelectedTableCells([...selectedTableCells.filter(ele => ele.id !== id)])
      console.log(selectedTableCells)
    }
  }


  return <>
    <div className="h-screen w-screen flex">
      <aside className={
        cn(styles.history, "h-full flex flex-col justify-stretch bg-secondary-light dark:bg-secondary-dark",
          "duration-500 ease-in-out transition-[transform,width]",
          "z-[999] absolute top-0 left-0 shadow-2xl lg:static",
          code_font.className,
          showHistory ? "w-[80%] lg:w-[30%] translate-x-0" : "w-[0] translate-x-[-400px]")
      }>
        <div className="flex p-5 justify-between items-center">
          <h2>Interaction Log</h2>
          <Button isIconOnly onPress={() => setShowHistory(!showHistory)}>
            <X />
          </Button>
        </div>
        <ScrollShadow hideScrollBar>
          <main className="w-full overflow-y-auto no-scrollbar">
            <div className="w-full flex flex-col p-5 justify-self-end">
              {
                history.length != 0 ? history.map((message, idx) => {
                  return <div className={cn("p-1 w-fit w-max-[200px]")} key={idx}>
                    <span className="font-bold">{message.sender} wrote: </span><span>{message.message}</span>
                  </div>
                }) : <p className="opacity-50">Begin your journey by interacting with the dashboard right.</p>
              }
            </div>
          </main>
        </ScrollShadow>
        <Button className="m-5" onPress={() => generatePDF(history)}>
          Export Interaction Log
        </Button>
      </aside>
      <div className="h-screen w-full flex flex-col">
        <header className="px-5 h-14 w-full flex items-center gap-5 justify-between">
          <div className="flex gap-5 items-center">
            <Image src={logo} alt="sixlogo" width={180} />
            <UserSelector className="w-64 h-10 min-h-10"></UserSelector>
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex flex-col h-full w-full justify-end">
          <div className={cn("relative grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-full p-5 overflow-hidden", (history.length < 1) && "hidden h-0")}>
            <div className={cn("w-full h-full absolute inset-0")}>
              <ScrollShadow className="w-full h-full grid grid-flow-dense p-5 pb-[170px] gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" hideScrollBar size={20}>
                {jsonData && jsonData.map((chart: any, index) => {
                  if (index == 0) {
                    return null;
                  }

                  // const animationnames = ['animate-fade-in-scale-0s', 'animate-fade-in-scale-1s', 'animate-fade-in-scale-2s', 'animate-fade-in-scale-3s', 'animate-fade-in-scale-4s', 'animate-fade-in-scale-5s']
                  // const randomNumber = Math.floor(Math.random() * 6);
                  // const randomClass = animationnames[randomNumber];

                  return chart.type === "table" ?
                    <TableCard
                      key={index}
                      id={`chart-${index}`}
                      title={chart.title}
                      tableHeader={chart.data.header}
                      tableData={chart.data.content}
                      toggleCellSelect={updateSelectedTableCells}
                      onSelect={addCard}
                      onDeselect={removeCard}
                      className={``}
                    /> :
                    chart.type === "kpi" ?
                      <KpiCard
                        className={``}
                        key={index}
                        id={`chart-${index}`}
                        title={chart.title}
                        content={chart.data.number}
                        onSelect={addCard}
                        onDeselect={removeCard}
                      // rowSpan = "1"
                      // colSpan = {chart.data.toString().length >= 6 ? "2" : "1"}
                      />
                      : chart.type === "news" ?
                        <NewsCard
                          key={index}
                          id={`chart-${index}`}
                          title={chart.title}
                          className={`chartelement`}
                          content={chart.data.content}
                          source={chart.data.source}
                          onSelect={addCard}
                          onDeselect={removeCard}
                        />
                        : <CardContainer
                          key={index}
                          id={`chart-${index}`}
                          title={chart.title}
                          className={`chartelement`}
                          pt_0={true}
                          content={
                            chart.type === "candle" ? <CandleChart dataList={chart.data} id={"" + index} onDataChange={updateDataList} /> :
                              chart.type === "line" ? <LineChart dataList={chart.data} id={"" + index} onDataChange={updateDataList} /> :
                                chart.type === "pie" ? <PieChart dataList={chart.data.data} labelList={chart.data.label} id={"" + index} /> : <div>No chart available</div>
                          }
                          onSelect={addCard}
                          onDeselect={removeCard}
                          colSpan={
                            (chart.type === "candle" || chart.type === "line") ? "2" : undefined
                          }
                        />
                })}
                {/*
                <CardContainer id="1" title="card 1" content={<CandleChart dataList={candle_data_list} id="1" onDataChange={updateDataList}/>} onSelect={addCard} onDeselect={removeCard} colSpan="2"/>
                <CardContainer id="4" title="card 4" content={<LineChart dataList={line_data_list} id="4" onDataChange={updateDataList}/>} onSelect={addCard} onDeselect={removeCard} colSpan="2"/>

                <TableCard id="5" title="Banco Santander Rg" tableHeader={header} tableData={data} onSelect={addCard} onDeselect={removeCard} colSpan="2" rowSpan="1" toggleCellSelect={()=>{console.log("selected")}}></TableCard>
                <CardContainer id="6" title="The Pie is a lie" content={<PieChart dataList={pie_data_list} id="6"/>} onSelect={addCard} onDeselect={removeCard}/> */}
              </ScrollShadow>
            </div>

            {(history.length > 0) &&
              <div className="absolute bottom-0 right-0 w-full px-5 z-[1]">
                <Card className="w-full h-fit max-h-[150px] self-center bg-secondary-light dark:bg-secondary-dark p-3 flex gap-2 flex-row items-start">
                  <div onClick={() => { setSixMsg("") }} className="flex w-fit h-fit"><BotMessageSquare />:</div>
                  <ScrollShadow className="w-full max-h-[100px] p-0">
                    <CardBody className="w-full p-0">
                      {sixMsg}
                    </CardBody>
                  </ScrollShadow>
                </Card>
              </div>
            }


          </div>
          <div className={cn("w-full self-center p-5 flex gap-3", (history.length < 1) && "h-full")}>
            <form className={cn("w-full self-center p-5 flex gap-3 h-fit justify-center", (history.length < 1 && "flex-col items-center"))} onSubmit={(e) => {

              e.preventDefault();

              if (!inputValue) return;
              sendPrompt(inputValue);

              setSelectedCards([]);
              // document.querySelectorAll(".cardContainer").forEach((element) => {
              //   element.animate(
              //     [
              //       { opacity: 1, transform: "scale(1)" },  // Start: fully visible, normal size
              //       { opacity: 0, transform: "scale(0.95)" } // End: faded out, smaller
              //     ],
              //     {
              //       duration: 500, // Animation duration in milliseconds
              //       easing: "ease-in-out", // Smooth easing
              //       fill: "forwards" // Keeps the final state (faded out & small)
              //     }
              //   );
              // })


            }}>
              {(history.length < 1) &&
                <div className="w-fit max-w-[500px] px-5 z-[1] flex flex-col items-center gap-5 mb-12">
                  <div className="flex w-fit h-fit text-9xl"><BotMessageSquare size={128} /></div>
                  <Card className="w-full h-fit max-h-[150px] self-center bg-secondary-light dark:bg-secondary-dark p-3 flex gap-2 flex-row items-start">
                    {
                      sixMsg != defaultMessage ? <Button isIconOnly onPress={() => {
                        setSixMsg("");
                      }}><X />
                      </Button> : ""
                    }

                    <CardBody className="w-fit p-0 text-center">
                      {sixMsg}
                    </CardBody>
                  </Card>
                </div>
              }

              <div className={cn("flex justify-center gap-3 w-full max-w-[90%] md:max-w-full", (history.length < 1) && "w-fit")}>



                <Button isIconOnly className={cn("h-14 w-14 z-[1000]", (history.length < 1) && "hidden")} onPress={() => {
                  console.log("toggling history: ");
                  console.log(showHistory);
                  setShowHistory(!showHistory);
                }}>
                  <History className="cursor-pointer" />
                </Button>
                <div className="flex bg-default-100 items-center rounded-medium w-full max-w-[90%]">
                  <Input label="Ask your AI portfolio manager" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className={cn("w-full max-w-full bg-transparent", (history.length < 1) && "w-[450px] max-w-screen")} />
                  {(selectedCards.length > 0 || selectedTableCells.length > 0) &&
                    <div className="h-[80%] flex justify-center items-center text-default-500 font-semibold mr-4 border-solid border-1 border-red-600 rounded-full px-6">
                      <Badge className="absolute top-[-4px] right-[-8px] p-3" content={selectedCards.length + selectedTableCells.length} shape="circle">
                        Items selected <SquareMousePointer className="ml-2" color="red" />
                      </Badge>
                    </div>}
                </div>

                {
                  loading ?
                    <div className="flex gap-5">
                      <Spinner />
                      {messages.length > 0 ? <p className="h-full flex items-center">{messages[messages.length - 1]}</p> : <></>}
                    </div>
                    :
                    <Button color="primary" type="submit" className="h-14 z-[1000]">
                      Submit
                    </Button>
                }
              </div>

              <AudioRecorder onWhisperResponse={(res) => sendPrompt(res)} className={cn((history.length < 1) && "h-20 w-20 rounded-full overflow-hidden mt-12")} />
            </form>
          </div>
        </main>
      </div>
    </div>
  </>
}

