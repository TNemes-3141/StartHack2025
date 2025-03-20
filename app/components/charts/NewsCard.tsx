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
        {
          source && <a href={source} className="text-blue-500 underline text-xs flex justify-end">source</a>
        }
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