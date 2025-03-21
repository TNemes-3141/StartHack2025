import { cn } from "@/lib/utils";
import { Card, CardBody, CardHeader, ScrollShadow } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import { MouseEvent, useEffect, useState } from "react";


const TableCard = ({
  id,
  title,
  tableHeader,
  tableData,
  onSelect,
  onDeselect,
  toggleCellSelect,
  rowSpan = "1",
  colSpan = "1",
  className,
}: {
  id: string;
  title?: string;
  tableHeader?: string[],
  tableData?: {
    [key: string]: string
  }[],
  onSelect?: (cardID: string) => void;
  onDeselect?: (cardID: string) => void;
  toggleCellSelect?: (type: "select" | "deselect", cardID: string, x: number, y: number, cellContent: string) => void;
  rowSpan?: string,
  colSpan?: string,
  className?: string;
}) => {

  const [isSelected, setIsSelected] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    x: number,
    y: number
  }>({
    x: -1,
    y: -1
  });

  // data is provided in a 2D array:

  // Toggles selection state
  const toggleSelection = () => {
    if (!isSelected && onSelect) {
      onSelect(id);
      
      toggleCellSelect && toggleCellSelect("deselect", id, -1, -1, "")
    } else if (isSelected && onDeselect) {
      onDeselect(id);
    }
    setIsSelected(!isSelected);
  };

  // Handle shift-click anywhere on the card
  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      toggleSelection();
      setSelectedCell({
        x: -1,
        y: -1
      });
    }
  };

  const onCellClick = (e: MouseEvent<HTMLDivElement>, content: string, idx: number, idy: number) => {
    e.stopPropagation();
    // console.log("stuff");
    if (e.ctrlKey || e.metaKey) {
      // console.log("selected")
      if (selectedCell.x == idx && selectedCell.y == idy) {
        setSelectedCell({
          x: -1,
          y: -1
        })
        console.log("toggleCellSelect")
        toggleCellSelect && toggleCellSelect("deselect", id, -1, -1, "")
      } else {
        setSelectedCell({
          x: idx,
          y: idy
        })
        toggleCellSelect && toggleCellSelect("select", id, idx, idy, content)
      }
    }
    /*
    if (onDeselect && toggleCellSelect) {
      if (e.ctrlKey || e.metaKey) {
        console.log("selected a specific cell");
        if (selectedCell.x == idx && selectedCell.y == idy) {
          setSelectedCell({
            x: -1,
            y: -1
          })
        } else {
          setSelectedCell({
            x: idx,
            y: idy
          })
          toggleCellSelect(content)
          setIsSelected(false);
          onDeselect(id)
        }
      } 
    }*/
    
  };

  let formatedData: string[][] = [];
  if (tableData && tableHeader) {
    for (let i=0; i<tableData.length; i++) {
      const row = tableData[i];
      formatedData.push(Object.values(row))

      for (const key of Object.keys(row)) {
        const idx = tableHeader.indexOf(key);
        if (idx != -1) {
          formatedData[i][idx] = row[key];
        }
      }

    }
  }



  return (
    <div
      className={cn("cardContainer h-full max-h-96", className)}
      onClick={onCardClick}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`
      }}
    >
      <Card className={cn(
        "h-full border-none",
        isSelected && "outline-red-600 outline-2 outline-offset-0",
      )}>
        <CardHeader>
          <h2>{title}</h2>
        </CardHeader>
        {
          tableHeader && tableData && <CardBody className="h-fit pt-0">
            <ScrollShadow hideScrollBar orientation="horizontal">
              <Table className="w-fit [&>div]:shadow-none [&>div]:pt-0">
                <TableHeader>
                  {
                    tableHeader.map((heading, idx) => {
                      return <TableColumn key={idx}>{heading}</TableColumn>
                    })
                  }
                </TableHeader>
                <TableBody>
                  {
                    formatedData.map((row, idx) => {
                      return <TableRow key={idx}>
                        {
                          row.map((cell, idy) => {
                            return <TableCell 
                              className={
                                cn(
                                  "cursor-pointer",
                                  selectedCell.x == idx && selectedCell.y == idy && "outline-red-600 outline-2 outline-offset-0",
                                )
                              }
                              key={idy}
                              onClick={(e) => {
                                onCellClick(e, cell, idx, idy)
                              }}
                            >
                              {cell}
                            </TableCell>
                          })
                        }
                      </TableRow>
                    })
                  }
                </TableBody>
              </Table>
            </ScrollShadow>
          </CardBody>
        }
      </Card>
    </div>
  );
};



export default TableCard;