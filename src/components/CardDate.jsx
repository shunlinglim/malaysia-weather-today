import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";
import './CardDate.css';

export function CardDate({ getWeatherStatus, lastUpdated, activeIndex, allDistricts, currentDistrictInfo, updateNewDistrict }) {
    const [ isInputting, setIsInputting ] = useState(false);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ activeDistrict, setActiveDistrict ] = useState(0);
    const selectRef = useRef(null);
    const inputRef = useRef(null);
    const activeItemRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isInputting && selectRef.current && !selectRef.current.contains(event.target)) {
                setIsInputting(false);
                setSearchTerm('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isInputting]);

    const changeDistrict = () => {
        setIsInputting(!isInputting);
    };

    useEffect(() => {
        if (isInputting && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInputting]);

    const filteredResults = allDistricts.filter((item) => {
        const search = searchTerm.toLowerCase().trim();
        
        return item.searchBlob.includes(search);
    });

    const handleSearchChange = (inputDistrict) => {
        const value = inputDistrict.target.value;
        setSearchTerm(value);
        setActiveDistrict(0); 
    }; 
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && filteredResults.length > 0) {
            const selectedItem = filteredResults[activeDistrict];
            setIsInputting(false);
            setSearchTerm("");
            updateNewDistrict(selectedItem);
        } else if (e.key === "ArrowDown") {
            e.preventDefault(); // Prevent cursor from jumping in the input
            setActiveDistrict(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveDistrict(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
        }
    };

    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: 'smooth', // Smooth scrolling looks better for portfolios
                block: 'nearest',   // Only scrolls if the item is actually hidden
            });
        }
    }, [activeDistrict]);

    // const [uniqueKey, setUniqueKey] = useState(dayjs().valueOf());

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setUniqueKey(dayjs().valueOf());
    //     }, 2000);
    //     return () => clearInterval(interval);
    // }, []);
    const uniqueKey = dayjs(lastUpdated).startOf('day').valueOf();
    const day = dayjs(lastUpdated).format('DD');
    const month = dayjs(lastUpdated).format('MMM');
    const year = dayjs(lastUpdated).format('YYYY');
    const week = dayjs(lastUpdated).format('dddd');
    const dateOne = dayjs(lastUpdated).format('DD MMM YYYY');
    const dateTwo = dayjs(lastUpdated).format('DD/MM/YYYY  (ddd)');
    const dateThree = dayjs(lastUpdated).format('D/M/YYYY  (ddd)');

    const currectStatusdateBg = getWeatherStatus(activeIndex)?.dateBg;
    const currentStatusDateTextColor = getWeatherStatus(activeIndex)?.dateTextColor;
    const currentStatusDateTextColorWeek = getWeatherStatus(activeIndex)?.dateTextColorWeek;
    const currentStatusInputColor = getWeatherStatus(activeIndex)?.inpBg;
    const currentStatusInputPlaceholder = getWeatherStatus(activeIndex)?.inpPlaceholder;
    const currentStatusOptionBg = getWeatherStatus(activeIndex)?.optionBg;
    const currentStatusOptionSelectedBg = getWeatherStatus(activeIndex)?.optionSelectedBg;
    const currentStatusOptionUnselectedTextColor = getWeatherStatus(activeIndex)?.optionUnselectedTextColor;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '15px sans-serif';
    const textWidth = context.measureText(currentDistrictInfo.district).width;
    const isSmall = textWidth > 125;
    
    return (
        <>
            <div className="side-container" style={{ backgroundColor: currectStatusdateBg, color: currentStatusDateTextColor }}>
                <div key={uniqueKey}>
                    <div className="flex-column">
                        <div className='date-flex'>
                            <p className="day animate-update">{day}</p>
                            <div>
                                <p className="month animate-update">{month}</p>
                                <p className="year animate-update">{year}</p>
                            </div>
                        </div>
                        <p className="week animate-update" style={{color: currentStatusDateTextColorWeek}}>{week}</p>
                    </div>
                    <p className="first date animate-update">{dateOne}</p>
                    <p className="first animate-update">{week}</p>
                    <p className="second animate-update">{dateTwo}</p>
                    <p className="third animate-update">{dateThree}</p>
                </div>

                <p onClick={changeDistrict} className={`district ${isInputting ? 'hidden' : ''} ${isSmall ? 'small-text' : ''}`} style={{'--text-color': currentStatusDateTextColor}}>{currentDistrictInfo.district}</p>

                <div ref={selectRef} className={`${isInputting ? 'select-district active' : 'select-district hidden' }`}>
                    <div className="option-district" style={{backgroundColor: currentStatusOptionBg, color: currentStatusOptionUnselectedTextColor}}>
                        <div style={{'--hover-bg-color': currentStatusOptionSelectedBg, '--hover-text-color': currentStatusDateTextColor}}>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((item, index) => (
                                    <div key={`${item.state}-${item.district}`}
                                        ref={index === activeDistrict ? activeItemRef : null}
                                        className={`option-district-item ${index === activeDistrict ? 'active' : ''}`} 
                                        onMouseEnter={() => setActiveDistrict(index)}
                                        onClick={() => {
                                            setIsInputting(false);
                                            setSearchTerm("");
                                            updateNewDistrict(item);
                                        }}>
                                            {item.district}
                                    </div>
                                ))
                            ) : (
                                <div className="option-district-item no-result-msg">Unavailable</div>
                            )}
                        </div>
                    </div>
                    <input 
                        autoFocus 
                        ref={inputRef} 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        spellCheck="false" 
                        type="text" 
                        placeholder="e.g. Kuala Lumpur"
                        style={{ backgroundColor: currentStatusInputColor, color: currentStatusDateTextColor, '--placeholder-color': currentStatusInputPlaceholder, caretColor: currentStatusOptionUnselectedTextColor }}/>
                </div>
            </div>
        </>
    );
}