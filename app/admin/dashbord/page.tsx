import CardUi from "@/components/cardUi";
import DisplayInstru from "@/components/displayInstru";

function Dash() {
    return ( 
        <div className="flex flex-col gap-10 p-3 h-full">
            
            {/* analytic data */}
            <section className="flex gap-5 w-full h-40">
                 <CardUi title={"Vente"}/>
                 <CardUi title={"Visiteur"}/>
                 <CardUi title={"Appreciation"}/>
            </section>

            {/* music production  */}
            <section>
                <DisplayInstru/>
            </section>
            

        </div>
     );
}

export default Dash;