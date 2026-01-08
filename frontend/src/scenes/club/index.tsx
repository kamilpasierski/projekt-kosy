import Baner from "../../components/club/Baner";
import Description from "../../components/club/Description";
import Relations from "../../components/club/Relations";
import Incidents from "../../components/club/Incidents";
import MatchesTable from "../../components/MatchesTable";

export default function ClubPage() {
  return (
    <div className="w-full">
      <Baner />
      <Description />
      <Relations />
      <Incidents />
      <MatchesTable />
    </div>
  );
}
