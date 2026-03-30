import Image from "next/image";
import Main from "./pages/Main";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <Main />
    </div>
  );
}
