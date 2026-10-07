import { Button } from '@mui/material'
import { nextLanguageLabel, switchLanguage } from '../../../language/config.ts'

export default function LanguageSwitch() {

    return (
        <Button
            variant="outlined"
            size="small"
            onClick={() => {
                void switchLanguage()
            }}
        >
            {nextLanguageLabel()}
        </Button>
    )
}
