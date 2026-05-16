import { CardDate } from './CardDate';
import { CardDesign } from './CardDesign';

export function Card({ currentTempData, getWeatherStatus, isCelsius, lastUpdated, activeIndex, changeTempUnit, allDistricts, currentDistrictInfo, updateNewDistrict  }) {
    return (
        <div className="card">
            <CardDate getWeatherStatus={getWeatherStatus} 
                lastUpdated={lastUpdated}
                activeIndex={activeIndex}
                allDistricts={allDistricts}
                currentDistrictInfo={currentDistrictInfo}
                updateNewDistrict={updateNewDistrict} />
            <CardDesign 
                currentTempData={currentTempData} 
                getWeatherStatus={getWeatherStatus} 
                isCelsius={isCelsius}
                changeTempUnit={changeTempUnit}
                activeIndex={activeIndex} />
        </div>
    );
}