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
import { useState } from "react";

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]) // id's of the selected cards

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
      <aside className={cn(styles.history, "w-[400px] bg-secondary-light dark:bg-secondary-dark")}>
      </aside>
      <div className="h-screen w-full flex flex-col">
        <header className="px-5 h-14 w-full flex items-center gap-5 justify-between bg-secondary-light dark:bg-secondary-dark ">
          <div className="flex gap-5">
            <History />
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
          <form className="w-[95%] self-center my-5 flex gap-5" onSubmit={() => {

          }}>
            <Input label="prompt your assistant" type="text" />
            <Button color="primary" type="submit" className="h-full">
              Submit
            </Button>
          </form>
        </main> 
      </div>
    </div>
  </>
}

