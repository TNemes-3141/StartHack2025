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
      <>
        <p>
          {content}
        </p>
        {
          source && <a href={source}>source</a>
        }
      </>
    }
    onSelect={onSelect}
    onDeselect={onDeselect}
    rowSpan={rowSpan}
    colSpan={colSpan}
    className={className}
  />
}

export default NewsCard;