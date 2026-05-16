import { useEffect, useState } from 'react';
import './Button.css';

export function Button({ getWeatherStatus, isCelsius, changeTempUnit, activeIndex }) {
    const [prevGradient, setPrevGradient] = useState(getWeatherStatus(activeIndex)?.gradient);

    const currentStatusbtnBg = getWeatherStatus(activeIndex)?.btnBg;
    const currentStatusbtnUnselectedTextColor = getWeatherStatus(activeIndex)?.btnUnselectedTextColor;
    const currentStatusGradient = getWeatherStatus(activeIndex)?.gradient;

    useEffect(() => {
        const timer = setTimeout(() => {
            setPrevGradient(currentStatusGradient);
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentStatusGradient]);

    const switchTransform = isCelsius
        ? 'translateY(-12.5px)'
        : 'translateY(12.5px)';

    return (
        <div className="toggle-btn-background" onClick={changeTempUnit} style={{ backgroundColor: currentStatusbtnBg, color: currentStatusbtnUnselectedTextColor }}>
            <div className="toggle-btn-switch" style={{ transform: switchTransform }}>
                <div className="gradient-layer gradient-fade-out" key={`out-${prevGradient}`} style={{ backgroundImage: prevGradient }}></div>
                <div className="gradient-layer gradient-fade-in" key={`in-${currentStatusGradient}`} style={{ backgroundImage: currentStatusGradient }}></div>
            </div>
            <div className={`btn ${isCelsius ? 'on' : ''}`}>&deg;C</div>
            <div className={`btn ${isCelsius ? '' : 'on'}`}>&deg;F</div>
        </div>
    );
}