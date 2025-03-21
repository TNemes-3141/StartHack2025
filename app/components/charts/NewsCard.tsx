import { cn } from "@/lib/utils";
import CardContainer from "../CardContainer";

// this name makes no sense
const NewsCard = ({
  id,
  title,
  content,
  source,
  onSelect,
  onDeselect,
  rowSpan = "1",
  colSpan = "1",
  className,
}: {
  id: string;
  title?: string;
  content?: string | React.ReactElement;
  source?: string
  onSelect?: (cardID: string) => void;
  onDeselect?: (cardID: string) => void;

  rowSpan?: string,
  colSpan?: string,
  className?: string;
}) => {
  return <CardContainer 
    id={id}
    title={title}
    content={
      <div className="h-full">
        <p>
          {content}
        </p>
        
      </div>
    }
    footer={
      source && <a href={source} className="text-blue-500 underline text-xs flex justify-end">source</a>
    }
    onSelect={onSelect}
    onDeselect={onDeselect}
    rowSpan={rowSpan}
    colSpan={colSpan}
    className={cn(className, "max-h-96")}
  />
}

export default NewsCard;