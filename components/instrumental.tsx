import { Button } from "@/components/ui/button"


interface InstruProps {
  nom: string
  date: string
  url: string
}

function Instru({ nom, date, url }: InstruProps ) {
    return ( 
        <div className="flex justify-around items-center">
            <span>{nom}</span>
            <span> {date} </span>
            <span><a href="#"> {url} </a></span>
            <div className="flex justify-center items-center w-[99.7px]">
                    <Button className="rounded-full bg-blue-300 w-[99.2px]"><span className="text-xl p-0">. . .</span></Button>
                   
                </div>
        </div>
     );
}

export default Instru;