import React, {useState} from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const questionsAndAnswers = [
        {
            question: "Why use solar panels instead of normal electricity?",
            answer: "Solar panels provide a renewable and sustainable source of energy. Unlike fossil fuels, solar energy is abundant and reduces greenhouse gas emissions, contributing to a healthier environment. Additionally, using solar panels can reduce electricity bills and provide energy independence."
        },
        {
            question: "How do photovoltaic systems work?",
            answer: "Photovoltaic systems convert sunlight directly into electricity using solar cells. These cells are made of semiconductor materials that generate electric current when exposed to sunlight. The generated electricity can then be used to power homes or fed back into the grid."
        },
        {
            question: "What is the purpose of this platform?",
            answer: "Our platform is designed to help users analyze and optimize the efficiency of their photovoltaic systems. By inputting specific system characteristics and location data, users can receive detailed reports on their system's power output and potential improvements."
        },
        {
            question: "How does the platform calculate the power output of photovoltaic systems?",
            answer: "The platform uses an API that considers various system characteristics such as system capacity, module type, array type, losses, tilt, and azimuth, along with the geographic location provided by the user. These inputs are processed to estimate the photovoltaic power output accurately."
        },
        {
            question: "Can this platform be used for any location worldwide?",
            answer: "Yes, our platform is designed to work for any location worldwide. By placing a pin on the map, the platform retrieves location-specific data necessary for accurate photovoltaic power output analysis."
        },
        {
            question: "What types of photovoltaic modules are supported?",
            answer: "The platform supports various types of photovoltaic modules, including monocrystalline, polycrystalline and thin-film modules. You can select the module type that matches your system for a more accurate analysis."
        },
        {
            question: "How often should I analyze my photovoltaic system's efficiency?",
            answer: "It is recommended to analyze your photovoltaic system's efficiency at least once a year or after any significant changes to the system or its surroundings. Regular analysis helps in identifying potential improvements and maintaining optimal performance."
        }
    ];

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className={styles['container']}>
            <p>
                Welcome to our platform for efficiency analysis and optimization of photovoltaic systems. Below are some
                frequently asked questions to help you understand our services better.
            </p>
            <div className={styles['accordion']}>
                {questionsAndAnswers.map((qa, index) => (
                    <div key={index} className={styles['accordionItem']}>
                        <div className={styles['accordionHeader']} onClick={() => toggleAccordion(index)}>
                            <h3>{qa.question}</h3>
                            <span>{activeIndex === index ? '-' : '+'}</span>
                        </div>
                        <div
                            className={`${styles['accordionContent']} ${activeIndex === index ? styles['active'] : ''}`}>
                            <p>{qa.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
