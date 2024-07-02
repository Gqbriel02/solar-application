import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {FormWrapper} from "./FormWrapper";
import styles from './SystemInfo.module.css';
import Error from '../Error/Error';

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

const SystemInfo = forwardRef(({
                                   dcSystemSize,
                                   moduleType,
                                   arrayType,
                                   systemLosses,
                                   tilt,
                                   azimuth,
                                   updateFields,
                               }: SystemDataProps, ref) => {

    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        dcSystemSize: null,
        systemLosses: null,
        tilt: null,
        azimuth: null
    });

    const arrayTypeChangedRef = useRef(false);

    useEffect(() => {
        if (!arrayTypeChangedRef.current) {
            if (arrayType === 2 || arrayType === 3 || arrayType === 4) {
                updateFields({tilt: 0});
            } else if (arrayType === 0 || arrayType === 1) {
                updateFields({tilt: 20});
            }
            arrayTypeChangedRef.current = true;
        }
    }, [arrayType, updateFields]);

    useImperativeHandle(ref, () => ({
        validate: () => {
            const newErrors: { [key: string]: string | null } = {
                dcSystemSize: null,
                systemLosses: null,
                tilt: null,
                azimuth: null
            };
            let valid = true;

            if (dcSystemSize < 1 || dcSystemSize > 50) {
                newErrors.dcSystemSize = "Insert a value between 1 and 50 kW";
                valid = false;
            }

            if (systemLosses < 0 || systemLosses > 100) {
                newErrors.systemLosses = "Insert a value between 0 and 100. Usually, the system losses are between 14% and 20%";
                valid = false;
            }

            if (tilt < 0 || tilt > 90) {
                newErrors.tilt = "Insert a value between 0 and 90";
                valid = false;
            }

            if (azimuth < 0 || azimuth > 360) {
                newErrors.azimuth = "Insert a value between 0 and 360";
                valid = false;
            }

            setErrors(newErrors);
            return valid;
        }
    }));

    return (
        <FormWrapper title={"System Info"}>
            <div className={styles['subheader']}>Modify the inputs below to run the simulation:</div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="dcSystemSize">DC System Size (kW):</label>
                <input className={styles['input']} type="number" id="dcSystemSize" name="dcSystemSize"
                       value={dcSystemSize}
                       onChange={e => updateFields({dcSystemSize: parseInt(e.target.value)})}/>
                {errors.dcSystemSize && <Error errorMessage={errors.dcSystemSize}/>}
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
                        onChange={e => {
                            arrayTypeChangedRef.current = false;
                            updateFields({arrayType: parseInt(e.target.value)});
                        }}>
                    <option value="0">Fixed open rack</option>
                    <option value="1">Fixed roof mounted</option>
                    <option value="2">1-axis tracking</option>
                    <option value="3">1-axis backtracking</option>
                    <option value="4">2-axis tracking</option>
                </select>
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="systemLosses">System Losses (%):</label>
                <input className={styles['input']} type="number" id="systemLosses" name="systemLosses"
                       value={systemLosses}
                       onChange={e => updateFields({systemLosses: parseFloat(e.target.value)})}/>
                {errors.systemLosses && <Error errorMessage={errors.systemLosses}/>}
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="tilt">Tilt (deg):</label>
                <input className={styles['input']} type="number" id="tilt" name="tilt" value={tilt}
                       onChange={e => updateFields({tilt: parseFloat(e.target.value)})}
                       disabled={arrayType === 2 || arrayType === 3 || arrayType === 4}/>
                {errors.tilt && <Error errorMessage={errors.tilt}/>}
            </div>
            <div className={styles['input-group']}>
                <label className={styles['label']} htmlFor="azimuth">Azimuth (deg):</label>
                <input className={styles['input']} type="number" id="azimuth" name="azimuth" value={azimuth}
                       onChange={e => updateFields({azimuth: parseFloat(e.target.value)})}/>
                {errors.azimuth && <Error errorMessage={errors.azimuth}/>}
            </div>
        </FormWrapper>
    );
});

export default SystemInfo;