import dayjs from "dayjs";
import './CardDesign.css';
import { useRef, useEffect } from "react";

export function CardDesign({ currentTempData, getWeatherStatus, isCelsius, activeIndex, changeTempUnit }) {
    const temp = currentTempData?.hourly?.temperature_2m;
    const time = currentTempData?.hourly?.time;
    const currentStatusWallpaper = getWeatherStatus(activeIndex)?.wallpaper;

    function convertToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }

    // const latVal = currentDistrictInfo?.lat;
    // const lonVal = currentDistrictInfo?.lon;
    // const currentLat = latVal?.toString().replace('.', '') ?? '';
    // const currentLon = lonVal?.toString().replace('.', '') ?? '';
    // const triggerKey = (time?.[activeIndex] != null && temp?.[activeIndex] != null && latVal != null && lonVal != null)
    //     ? `${dayjs(time[activeIndex]).valueOf()}-${Math.round(temp[activeIndex])}-${currentLat}-${currentLon}`
    //     : 'initial';
    const triggerKey = currentTempData?.hourly?.temperature_2m.join('').replaceAll('.', '');

    const scrollRef = useRef(null);
    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        requestAnimationFrame(() => {
            el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        });

        // console.log(el.scrollWidth, el.clientWidth);
    }, [triggerKey]);

    return (
        <>
            <div className="temperature-display-container" style={{ backgroundImage: `url(${currentStatusWallpaper})` }}>
                <div key={triggerKey} className={`temperature-display-layer design-fade-in`}>
                    <div className="temperature-status">
                        <div onClick={changeTempUnit} className="temp-heading-wrapper">
                            <p className={`temp-heading ${isCelsius ? 'visible' : 'hidden'}`}>{Math.round(temp?.[activeIndex])}&deg;C</p>
                            <p className={`temp-heading ${isCelsius ? 'hidden' : 'visible'}`}>{Math.round(convertToFahrenheit(temp?.[activeIndex]))}&deg;F</p>
                        </div>
                        <p className='weather-status'>{getWeatherStatus(activeIndex)?.status}</p>
                    </div>
                    <div className="past-forecast" style={{ backgroundColor: getWeatherStatus(activeIndex)?.listBgColor }} >
                        <div ref={scrollRef}>
                            {(() => {
                                if (!time || time.length === 0) return null;
                                let start = activeIndex - 12;
                                if (start < 0) start = 0;
                                if (start + 25 > time.length) start = time.length - 25;
                                // extra safety (important)
                                if (start < 0) start = 0;
                                return [...Array(25)].map((_, i) => {
                                    const dataIndex = start + i;
                                    return (
                                        <div key={i} className={`time-icon-temp ${dataIndex === activeIndex ? 'main' : ''}`}>
                                            <p>{dayjs(time[dataIndex]).format('HH:00')}</p>
                                            <img src={getWeatherStatus(dataIndex)?.icon} alt="Icon" className="icon" />
                                            <div className="list-temp-container">
                                                <p className={`${isCelsius ? 'visible' : 'hidden'}`}>
                                                    {Math.round(temp[dataIndex])}&deg;C
                                                </p>
                                                <p className={`${!isCelsius ? 'visible' : 'hidden'}`}>
                                                    {Math.round(convertToFahrenheit(temp[dataIndex]))}&deg;F
                                                </p>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}