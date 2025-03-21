"use client"

import { useState } from "react";
import NewsCard from "../components/charts/NewsCard";
import TableCard from "../components/charts/TableCard";
import CandlestickChart from "../components/charts/CandleChart";
import CardContainer from "../components/CardContainer";



const Page = ({}: {}) => {
  
    const [selectedTableCells, setSelectedTableCells] = useState<{id: string, x: number, y:number, data:string}[]>([])
    
  const updateSelectedTableCells = (type: "select" | "deselect",id: string, x: number, y: number, data: string) => {
    if (type === "select") {
      setSelectedTableCells([...selectedTableCells.filter(ele => ele.id !== id), {id: id, x: x, y: y, data: data}])
      console.log(selectedTableCells)
    } else if (type === "deselect") {
      setSelectedTableCells([...selectedTableCells.filter(ele => ele.id !== id)])
      console.log(selectedTableCells)
    }
  }
  return <div className="grid grid-cols-3 gap-5">
    <TableCard 
      key={3} 
      id={`chart-3`}
      title={"Some random title"}
      tableHeader={["header1", "header2", "header3"]}
      tableData={[{"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}, {"header1": "test1", "header2": "test2", "header3": "test3"}]}
      className="max-h-96"
      toggleCellSelect={updateSelectedTableCells}
    />
    <CardContainer id="chart-2" content={<CandlestickChart key={2} id={"chart-2"} />} colSpan="2" />
    <NewsCard id="1" title="TestPage" content="Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test" source="https://start-hack-2025-omega.vercel.app/"/>
  </div>
}


export default Page;