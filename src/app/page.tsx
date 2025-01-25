import { ModeToggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center">
       <Button>Click me</Button>  
       <ModeToggle/>
    </div>
  );
}
