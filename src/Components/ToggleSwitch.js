import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const ToggleSwitch = ({ props }) => {
    const { isList, handleToggle } = props;

    const handleAlignmentChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            handleToggle();
        }
    };

    return (
        <ToggleButtonGroup
            size="small"
            color="primary"
            value={isList ? 'elenco' : 'contabilita'}
            exclusive
            onChange={handleAlignmentChange}
            aria-label="Small sizes"
        >
            <ToggleButton
                value="elenco"
                className="py-0 px-4 text-sm"
            >
                Elenco
            </ToggleButton>
            <ToggleButton
                value="contabilita"
                className="py-0 px-4 text-sm"
            >
                Contabilità
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ToggleSwitch;
