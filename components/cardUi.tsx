
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ReactNode } from "react";

type Props = {
  title: string;
};

function CardUi({title}:Props) {
    return (

        <Card className="flex flex-col justify-between p-5 w-[33%]">
            <CardHeader className="flex justify-between gap-10">
                <span>0</span>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardFooter className="items-end justify-end">
                <p>date</p>
            </CardFooter>
        </Card>
    );
}

export default CardUi;
