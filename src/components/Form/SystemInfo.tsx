import React from "react";
import {FormWrapper} from "./FormWrapper";
import styles from './SystemInfo.module.css';

type SystemData = {
    dcSystemSize: number
    moduleType: number
    arrayType: number
    systemLosses: number
    tilt: number
    azimuth: number
}

type SystemDataProps = SystemData & {
    updateFields: (fields: Partial<SystemData>) => void
}

function SystemInfo({
                        dcSystemSize,
                        moduleType,
                        arrayType,
                        systemLosses,
                        tilt,
                        azimuth,
                        updateFields
                    }: SystemDataProps) {

    return (
        <FormWrapper title={"System Info"}>
            <div className={styles['subheader']}>Modify the inputs below to run the simulation:</div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="dcSystemSize">DC System Size (kW):</label>
                <input className={styles['input']} type="number" id="dcSystemSize" name="dcSystemSize" step="0.01"
                       min="0.05" max="500000" value={dcSystemSize}
                       onChange={e => updateFields({dcSystemSize: parseInt(e.target.value)})}/>
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="moduleType">Module Type:</label>
                <select className={styles['input']} id="moduleType" name="moduleType" value={moduleType}
                        onChange={e => updateFields({moduleType: parseInt(e.target.value)})}>
                    <option value="0">Standard</option>
                    <option value="1">Premium</option>
                    <option value="2">Thin film</option>
                </select>
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="arrayType">Array Type:</label>
                <select className={styles['input']} id="arrayType" name="arrayType" value={arrayType}
                        onChange={e => updateFields({arrayType: parseInt(e.target.value)})}>
                    <option value="0">Fixed open rack</option>
                    <option value="1">Fixed roof mounted</option>
                    <option value="2">1-axis</option>
                    <option value="3">1-axis backtracking</option>
                    <option value="4">2-axis</option>
                </select>
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="systemLosses">System Losses (%):</label>
                <input className={styles['input']} type="number" id="systemLosses" name="systemLosses" step="0.01"
                       min="0" max="90" value={systemLosses}
                       onChange={e => updateFields({systemLosses: parseFloat(e.target.value)})}/>
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="tilt">Tilt (deg):</label>
                <input className={styles['input']} type="number" id="tilt" name="tilt" step="0.01" min="0" max="90"
                       value={tilt}
                       onChange={e => updateFields({tilt: parseFloat(e.target.value)})}/>
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="azimuth">Azimuth (deg):</label>
                <input className={styles['input']} type="number" id="azimuth" name="azimuth" step="0.01" min="0"
                       max="360" value={azimuth}
                       onChange={e => updateFields({azimuth: parseFloat(e.target.value)})}/>
            </div>
        </FormWrapper>
    );
}

export default SystemInfo;