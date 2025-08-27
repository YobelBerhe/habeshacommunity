import BoardsGrid from "@/components/forums/BoardsGrid";
import { useNavigate } from "react-router-dom";
import { getAppState } from "@/utils/storage";

export default function ForumsBoards() {
  const navigate = useNavigate();
  const city = getAppState().city || "Select a city";
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Forums — {city}</h1>
      <BoardsGrid onOpenBoard={(key)=>navigate(`/forums/${key}`)} />
    </div>
  );
}