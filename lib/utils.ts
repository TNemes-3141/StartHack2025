import { ChatHistory } from "@/app/page";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";


/* Function that can be used to merge Tailwind classnames from variables with static classnames, even conditionally if needed
Example: <body className={cn("flex flex-col min-h-screen bg-background antialiased", primary_font.className)}>
*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (n: number) => {
  let number = n;
  let suffix = [97, 92];
  let newNumber = "";

  if (n < 1000) {
        return n.toFixed(1);
      } else if (n < 1000000) {
          return (n / 1000).toFixed(2) + 'K';
      } else if (n < 1000000000) {
          return (n / 1000000).toFixed(2) + 'M'; 
      } else if (n < 1000000000000) {
          return (n / 1000000000).toFixed(2) + 'B';
      } else if (n < 1000000000000000){
          return (n / 1000000000000).toFixed(2) + 'T';
      } 

  while (number > 1000) {
    (number /= 1000);
    if (suffix[1] < 122) {
      suffix[1]++;
    } else {
      suffix[0]++;
      suffix[1] = 97
    } 
  }

  newNumber = number.toFixed(2);
     
  return newNumber + String.fromCharCode(suffix[0]) + String.fromCharCode(suffix[1]);
}

export function generatePDF(history: ChatHistory) {

  const doc = new jsPDF();
  let yOffset = 10;

  doc.setFont("helvetica");

  history.forEach(({ sender, message }) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${sender.toUpperCase()}:`, 10, yOffset);
    yOffset += 6;
    
    const splitMessage = doc.splitTextToSize(message, 180);
    doc.text(splitMessage, 10, yOffset);
    yOffset += splitMessage.length * 6 + 4;
    
    if (yOffset > 280) {
      doc.addPage();
      yOffset = 10;
    }
  });

  doc.save("interaction_log.pdf");

}