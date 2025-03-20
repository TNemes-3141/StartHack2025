'use client'

import { cn } from "@/lib/utils";

import { ThemeSwitcher } from "./components/ThemeSwitcher";
import {Input} from "@heroui/input";
import styles from "./page.module.css"
import logo from "@/public/SIX_Group_logo.svg"
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, Code, Spinner } from "@heroui/react";
import { BotMessageSquare, History, X } from "lucide-react"
import CardContainer from "./components/CardContainer";
import { useEffect, useState } from "react";
import AudioRecorder from "./components/audio_recorder/audio_recorder";
import {ScrollShadow} from "@heroui/react";
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


// chat can we get a pog chat?
type ChatHistory = {
  sender: "assistant" | "user",
  message: string
}[]

type ChartData = {
  x: Date,
  y: number | [number, number, number, number]
}

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]) // id's of the selected cards
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [history, setHistory] = useState<ChatHistory>([]); // {sender: 'assistant', message: "blabl"}
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

    console.log(promptMessage)

    callOrchestrator(promptMessage);
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
  const {portfolioData, setPortfolioData} = userContext;

  const [messages, setMessages] = useState<string[]>([]);
  const [jsonData, setJsonData] = useState<OrchestratorData>([])
  // const [jsonData, setJsonData] = useState<OrchestratorData | null>(  [{
  //   "type": "line",
  //   "title": "Apple Historical Performance",
  //   "data": [
  //     {"x": "2025-02-05T00:00:00.000", "y": 213.53},
  //     {"x": "2025-02-06T00:00:00.000", "y": 233.22},
  //     {"x": "2025-02-07T00:00:00.000", "y": 227.63},
  //     {"x": "2025-02-10T00:00:00.000", "y": 227.65},
  //     {"x": "2025-02-11T00:00:00.000", "y": 232.62},
  //     {"x": "2025-02-12T00:00:00.000", "y": 236.87},
  //     {"x": "2025-02-13T00:00:00.000", "y": 241.53},
  //     {"x": "2025-02-14T00:00:00.000", "y": 244.6},
  //     {"x": "2025-02-18T00:00:00.000", "y": 244.47},
  //     {"x": "2025-02-19T00:00:00.000", "y": 244.87},
  //     {"x": "2025-02-20T00:00:00.000", "y": 245.83},
  //     {"x": "2025-02-21T00:00:00.000", "y": 245.55},
  //     {"x": "2025-02-24T00:00:00.000", "y": 247.1},
  //     {"x": "2025-02-25T00:00:00.000", "y": 247.04},
  //     {"x": "2025-02-26T00:00:00.000", "y": 240.36},
  //     {"x": "2025-02-27T00:00:00.000", "y": 237.3},
  //     {"x": "2025-02-28T00:00:00.000", "y": 241.84},
  //     {"x": "2025-03-03T00:00:00.000", "y": 238.03},
  //     {"x": "2025-03-04T00:00:00.000", "y": 235.93},
  //     {"x": "2025-03-05T00:00:00.000", "y": 235.74},
  //     {"x": "2025-03-06T00:00:00.000", "y": 235.33},
  //     {"x": "2025-03-07T00:00:00.000", "y": 239.07},
  //     {"x": "2025-03-10T00:00:00.000", "y": 227.48},
  //     {"x": "2025-03-11T00:00:00.000", "y": 220.84},
  //     {"x": "2025-03-12T00:00:00.000", "y": 216.98},
  //     {"x": "2025-03-13T00:00:00.000", "y": 209.68},
  //     {"x": "2025-03-14T00:00:00.000", "y": 213.49},
  //     {"x": "2025-03-17T00:00:00.000", "y": 214},
  //     {"x": "2025-03-18T00:00:00.000", "y": 212.69},
  //     {"x": "2025-03-19T00:00:00.000", "y": 215.24}
  //   ]
  //   },
  //   {
  //       "type": "pie",
  //       "title": "Portfolio Asset Distribution",
  //       "data": [60, 40]
  //   },
  //   {
  //       "type": "news",
  //       "title": "Investment Insights on Apple",
  //       "data": {
  //           "content": "Why Intel Stock Is Sinking Today",
  //           "source": "https://www.fool.com/investing/2025/03/19/why-intel-stock-is-sinking-today/"
  //       }
  //   },
  //   {
  //       "type": "kpi",
  //       "title": "Apple's Annualized Return",
  //       "data": {
  //           "number": 30.33,
  //           "footer": "Annualized return as of February 5, 2025"
  //       }
  //   },
  //   {
  //       "type": "table",
  //       "title": "Banco Santander",
  //       "data": {
  //           "header": ["", "Valor Number", "Ticker symbol", "ISIN", "Instrument type", "Outstanding Securities", "Outstanding Capital"],
  //           "content": [
  //             {
  //               "": "Banco Santander",
  //               "Valor Number": "Valor Number Data",
  //               "Ticker symbol": "Ticker Symbol Data",
  //               "ISIN": "ISINIJKFLDJFKLDA:",
  //               "Instrument type": "Instrument type",
  //               "Outstanding Securities": "OS",
  //               "Outstanding Capital": "OC",
  //             },
  //             {
  //               "": "Rui Zhang Bank",
  //               "Valor Number": "Sehr glaubwürdig",
  //               "Ticker symbol": "überhaupt kein Rugpull",
  //               "ISIN": "IAIAIAIAIAIAI",
  //               "Instrument type": "Mein Minecraft Baum ist riesig",
  //               "Outstanding Securities": "Fortnite",
  //               "Outstanding Capital": "OC",
  //             }
  //           ]
  //       }
  //   }
  //   ]);

  const [loading, setLoading] = useState(false);

  const callOrchestrator = async (promptMessage: string) => {
      setMessages([]);
      setLoading(true);

      const query = promptMessage;
      const portfolio = portfolioData;
      const conversationHistory = history.length > 0 ? history : null;
      
      console.log("History:")
      console.log(JSON.stringify({ query, portfolio, conversationHistory }))

      try {
          const res = await fetch("/api/orchestrator", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query, portfolio, conversationHistory }),
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
              if (!chunk.startsWith("FINAL_JSON:")) {
                newMessages = [...newMessages, chunk.trim()];
                setMessages([...newMessages]);
              } else {
                // Extract JSON data from the final chunk
                const newJsonData = JSON.parse(chunk.replace("FINAL_JSON:", "").trim());

                setJsonData([...jsonData, ...newJsonData]);
                console.log(newJsonData);
                // console.log("THIS IS IT:" + JSON.stringify(jsonData));
                // classify(jsonData);
              }
            }

          // Extract JSON data from the last message
          const jsonMatch = fullText.match(/FINAL_JSON:(\{.*\})/);
          if (jsonMatch) {
              const jsonData = JSON.parse(jsonMatch[1]);
              console.log(jsonData);
              setJsonData(jsonData);
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

  const updateDataList = (id: string, data: AxisChartDataList | string ) => {
    setDataList([...dataList.filter(ele => ele.id != id), {id, data}])
  }


  return <>
    <div className="h-screen w-screen flex">
      <aside className={
        cn(styles.history, "h-full flex flex-col bg-secondary-light dark:bg-secondary-dark", 
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
                    {message.sender + " wrote: " +message.message}
                  </div>
                }) : <p className="opacity-50">Begin your journey by interacting with the dashboard right.</p>
              }
            </div>
          </main>
        </ScrollShadow>
      </aside>
      <div className="h-screen w-full flex flex-col">
        <header className="px-5 h-14 w-full flex items-center gap-5 justify-between">
          <div className="flex gap-5 items-center">
            <Image src={logo} alt="sixlogo" width={100} />
            <UserSelector className="w-64 h-10 min-h-10"></UserSelector>
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex flex-col h-full w-full justify-end">
          <div className={cn("relative grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-full p-5 overflow-hidden", (history.length < 1) && "hidden h-0")}>
            <div className={cn("w-full h-full absolute inset-0")}>
              <ScrollShadow className="w-full h-full grid grid-flow-dense p-5 pb-[170px] gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" hideScrollBar size={20}>
                {jsonData && jsonData.map((chart: any, index) => (
                  chart.type === "table" ? 
                  <TableCard 
                    key={index}
                    id={`chart-${index}`}
                    title={chart.title}
                    tableHeader={chart.data.header}
                    tableData={chart.data.content}
                    toggleCellSelect={() => console.log("something")}
                    onSelect={addCard}
                    onDeselect={removeCard}
                  /> :
                  chart.type === "kpi" ? 
                  <KpiCard 
                    key={index}
                    id={`chart-${index}`}
                    title={chart.title}
                    content={chart.data.number}
                    onSelect={addCard}
                    onDeselect={removeCard}
                    // rowSpan = "1"
                    // colSpan = {chart.data.toString().length >= 6 ? "2" : "1"}
                  />
                  : <CardContainer
                    key={index}
                    id={`chart-${index}`}
                    title={chart.title}
                    className="chartelement"
                    pt_0={true}
                    content={
                      chart.type === "news" ? <><p> {chart.data.content} </p> { chart.data.source && <a href={chart.data.source}>source</a> } </> :
                      chart.type === "candle" ? <CandleChart dataList={chart.data} id={"" + index} onDataChange={updateDataList}/> :
                      chart.type === "line" ? <LineChart dataList={chart.data} id={"" + index} onDataChange={updateDataList} /> :
                      chart.type === "pie" ? <PieChart dataList={chart.data} id={"" + index}/> : <div>No chart available</div>
                    }
                    onSelect={addCard}
                    onDeselect={removeCard}
                    colSpan={
                      (chart.type === "candle" || chart.type === "line") ? "2" : undefined
                    }
                  />
                ))}
                {/*
                <CardContainer id="1" title="card 1" content={<CandleChart dataList={candle_data_list} id="1" onDataChange={updateDataList}/>} onSelect={addCard} onDeselect={removeCard} colSpan="2"/>
                <CardContainer id="4" title="card 4" content={<LineChart dataList={line_data_list} id="4" onDataChange={updateDataList}/>} onSelect={addCard} onDeselect={removeCard} colSpan="2"/>

                <TableCard id="5" title="Banco Santander Rg" tableHeader={header} tableData={data} onSelect={addCard} onDeselect={removeCard} colSpan="2" rowSpan="1" toggleCellSelect={()=>{console.log("selected")}}></TableCard>
                <CardContainer id="6" title="The Pie is a lie" content={<PieChart dataList={pie_data_list} id="6"/>} onSelect={addCard} onDeselect={removeCard}/> */}
              </ScrollShadow>
            </div>

            { (history.length > 0) &&
            <div className="absolute bottom-0 right-0 w-fit max-w-[500px] px-5 z-[1]">
              <Card className="w-full h-fit max-h-[150px] self-center bg-secondary-light dark:bg-secondary-dark p-3 flex gap-2 flex-row items-start">
                <div className="flex w-fit h-fit"><BotMessageSquare />:</div>
                <CardBody className="w-fit p-0">
                  Hi! I'm SIX. Interact with the dashboard to start.
                </CardBody>
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
              { (history.length < 1) &&
              <div className="w-fit max-w-[500px] px-5 z-[1] flex flex-col items-center gap-5 mb-12">
                <div className="flex w-fit h-fit text-9xl"><BotMessageSquare size={128}/></div>
                <Card className="w-full h-fit max-h-[150px] self-center bg-secondary-light dark:bg-secondary-dark p-3 flex gap-2 flex-row items-start">
                  
                  <CardBody className="w-fit p-0">
                    Hi! I'm SIX. Interact with the dashboard to start.
                  </CardBody>
                </Card>
              </div>
              }
              
              <div className={cn("flex gap-3 w-full", (history.length < 1) && "w-fit")}>

                

                <Button isIconOnly className={cn("h-14 w-14 z-[1000]", (history.length < 1) && "hidden")} onPress={() => {
                    console.log("toggling history: ");
                    console.log(showHistory);
                    setShowHistory(!showHistory);
                  }}>
                  <History className="cursor-pointer"/>
                </Button>
                <Input label="Prompt Your Assistant" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className={cn("w-full max-w-full", (history.length < 1) && "w-[450px] max-w-screen")}/>
                {
                  loading ? 
                  <div className="flex gap-5">
                    <Spinner/>
                    {messages.length > 0 ? <p>{messages[messages.length-1]}</p> : <></>}
                  </div>
                  :
                  <Button color="primary" type="submit" className="h-14 z-[1000]">
                    Submit
                  </Button>
                }
              </div>
              
              <AudioRecorder onWhisperResponse={(res) => sendPrompt(res)} className={cn((history.length < 1) && "h-20 w-20 rounded-full overflow-hidden mt-12")}/>
            </form>
          </div>
        </main> 
      </div>
    </div>
  </>
}

