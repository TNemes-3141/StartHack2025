import { Card, CardHeader, CardBody } from '@heroui/react';
import { Checkbox } from '@heroui/react';
import { cn } from "@/lib/utils";
import React, { ChangeEvent, useState } from 'react';




const CardContainer = ({
  id,
  title,
  content,

  onSelect,
  onDeselect,
  className,
}: { 
  id: string,
  title?: string, 
  content?: string | React.ReactElement, 

  onSelect?: (cardID: string) => void,
  onDeselect?: (cardID: string) => void,
  className?: string,
}) => {
  const [state, setState] = useState(false)

  const onChange = (e: ChangeEvent) => {
    if (e.type === "change") {
      if (onSelect !== undefined && !state) {
        onSelect(id);
      } else if (onDeselect !== undefined && state) {
        onDeselect(id);
      }
      setState(!state)
    }
  }


  return (
    <div className={cn(
      "cardContainer h-full",
      className,
    )}>
      <Card className='h-full'>
        <CardHeader>
          <Checkbox onChange={(e) => onChange(e)}/>
          <p>{title}</p>
        </CardHeader>
        <CardBody>
          {content ? content : ""}
        </CardBody>
      </Card>
    </div>
  );
};

export default CardContainer;