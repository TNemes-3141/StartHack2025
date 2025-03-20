"use client"

import { Card, CardHeader, CardBody } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, MouseEvent, useState } from "react";

const CardContainer = ({
  id,
  title,
  content,
  onSelect,
  onDeselect,
  className,
}: {
  id: string;
  title?: string;
  content?: string | React.ReactElement;
  onSelect?: (cardID: string) => void;
  onDeselect?: (cardID: string) => void;
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
    >
      <Card className={cn(
        "h-full border-none",
        isSelected && "outline-red-600 outline-2 outline-offset-0",
      )}>
        <CardHeader>
          <p>{title}</p>
        </CardHeader>
        <CardBody>{content ? content : ""}</CardBody>
      </Card>
    </div>
  );
};

export default CardContainer;
