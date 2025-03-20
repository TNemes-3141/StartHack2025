'use client'

import { cn } from "@/lib/utils";

import { ThemeSwitcher } from "./components/ThemeSwitcher";
import {Input} from "@heroui/input";
import { secondary_font } from "@/lib/fonts";
import styles from "./page.module.css"
import logo from "@/public/SIX_Group_logo.svg"
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { History } from "lucide-react"
import CardContainer from "./components/CardContainer";
import { useRef, useState } from "react";
import AudioRecorder from "./components/audio_recorder/audio_recorder";

// chat can we get a pog chat?
type ChatHistory = {
  sender: "assistant" | "user",
  message: string
}[]

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]) // id's of the selected cards
  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [history, setHistory] = useState<ChatHistory>([]);

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

  return <>
    <div className="h-screen w-screen flex">
      <aside className={cn(styles.history, "h-full bg-secondary-light dark:bg-secondary-dark transition-[width] duration-500 ease-in-out transition-[transform,width]", showHistory ? "w-[400px] translate-x-0" : "w-[0] translate-x-[-400px]")}>
        <h2 className="p-5">Interaction Chat</h2>
        <main className="w-full flex flex-col p-5 justify-self-end">
          {
            history.map((message, idx) => {
              return <Card className={cn("my-2 p-2 w-fit w-max-[200px] bg-main-light dark:bg-main-dark", message.sender == "user" ? "self-end" : "self-start")} key={idx}>
                {message.message}
              </Card>
            })
          }
        </main>
      </aside>
      <div className="h-screen w-full flex flex-col">
        <header className="px-5 h-14 w-full flex items-center gap-5 justify-between">
          <div className="flex gap-5 items-center">
            <History className="cursor-pointer" onClick={() => setShowHistory(!showHistory)}/>
            <Image src={logo} alt="sixlogo" width={100} />
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex flex-col h-full w-full justify-end">
          <div className="grid gap-5 grid-cols-3 w-full h-full p-5">
            <CardContainer id="1" title="card 1" content="This is card 1" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="2" title="card 2" content="This is card 2" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="3" title="card 3" content="This is card 3" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="4" title="card 4" content="This is card 4" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="5" title="card 5" content="This is card 5" onSelect={addCard} onDeselect={removeCard}/>
            <CardContainer id="6" title="card 6" content="This is card 6" onSelect={addCard} onDeselect={removeCard}/>

          </div>
          <Card className="w-[95%] h-[150px] self-center bg-secondary-light dark:bg-secondary-dark">
            <CardBody>
              <h2>AI Assistant: </h2>
            </CardBody>
          </Card>
          <form className="w-[95%] self-center my-5 flex gap-5" onSubmit={(e) => {

            e.preventDefault();
            if (!inputValue) return;

            const currentHistory = history;
            currentHistory.push({
              message: inputValue,
              sender: "user"
            });
            setInputValue("");
            setHistory([...currentHistory]);
          }}>
            <Input label="Prompt Your Assistant" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <AudioRecorder/>
            <Button color="primary" type="submit" className="h-full">
              Submit
            </Button>

          </form>
        </main> 
      </div>
    </div>
  </>
}

