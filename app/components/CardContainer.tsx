import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { cn } from "@/lib/utils";
import React, { MouseEvent, useState } from "react";

const CardContainer = ({
  id,
  title,
  content,
  footer,
  onSelect,
  onDeselect,
  rowSpan = "1",
  colSpan = "1",
  pt_0 = false,
  className,
}: {
  id: string;
  title?: string;
  content?: string | React.ReactElement;
  footer?: string | React.ReactElement
  onSelect?: (cardID: string) => void;
  onDeselect?: (cardID: string) => void;
  rowSpan?: string,
  colSpan?: string,
  pt_0?: boolean
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

  const spanningStyles = colSpan && rowSpan && {
    gridColumn: `span ${colSpan} / span ${colSpan}`,
    gridRow: `span ${rowSpan} / span ${rowSpan}`
  }

  return (
    <div
      className={cn("cardContainer w-full h-[325px] overflow-y-hidden", className)}
      onClick={onCardClick}
      style={spanningStyles || {}}
    >
      <Card className={cn(
        "h-full border-none",
        isSelected && "outline-red-600 outline-2 outline-offset-0",
      )}>
        <CardHeader>
          <h2>{title}</h2>
        </CardHeader>
        <CardBody className={cn("overflow-y-hidden", (content) && "h-fit", pt_0 && "pt-0") } >{content ? content : ""}</CardBody>
        {footer && <CardFooter className="h-fit flex justify-end">{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default CardContainer;
