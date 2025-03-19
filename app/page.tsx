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
import { useRef, useState } from "react";

// chat can we get a pog chat?
type ChatHistory = {
  sender: "assistant" | "user",
  message: string
}[]

export default function Home() {

  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [history, setHistory] = useState<ChatHistory>([]);

  return <>
    <div className="h-screen w-screen flex">
      <aside className={cn(styles.history, "h-full bg-secondary-light dark:bg-secondary-dark", showHistory ? "w-[400px]" : "hidden")}>
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
        <header className="px-5 h-14 w-full flex items-center gap-5 justify-between bg-secondary-light dark:bg-secondary-dark ">
          <div className="flex gap-5 items-center">
            <History className="cursor-pointer" onClick={() => setShowHistory(!showHistory)}/>
            <Image src={logo} alt="sixlogo" width={100} />
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex flex-col h-full w-full justify-end">
          <div className="grid gap-5 grid-cols-3 w-full h-full p-5">
            {/* Grid stuff here pls. */}

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
            <Button color="primary" type="submit" className="h-full">
              Submit
            </Button>
          </form>
        </main> 
      </div>
    </div>
  </>
}

