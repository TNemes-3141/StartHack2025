import { Card, CardHeader, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import React, { MouseEvent, useState } from "react";
import { secondary_font } from "@/lib/fonts";

const CardContainer = ({
  id,
  title, // In this case the title is the subscript
  content,
  onSelect,
  onDeselect,
  rowSpan = "1",
  colSpan = "1",
  className,
}: {
  id: string;
  title?: string;
  content?: string;
  onSelect?: (cardID: string) => void;
  onDeselect?: (cardID: string) => void;
  rowSpan?: string,
  colSpan?: string,
  className?: string;
}) => {
  const [isSelected, setIsSelected] = useState(false);

  // Toggles selection state
  const toggleSelection = () => {
    if (!isSelected && onSelect) {
      onSelect(id);
    } else if (isSelected && onDeselect) {
      onDeselect(id);
    }
    setIsSelected(!isSelected);
  };

  // Handle shift-click anywhere on the card
  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      toggleSelection();
    }
  };

  return (
    <div
      className={cn("cardContainer h-full max-h-full", className)}
      onClick={onCardClick}
      // style={{
      //   gridColumn: `span ${colSpan} / span ${colSpan}`,
      //   gridRow: `span ${rowSpan} / span ${rowSpan}`
      // }}
    >
      <Card className={cn(
        "h-full border-none",
        isSelected && "outline-red-600 outline-2 outline-offset-0",
      )}>
        <CardBody className={cn((content) && "h-fit", "flex justify-center items-center") } >
          <p className={cn("text-7xl font-semibold", secondary_font.className)}>{content ? content : ""}</p>
          <p className="text-lg text-slate-500 mt-4">{title}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardContainer;
