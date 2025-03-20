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
    footer={
      source && <a href={source} className="text-red-600 underline text-xs absolute bottom-4 right-6">source</a>
    }
    content={
      <div className="h-fit">
        <p>
          {content}
        </p>
        
      </div>
    }
    onSelect={onSelect}
    onDeselect={onDeselect}
    rowSpan={rowSpan}
    colSpan={colSpan}
    className={className}
  />
}

export default NewsCard;