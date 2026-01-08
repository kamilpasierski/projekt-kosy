import MapComponent from '../../components/map/Map';
import SafetyCheck from '../../components/map/SafetyCheck';
import Legend from '../../components/map/Legend';
import ClubList from '../../components/map/ClubList';

const MapScene = () => {
    return (
        <section className="mx-auto w-5/6 pt-24 pb-20 md:h-5/6">
            <div className="md:mt-16 mx-auto">
                <SafetyCheck />
                <MapComponent />
                <Legend />
                <ClubList />
            </div>
        </section>
    );
};

export default MapScene;